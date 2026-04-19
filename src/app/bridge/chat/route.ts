import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { getUserIdFromToken } from '@/lib/authHelper';
import { serializeTask } from '@/lib/utils';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Mobile Bridge: AI Chat with full task context.
 * Supports conversation history, task awareness, and action execution.
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken(req);
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    // ─── Fetch user's task context for AI awareness ───
    const [activeTasks, recentDone] = await Promise.all([
      Task.find({ userId, status: { $ne: 'Done' } })
        .select('title status priority dueDate tags estimatedTime subTasks')
        .sort({ priority: -1 })
        .limit(20)
        .lean(),
      Task.find({ userId, status: 'Done' })
        .select('title priority updatedAt')
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const overdueTasks = activeTasks.filter((t: any) => t.dueDate && new Date(t.dueDate) < new Date());
    const highPriority = activeTasks.filter((t: any) => t.priority === 'High');

    // ─── Build context-aware system prompt ───
    const systemPrompt = `
אתה "TaskFlow AI" — עוזר פרודוקטיביות חכם ואישי. אתה מדבר בעברית, ידידותי, תכליתי ומקצועי.

📊 הנה ההקשר הנוכחי של המשתמש:

**משימות פעילות (${activeTasks.length}):**
${activeTasks.map((t: any) => `- [${t.priority}] "${t.title}" (${t.status})${t.dueDate ? ` — דדליין: ${new Date(t.dueDate).toLocaleDateString('he-IL')}` : ''}${t.subTasks?.length ? ` — ${t.subTasks.filter((s: any) => s.status === 'Done').length}/${t.subTasks.length} תתי-משימות` : ''}`).join('\n')}

**משימות באיחור (${overdueTasks.length}):**
${overdueTasks.length > 0 ? overdueTasks.map((t: any) => `- ⚠️ "${t.title}" — ${t.priority}`).join('\n') : 'אין 🎉'}

**High Priority (${highPriority.length}):**
${highPriority.map((t: any) => `- 🔴 "${t.title}" (${t.status})`).join('\n')}

**הושלמו לאחרונה (${recentDone.length}):**
${recentDone.map((t: any) => `- ✅ "${t.title}"`).join('\n')}

📌 הנחיות:
1. ענה תמיד בעברית.
2. היה קצר ותכליתי (2-4 משפטים לרוב).
3. כשנשאל על משימות — השתמש בנתונים שלמעלה.
4. כשנשאל "מה לעשות עכשיו" — תעדף לפי: דדליינים קרובים > High Priority > משימות ישנות.
5. כשנשאל לנתח את השבוע — תן תובנות מבוססות נתונים.
6. אל תמציא משימות שלא קיימות ברשימה.
7. השתמש באמוג'ים כדי להפוך את הטקסט ליותר קריא.
`;

    // ─── Sanitize history — Gemini requires first message to be 'user' ───
    let sanitizedHistory = history || [];
    const firstUserIndex = sanitizedHistory.findIndex((m: any) => m.role === 'user');
    if (firstUserIndex !== -1) {
      sanitizedHistory = sanitizedHistory.slice(firstUserIndex);
    } else {
      sanitizedHistory = [];
    }

    let responseText = "";
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
      
      const generateWithRetry = async (retries = 3): Promise<any> => {
        try {
          const chat = model.startChat({
            history: sanitizedHistory,
            systemInstruction: systemPrompt,
            generationConfig: {
              maxOutputTokens: 800,
              temperature: 0.7,
            },
          });
          return await chat.sendMessage(message);
        } catch (err) {
          if (retries > 0) {
            console.warn(`[Chat Bridge] Gemini 3.1 busy, retrying... (${retries} left)`);
            await new Promise(r => setTimeout(r, 2000));
            return generateWithRetry(retries - 1);
          }
          throw err;
        }
      };

      const result = await generateWithRetry();
      responseText = result.response.text();
    } catch (aiError: any) {
      console.warn("[Bridge Chat] AI Quota/Error, using fallback:", aiError.message);
      
      // Heuristic fallback for chat
      if (message.includes('משימה') || message.includes('מה לעשות')) {
        responseText = `כרגע אני במצב תחזוקה קצר, אבל הנה מה שחשוב: יש לך ${activeTasks.length} משימות פתוחות, מתוכן ${highPriority.length} בעדיפות גבוהה. אני ממליץ להתחיל ב-"${highPriority[0]?.title || activeTasks[0]?.title || 'תכנון היום'}"&rlm;.&rlm;`;
      } else {
        responseText = "מצטער, אני חווה עומס רגעי ולא מצליח לעבד תשובה מורכבת. אשמח לענות לך בעוד כמה דקות! בינתיים, הנה תזכורת שיש לך משימות פתוחות לטיפול&rlm;.&rlm;";
      }
    }

    return NextResponse.json({ 
      text: responseText,
      context: {
        activeTasksCount: activeTasks.length,
        overdueCount: overdueTasks.length,
        highPriorityCount: highPriority.length,
      }
    });
  } catch (error: any) {
    console.error("[Bridge Chat] Error:", error.message);
    const isAuth = error.message?.includes('Unauthorized');
    return NextResponse.json({ 
      error: error.message,
    }, { status: isAuth ? 401 : 500 });
  }
}
