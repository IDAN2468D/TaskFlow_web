"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import SyncLog from "@/models/SyncLog";
import { getUserIdFromToken } from "@/lib/authHelper";
import { revalidatePath } from "next/cache";

/**
 * Upgrades the user to a higher service plan.
 */
export async function upgradePlanAction(plan: 'Pro' | 'Ultra') {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) throw new Error("Unauthorized");

    await User.findByIdAndUpdate(userId, { plan });
    
    // Log the upgrade as a special sync event
    await SyncLog.create({
      userId,
      deviceId: "SYSTEM",
      status: "Success",
      type: "Automatic",
      details: `User upgraded to ${plan} plan.`
    });

    revalidatePath("/profile");
    return { success: true, plan };
  } catch (error) {
    console.error("Upgrade error:", error);
    return { success: false, error: "Failed to upgrade plan" };
  }
}

/**
 * Fetches recent sync logs for the user.
 */
export async function getSyncHistoryAction() {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) throw new Error("Unauthorized");

    const logs = await SyncLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(20)
      .lean();

    return JSON.parse(JSON.stringify(logs));
  } catch (error) {
    console.error("Fetch logs error:", error);
    return [];
  }
}

/**
 * Logs a new sync event.
 */
export async function logSyncEventAction(data: { deviceId: string; status: 'Success' | 'Partial' | 'Failed'; type: 'Cloud' | 'Local'; details: string }) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) return { success: false };

    await SyncLog.create({
      userId,
      ...data
    });

    return { success: true };
  } catch (_error) {
    return { success: false };
  }
}

/**
 * Generates a security report based on last logins.
 */
export async function getSecurityReportAction() {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) throw new Error("Unauthorized");

    const user = await User.findById(userId).select('lastLogins plan').lean();
    return JSON.parse(JSON.stringify(user));
  } catch (_error) {
    return null;
  }
}
