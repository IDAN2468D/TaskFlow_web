"use server";

import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { serializeTask } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getUserIdFromToken } from "@/lib/authHelper";
import User from "@/models/User";
import Skill from "@/models/Skill";
import { calculateXpGain, processSkillProgress } from "../lib/xpHelper";

/**
 * Action: Toggles a subtask's status between "Todo" and "Done".
 */
export async function toggleSubtaskAction(taskId: string, subtaskId: string) {
  await dbConnect();
  const userId = await getUserIdFromToken();

  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) throw new Error("Task not found or unauthorized");

  const subtask = task.subTasks.find((st: any) => st._id?.toString() === subtaskId);
  if (!subtask) throw new Error("Subtask not found");

  subtask.status = subtask.status === "Done" ? "Todo" : "Done";
  
  // Logical Sync: If all subtasks are Done, set main task to Done.
  // If some are undone but it was Done, set it to InProgress.
  const allDone = task.subTasks.every((st: any) => st.status === "Done");
  const anyDone = task.subTasks.some((st: any) => st.status === "Done");

  if (allDone && task.subTasks.length > 0) {
    task.status = "Done";
  } else if (task.status === "Done" && !allDone) {
    task.status = "InProgress";
  } else if (task.status === "Todo" && anyDone) {
    task.status = "InProgress";
  }

  if (task.status === "Done" && !task.xpRewarded) {
    await processTaskXp(task, userId!);
  }

  await task.save();

  revalidatePath("/");
  return serializeTask(task);
}

/**
 * Internal: Process XP gain for completed tasks
 */
async function processTaskXp(task: any, userId: string) {
  const tags = task.tags || [];
  if (tags.length === 0) return;

  const user = await User.findById(userId);
  if (!user) return;

  const xpGain = calculateXpGain(task.estimatedTime, task.priority);
  let updated = false;

  for (const skillEntry of user.skills) {
    const skill = await Skill.findById(skillEntry.skillId);
    if (!skill) continue;

    const matches = tags.some((t: string) => t.toLowerCase() === skill.name.toLowerCase());
    if (matches) {
      const { xp, level } = processSkillProgress(skillEntry.xp, skillEntry.level, xpGain);
      skillEntry.xp = xp;
      skillEntry.level = level;
      updated = true;
    }
  }

  if (updated) {
    task.xpRewarded = true;
    await user.save();
    // revalidate for UI to catch up with levels
    revalidatePath("/profile/account");
  }
}

/**
 * Action: Updates the main task status (Todo -> InProgress -> Done).
 */
export async function updateTaskStatusAction(taskId: string, status: string) {
  await dbConnect();
  const userId = await getUserIdFromToken();

  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) throw new Error("Task not found or unauthorized");

  task.status = status as any;
  
  if (status === "Done" && !task.xpRewarded) {
    await processTaskXp(task, userId!);
  }

  await task.save();

  revalidatePath("/");
  return serializeTask(task);
}

/**
 * Action: Permanently deletes a task.
 */
export async function deleteTaskAction(taskId: string) {
  await dbConnect();
  const userId = await getUserIdFromToken();
  
  await Task.findOneAndDelete({ _id: taskId, userId });
  revalidatePath("/");
}

/**
 * Action: Fetches the most urgent task (not "Done") for the Focus Mode.
 */
export async function getTopPriorityTask() {
  await dbConnect();
  const userId = await getUserIdFromToken();

  const task = await Task.findOne({ userId, status: { $ne: "Done" } })
    .sort({ priority: -1, createdAt: -1 });

  return task ? serializeTask(task) : null;
}
/**
 * Action: Fetches all tasks for the current user (e.g., for backup purpose).
 */
export async function getUserTasksAction() {
  await dbConnect();
  const userId = await getUserIdFromToken();

  const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
  return tasks.map(serializeTask);
}
