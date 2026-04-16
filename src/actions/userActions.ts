"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Skill from "@/models/Skill";
import { revalidatePath } from "next/cache";
import { getUserIdFromToken } from "@/lib/authHelper";

/**
 * Assign a skill to a user.
 */
export async function assignSkillToUserAction(skillId: string) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) throw new Error("Unauthorized");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const exists = user.skills?.some((s: any) => s.skillId.toString() === skillId);
    if (!exists) {
      user.skills.push({ skillId, xp: 0, level: 1 });
      await user.save();
    }

    revalidatePath("/profile/account");
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[assignSkillToUserAction] Error:", err.message);
    throw new Error(err.message || "Failed to assign skill");
  }
}

/**
 * Remove a skill from a user.
 */
export async function removeSkillFromUserAction(skillId: string) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) throw new Error("Unauthorized");

    await User.findByIdAndUpdate(userId, {
      $pull: { skills: { skillId: skillId } }
    });

    revalidatePath("/profile/account");
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[removeSkillFromUserAction] Error:", err.message);
    throw new Error(err.message || "Failed to remove skill");
  }
}

/**
 * Fetch all available skills in the system.
 */
export async function getAllAvailableSkillsAction() {
  try {
    await dbConnect();
    const skills = await Skill.find({}).sort({ name: 1 });
    return JSON.parse(JSON.stringify(skills));
  } catch (error) {
    console.error("[getAllAvailableSkillsAction] Error:", error);
    return [];
  }
}

/**
 * Toggle Focus Mode for a user.
 */
export async function toggleFocusModeAction() {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) throw new Error("Unauthorized");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const newStatus = !user.isFocusModeEnabled;
    await User.findByIdAndUpdate(userId, { isFocusModeEnabled: newStatus });

    revalidatePath("/profile/account");
    return { success: true, isFocusModeEnabled: newStatus };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[toggleFocusModeAction] Error:", err.message);
    throw new Error(err.message || "Failed to toggle focus mode");
  }
}
