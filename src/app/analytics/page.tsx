import React from "react";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import AnalyticsClient from "@/components/analytics/AnalyticsClient";

export default async function AnalyticsPage() {
  await dbConnect();
  const tasks = await Task.find({});
  const doneTasks = tasks.filter(t => t.status === 'Done');
  const activeTasks = tasks.filter(t => t.status !== 'Done');
  
  // Calculate total minutes saved (estimating 15 mins saved per AI decomposed task)
  const totalMinutesSaved = tasks.filter(t => t.subTasks && t.subTasks.length > 0).length * 15;

  const weeklyData = [40, 70, 45, 90, 65, 80, 100];
  const productivityScore = 92;
  const recommendations = [
    { text: "נראה שאתה הכי פרודוקטיבי ב-10 בבוקר. מומלץ לקבוע משימות עמוקות לשעות האלו.", type: "tip" as const },
    { text: "השלמת 3 משימות צבעוניות היום. הוספת תגים עוזרת ל-AI לסווג טוב יותר את הלוז שלך.", type: "info" as const },
    { text: "זמן העבודה הממוצע שלך על משימות Dev ירד ב-12%. עבודה מצוינת!", type: "success" as const },
  ];

  return (
    <AnalyticsClient 
      totalMinutesSaved={totalMinutesSaved}
      activeCount={activeTasks.length}
      doneCount={doneTasks.length}
      productivityScore={productivityScore}
      weeklyData={weeklyData}
      recommendations={recommendations}
    />
  );
}

