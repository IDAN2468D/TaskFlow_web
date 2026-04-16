import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { getUserIdFromToken } from '@/lib/authHelper';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // ─── Fetch Tasks from Last 7 Days ───
    const tasks = await Task.find({
      userId,
      createdAt: { $gte: sevenDaysAgo }
    }).select('title status priority tags createdAt updatedAt').lean();

    const completed = tasks.filter((t: any) => t.status === 'Done');
    const pending = tasks.filter((t: any) => t.status !== 'Done');
    
    // Tag distribution
    const tagStats: Record<string, number> = {};
    tasks.forEach((t: any) => {
      t.tags?.forEach((tag: string) => {
        tagStats[tag] = (tagStats[tag] || 0) + 1;
      });
    });

    const completionRate = tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0;

    // Daily distribution for the chart
    const dailyStats = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toLocaleDateString('he-IL', { weekday: 'short' });
      const count = completed.filter((t: any) => 
        new Date(t.updatedAt).toDateString() === date.toDateString() && t.status === 'Done'
      ).length;
      return { day: dateStr, count };
    });

    // ─── AI Insights with Fallback ───
    let aiInsight = "";
    const prompt = `
אתה מנתח פרודוקטיביות מומחה. 
נתח את השבוע של המשתמש ב-TaskFlow AI ותן תובנות קצרות ומניעות לפעולה בעברית.

נתוני השבוע:
- סה"כ משימות חדשות: ${tasks.length}
- משימות שהושלמו: ${completed.length}
- אחוז ביצוע: ${completionRate.toFixed(1)}%
- תגיות בולטות: ${Object.entries(tagStats).sort((a,b) => b[1]-a[1]).slice(0,3).map(([k,v]) => `${k} (${v})`).join(', ')}

הנחיות לסיכום:
1. פתח בברכה חמה.
2. ציין את ההישג הכי בולט (למשל אחוז ביצוע גבוה או התמקדות בתחום מסוים).
3. תן עצה אחת לשיפור לשבוע הבא.
4. השתמש באמוג'ים.
5. שמור על טון מקצועי אך מעודד.
6. מקסימום 4-5 משפטים.
`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
      
      const generateWithRetry = async (retries = 3): Promise<any> => {
        try {
          return await model.generateContent(prompt);
        } catch (err) {
          if (retries > 0) {
            console.warn(`[WeeklyReview Bridge] Gemini 3.1 busy, retrying... (${retries} left)`);
            await new Promise(r => setTimeout(r, 2000));
            return generateWithRetry(retries - 1);
          }
          throw err;
        }
      };

      const result = await generateWithRetry();
      aiInsight = result.response.text();
    } catch (aiError: any) {
      console.warn("[WeeklyReview Bridge] AI Quota/Error, using fallback:", aiError.message);
      
      // Heuristic fallback insights based on stats
      if (completionRate > 80) {
        aiInsight = "וואו! שבוע מעולה. סיימת כמעט את כל המשימות שלך. שמור על המומנטום הזה גם בשבוע הבא 🚀";
      } else if (completionRate > 50) {
        aiInsight = "שבוע פרודוקטיבי! סיימת יותר מחצי מהמשימות. הטיפ שלי: נסו לתעדף משימות High Priority בתחילת היום ⚡";
      } else {
        aiInsight = "שבוע מאתגר לפנינו. אל תדאג, צעד אחד בכל פעם. נסה לפרק משימות גדולות לתתי-משימות קטנות יותר מחר 🎯";
      }
    }

    return NextResponse.json({
      summary: {
        total: tasks.length,
        completed: completed.length,
        pending: pending.length,
        completionRate,
      },
      tagStats: Object.entries(tagStats).map(([name, count]) => ({ name, count })),
      dailyStats,
      aiInsight
    });
  } catch (error: any) {
    console.error("[WeeklyReview Bridge] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
