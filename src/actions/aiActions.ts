"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import Project from "@/models/Project";
import { serializeTask, serializeProject } from "@/lib/utils";
import { getUserIdFromToken } from "@/lib/authHelper";
import { logAIAction } from "./aiAnalyticsActions";

// Initialize AI Client - Using v1 for better stability with production models
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const forceNumber = (val: any) => {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const num = parseInt(val.replace(/\D/g, ""));
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

/**
 * Helper: Retry logic with exponential backoff for AI transient errors (503, 429).
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 5, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRetryable = error.message?.includes("503") ||
      error.message?.includes("504") ||
      error.message?.includes("429") ||
      error.status === 503 ||
      error.status === 429;

    if (isRetryable && retries > 0) {
      console.warn(`[Gemini 3.1] Service busy. Retrying in ${delay}ms... (${retries} left)`);
      await new Promise(res => setTimeout(res, delay));
      // More aggressive backoff for preview models
      const nextDelay = Math.min(delay * 2, 8000);
      return withRetry(fn, retries - 1, nextDelay);
    }
    throw error;
  }
}

/**
 * Robust AI Caller: Tries the specified 'primary' model first. 
 * If it's down (503/High Demand), it falls back to 'gemini-1.5-flash' to ensure the user gets a result.
 */
async function generateContentWithFallback(prompt: string, primaryModel: string = "gemini-3.1-flash-lite-preview", jsonMode: boolean = false) {
  const tryModel = async (modelId: string, currentRetries: number = 2) => {
    const model = genAI.getGenerativeModel({ model: modelId });
    return await withRetry(() => model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      ...(jsonMode ? { generationConfig: { responseMimeType: "application/json" } } : {}),
    }), currentRetries);
  };

  try {
    // Try the preview model you want first (with 5 retries)
    return await tryModel(primaryModel, 5);
  } catch (error: any) {
    console.error(`[AI Error] Primary model ${primaryModel} failed:`, error.message);

    // Fallback only if the error suggests temporary overload or if model is just plain missing (preview issues)
    const isRetryableError = error.message?.includes("503") || error.message?.includes("demand") || error.message?.includes("404");

    if (isRetryableError) {
      console.warn(`[AI] Attempting final retry with gemini-3.1-flash-lite-preview...`);
      try {
        return await tryModel("gemini-3.1-flash-lite-preview", 3);
      } catch (fallbackError: any) {
        console.error(`[AI Error] Final attempt with gemini-3.1-flash-lite-preview failed:`, fallbackError.message);
        throw error;
      }
    }
    throw error;
  }
}

/**
 * AI Action: Decompose a user's free-text prompt into a structured Task with subtasks.
 */
export async function decomposeTaskWithAI(prompt: string) {
  try {
    await dbConnect();
  } catch (dbError) {
    console.error("DB Connection Failure:", dbError);
    throw new Error("Database connection failed. Please check your MONGODB_URI.");
  }

  // Auth check
  const userId = await getUserIdFromToken();

  try {
    const aiPrompt = `
      System: You are an expert task management assistant. 
      Analyze the following user request and break it down into a main task and specific action items (subtasks).
      
      IMPORTANT: The response MUST be in Hebrew for all text fields (title, description, etc).
      
      User Request: "${prompt}"
      
      Return ONLY a JSON object with:
      - title: A concise primary task name in Hebrew.
      - description: A brief (1-2 sentence) summary in Hebrew.
      - tags: An array of 1-3 short Hebrew tags.
      - estimatedTime: A Number representing total minutes.
      - dueDate: ISO 8601 string or null.
      - subTasks: Array of objects { "title": "Hebrew title", "estimatedTime": Number, "status": "Todo" }.
    `;

    const result = await generateContentWithFallback(aiPrompt, "gemini-3.1-flash-lite-preview", true);

    const responseText = result.response.text();
    console.log("[AI Action] Raw Response Text:", responseText);
    if (!responseText) {
      throw new Error("AI returned an empty response. Check if your prompt is safe.");
    }

    let taskData;
    try {
      taskData = JSON.parse(responseText.trim());
    } catch (_parseError) {
      console.error("Failed to parse AI JSON. Raw output:", responseText);
      throw new Error("AI returned invalid data format.");
    }

    // Sanitize numeric fields from AI output
    if (taskData.estimatedTime) {
      taskData.estimatedTime = forceNumber(taskData.estimatedTime);
    }
    if (Array.isArray(taskData.subTasks)) {
      taskData.subTasks = taskData.subTasks.map((st: any) => ({
        ...st,
        estimatedTime: st.estimatedTime ? forceNumber(st.estimatedTime) : 0,
        status: st.status || "Todo"
      }));
    }

    const newTask = new Task({
      ...taskData,
      userId,
      status: "Todo",
      priority: "Medium",
    });

    await newTask.save();
    await logAIAction('decompose');
    return serializeTask(newTask);

  } catch (error: any) {
    console.error("AI Decomposition Error:", error);
    // Export the real error message to the UI for easier debugging
    throw new Error(`AI Decomposition Failed: ${error.message || "Unknown Error"}`);
  }
}

/**
 * AI Action: Generate actionable insights or recommendations for an existing task.
 */
export async function generateTaskInsights(taskId: string) {
  try {
    await dbConnect();
  } catch (_dbError) {
    throw new Error("Database connection failed.");
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    const aiPrompt = `
      Provide a high-level actionable insight or strategic tip for this task in HEBREW (RTL):
      Title: ${task.title}
      Description: ${task.description || "No description provided"}
      Subtasks: ${JSON.stringify(task.subTasks.map((s) => s.title))}
      
      Focus on efficiency and recommend the most critical next step. Keep the response to max 3 helpful sentences in Hebrew.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const result = await withRetry(() => model.generateContent({
      contents: [{ role: "user", parts: [{ text: aiPrompt }] }],
    }));

    const responseText = result.response.text();
    if (!responseText) throw new Error("AI returned no insights.");

    const insights = responseText.trim();

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { aiInsights: insights },
      { new: true }
    );

    await logAIAction('insights');
    return serializeTask(updatedTask);
  } catch (error: any) {
    console.error("AI Insight Error:", error);
    throw new Error(`AI Insights Failed: ${error.message || "Unknown error"}`);
  }
}

/**
 * AI Action: Analyze open tasks and automatically assign priorities.
 */
export async function analyzeAndPrioritize() {
  try {
    await dbConnect();
  } catch (_dbError) {
    throw new Error("Database connection failed.");
  }

  // Auth check
  const _userId = await getUserIdFromToken();

  try {
    const tasks = await Task.find({ status: { $ne: "Done" } })
      .sort({ createdAt: -1 })
      .limit(50);

    if (tasks.length === 0) return [];

    const taskData = tasks.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      dueDate: t.dueDate,
      subTasksCount: t.subTasks.length,
    }));

    const aiPrompt = `
      System: Review the following tasks and assign a priority ("Low", "Medium", or "High") to each.
      Consider urgency (deadlines) and weight (number of subtasks).
      
      Tasks: ${JSON.stringify(taskData)}
      
      Return ONLY a JSON array of mappings: [{ "id": "task_id", "priority": "Low" | "Medium" | "High" }]
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const result = await withRetry(() => model.generateContent({
      contents: [{ role: "user", parts: [{ text: aiPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }));

    const responseText = result.response.text();
    if (!responseText) throw new Error("AI returned no prioritization data.");

    let priorityMapping;
    try {
      priorityMapping = JSON.parse(responseText.trim());
    } catch (_parseError) {
      throw new Error("AI returned malformed prioritization data.");
    }

    const bulkOps = priorityMapping.map((item: { id: string; priority: string }) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { priority: item.priority },
      },
    }));

    if (bulkOps.length > 0) {
      await Task.bulkWrite(bulkOps);
      await logAIAction('prioritize');
    }

    const updatedTasks = await Task.find({ _id: { $in: priorityMapping.map((m: any) => m.id) } });
    return updatedTasks.map(serializeTask);
  } catch (error: any) {
    console.error("AI Prioritization Error:", error);
    throw new Error(`AI Prioritization Failed: ${error.message || "Unknown error"}`);
  }
}

/**
 * AI Action: Generate a full Startup PRD from a simple idea.
 */
export async function generatePRD(idea: string) {
  try {
    await dbConnect();
  } catch (_dbError) {
    throw new Error("Database connection failed.");
  }

  const userId = await getUserIdFromToken();

  try {
    const aiPrompt = `
      System: You are an expert Startup Consultant and Product Manager.
      Transform the following idea into a structured Product Requirements Document (PRD).
      
      IMPORTANT: All text fields in the output JSON must be in HEBREW (RTL).
      
      Idea: "${idea}"
      
      Return ONLY a JSON object with:
      - productName: A catchy Hebrew name for the startup.
      - elevatorPitch: A compelling 1-sentence pitch in Hebrew.
      - targetAudience: Who is this for? (concise Hebrew string).
      - designBrief: Visual style and UX summary in Hebrew.
      - coreFeatures: Simple array of 4-6 key features in Hebrew.
      - estimatedDevTime: Estimated time in Hebrew (e.g., "3-4 חודשים").
    `;

    const result = await generateContentWithFallback(aiPrompt, "gemini-3.1-flash-lite-preview", true);

    const responseText = result.response.text();
    if (!responseText) throw new Error("AI returned no PRD data.");

    let prdData;
    try {
      prdData = JSON.parse(responseText.trim());
    } catch (_parseError) {
      throw new Error("AI returned malformed PRD JSON.");
    }

    const newProject = new Project({
      ...prdData,
      userId,
    });

    await newProject.save();
    await logAIAction('prd');
    return serializeProject(newProject);
  } catch (error: any) {
    console.error("PRD Generation Error:", error);
    throw new Error(`PRD Generation Failed: ${error.message || "Unknown error"}`);
  }
}

/**
 * AI Action: General AI Chat Assistant for Web
 */
export async function askAIAssistant(message: string, history: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    // Defensive history sanitization: Gemini history MUST start with 'user' role
    let sanitizedHistory = history || [];
    const firstUserIndex = sanitizedHistory.findIndex((m: any) => m.role === 'user');

    if (firstUserIndex !== -1) {
      sanitizedHistory = sanitizedHistory.slice(firstUserIndex);
    } else {
      sanitizedHistory = [];
    }

    // Convert UI messages to Gemini history expected format
    const formattedHistory = sanitizedHistory.map(m => ({
      role: m.role,
      parts: [{ text: m.text || m.parts?.[0]?.text || "" }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
      systemInstruction: "You are a helpful assistant for TaskFlow AI. Always respond in HEBREW and ensure the tone is professional yet innovative. Use RTL-friendly formatting.",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();
    await logAIAction('chat');
    return text;
  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    throw new Error(`AI Assistant Failed: ${error.message || "Unknown error"}`);
  }
}
/**
 * AI Action: Generate a daily 'Mission Brief' based on active tasks.
 */
export async function getStrategicBriefingAction() {
  try {
    await dbConnect();
  } catch (_dbError) {
    throw new Error("Database connection failed.");
  }

  const userId = await getUserIdFromToken();

  try {
    const tasks = await Task.find({ userId, status: { $ne: "Done" } })
      .sort({ priority: -1, dueDate: 1 })
      .limit(10);

    if (tasks.length === 0) {
      return "המערכת במצב המתנה. אין משימות פעילות לסיכום אסטרטגי. זמן מצוין לתכנון קדימה.";
    }

    const taskSummaries = tasks.map(t => `- ${t.title} (${t.priority}, ${t.dueDate ? 'עד ' + new Date(t.dueDate).toLocaleDateString('he-IL') : 'ללא דדליין'})`);

    const aiPrompt = `
      System: You are 'TaskFlow AI', a high-fidelity strategic assistant.
      Generate a professional, motivating 'Mission Briefing' in Hebrew based on these tasks:
      ${taskSummaries.join('\n')}
      
      Requirements:
      1. Tone: Professional, tactical, and high-performance.
      2. Content: Summarize the main focus area, highlight the most critical task, and provide a single strategic tip for today.
      3. Length: Max 4-5 concise sentences.
      4. Language: Hebrew (RTL).
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const result = await withRetry(() => model.generateContent({
      contents: [{ role: "user", parts: [{ text: aiPrompt }] }],
    }));

    const responseText = result.response.text();
    if (!responseText) throw new Error("AI returned no briefing.");

    await logAIAction('briefing');
    return responseText.trim();
  } catch (error: any) {
    console.error("Briefing Generation Error:", error);
    throw new Error(`Briefing Failed: ${error.message || "Unknown error"}`);
  }
}
