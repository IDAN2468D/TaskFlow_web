"use server";

import dbConnect from "@/lib/mongodb";
import AIActionLog from "@/models/AIActionLog";
import { getUserIdFromToken } from "@/lib/authHelper";
import mongoose from "mongoose";

/**
 * Log a new AI action
 */
export async function logAIAction(actionType: 'decompose' | 'insights' | 'prd' | 'chat' | 'prioritize' | 'briefing') {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) return;

    await AIActionLog.create({
      userId: new mongoose.Types.ObjectId(userId),
      actionType,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("[logAIAction] Failed:", error);
  }
}

/**
 * Get AI usage count for the current user and month
 */
export async function getAIUsageCountAction() {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) return 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const count = await AIActionLog.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      timestamp: { $gte: startOfMonth }
    });

    return count;
  } catch (error) {
    console.error("[getAIUsageCountAction] Failed:", error);
    return 0;
  }
}
