import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { getUserIdFromToken } from '@/lib/authHelper';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Mobile Bridge: Generate AI Daily Briefing
 * Returns structured JSON with critical tasks, insights, productivity score, and motivational content.
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();

    // Fetch active tasks sorted by priority and due date
    const activeTasks = await Task.find({ userId, status: { $ne: 'Done' } })
      .sort({ priority: -1, dueDate: 1 })
      .limit(20)
      .select('title priority status dueDate tags estimatedTime subTasks createdAt');

    // Fetch recently completed tasks (last 7 days) for productivity insights
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const completedRecently = await Task.countDocuments({
      userId,
      status: 'Done',
      updatedAt: { $gte: sevenDaysAgo }
    });

    // Fetch yesterday's completed tasks
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const completedYesterday = await Task.countDocuments({
      userId,
      status: 'Done',
      updatedAt: { $gte: yesterday, $lt: today }
    });

    const totalActive = activeTasks.length;
    const highPriority = activeTasks.filter(t => t.priority === 'High');
    const overdueTasks = activeTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date());

    // Build top 3 critical tasks
    const criticalTasks = activeTasks.slice(0, 3).map(t => ({
      id: t._id.toString(),
      title: t.title,
      priority: t.priority,
      dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString('he-IL') : null,
      estimatedTime: t.estimatedTime || 0,
      subTasksTotal: t.subTasks?.length || 0,
      subTasksDone: t.subTasks?.filter((s: any) => s.status === 'Done').length || 0,
    }));

    // Calculate productivity score (simple heuristic)
    const weeklyAvg = completedRecently / 7;
    const productivityScore = Math.min(Math.round((weeklyAvg / Math.max(totalActive * 0.3, 1)) * 100), 100);

    // Generate AI strategic message
    const aiMessage = 'יום פרודוקטיבי מחכה לך! התמקד במשימות הקריטיות ותתקדם צעד אחרי צעד.';
    
    if (activeTasks.length > 0) {
      try {
        const taskSummaries = activeTasks.slice(0, 8).map(t =>
          `- ${t.title} (עדיפות: ${t.priority}, ${t.dueDate ? 'עד ' + new Date(t.dueDate).toLocaleDateString('he-IL') : 'ללא דדליין'})`
        );

        const aiPrompt = `
          System: You are 'TaskFlow AI', a premium strategic productivity assistant.
          Generate a personalized, motivating morning briefing summary in Hebrew.
          
          Context:
          - Active tasks: ${totalActive}
          - High priority tasks: ${highPriority.length}
          - Overdue tasks: ${overdueTasks.length}
          - Completed yesterday: ${completedYesterday}
          - Weekly completed: ${completedRecently}
          - Current tasks:
          ${taskSummaries.join('\n')}
          
          Requirements:
          1. Return ONLY a JSON object (no markdown, no code blocks).
          2. JSON must include:
             - "greeting": A personalized morning greeting in Hebrew (1 sentence, include time-of-day context).
             - "focusArea": What should the user focus on today? (1 concise sentence in Hebrew).
             - "strategicTip": An actionable productivity tip based on their task data (1-2 sentences in Hebrew).
             - "motivationalQuote": An inspiring short quote in Hebrew (can be original or attributed).
             - "yesterdaySummary": A brief summary of yesterday's performance (1 sentence in Hebrew).
        `;

        const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
        
        // Use a simple retry for the bridge
        const generateWithRetry = async (retries = 3): Promise<any> => {
          try {
            return await model.generateContent({
              contents: [{ role: 'user', parts: [{ text: aiPrompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            });
          } catch (err) {
            if (retries > 0) {
              console.warn(`[Daily Briefing Bridge] Gemini 3.1 busy, retrying... (${retries} left)`);
              await new Promise(r => setTimeout(r, 2000));
              return generateWithRetry(retries - 1);
            }
            throw err;
          }
        };

        const result = await generateWithRetry();
        const responseText = result.response.text();
        if (responseText) {
          const parsed = JSON.parse(responseText.trim());
          return NextResponse.json({
            briefing: {
              greeting: parsed.greeting || 'בוקר טוב! יום חדש של אפשרויות.',
              focusArea: parsed.focusArea || 'התמקד במשימות בעדיפות גבוהה.',
              strategicTip: parsed.strategicTip || 'המלצה: התחל עם המשימה הקשה ביותר בבוקר.',
              motivationalQuote: parsed.motivationalQuote || '״הדרך הטובה ביותר לחזות את העתיד היא ליצור אותו.״',
              yesterdaySummary: parsed.yesterdaySummary || `אתמול השלמת ${completedYesterday} משימות.`,
            },
            stats: {
              totalActive,
              highPriorityCount: highPriority.length,
              overdueCount: overdueTasks.length,
              completedYesterday,
              completedThisWeek: completedRecently,
              productivityScore,
            },
            criticalTasks,
            generatedAt: new Date().toISOString(),
          });
        }
      } catch (aiError) {
        console.error('[Daily Briefing] AI generation failed, using fallback:', aiError);
      }
    }

    // Fallback response (no AI or error)
    return NextResponse.json({
      briefing: {
        greeting: 'בוקר טוב! יום חדש מלא הזדמנויות.',
        focusArea: highPriority.length > 0
          ? `יש לך ${highPriority.length} משימות בעדיפות גבוהה שדורשות תשומת לב.`
          : 'אין משימות דחופות — יום מצוין לתכנון ויצירתיות!',
        strategicTip: 'טיפ: הקצה 25 דקות ריכוז למשימה הראשונה, התחל בקטן ותבנה מומנטום.',
        motivationalQuote: '״הצלחה היא סכום של מאמצים קטנים, שחוזרים על עצמם יום אחרי יום.״',
        yesterdaySummary: `אתמול השלמת ${completedYesterday} משימות.`,
      },
      stats: {
        totalActive,
        highPriorityCount: highPriority.length,
        overdueCount: overdueTasks.length,
        completedYesterday,
        completedThisWeek: completedRecently,
        productivityScore,
      },
      criticalTasks,
      generatedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[Daily Briefing Bridge Error]:', error.message);
    const isAuthError = error.message?.includes('Unauthorized');
    return NextResponse.json(
      { error: error.message },
      { status: isAuthError ? 401 : 500 }
    );
  }
}
