import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';
import { getUserIdFromToken } from '@/lib/authHelper';
import {
  getLevelForXP,
  getProgressToNextLevel,
  getXPToNextLevel,
  calculateTaskXP,
  getTodayString,
  getCurrentWeekMonday,
  checkNewAchievements,
  ACHIEVEMENTS,
  LEVEL_THRESHOLDS,
  XP_REWARDS,
} from '@/lib/gamification';
import Task from '@/models/Task';

/**
 * Serialize UserProgress for JSON response.
 */
function serializeProgress(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    _id: obj._id?.toString() || '',
    userId: obj.userId?.toString() || '',
    achievements: (obj.achievements || []).map((a: any) => ({
      id: a.id,
      unlockedAt: a.unlockedAt instanceof Date ? a.unlockedAt.toISOString() : a.unlockedAt,
    })),
    createdAt: obj.createdAt instanceof Date ? obj.createdAt.toISOString() : obj.createdAt,
    updatedAt: obj.updatedAt instanceof Date ? obj.updatedAt.toISOString() : obj.updatedAt,
  };
}

/**
 * GET: Fetch user gamification progress
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();

    let progress = await UserProgress.findOne({ userId });

    // Auto-create progress if first time
    if (!progress) {
      progress = new UserProgress({ userId });
      await progress.save();
    }

    const levelInfo = getLevelForXP(progress.xp);
    const progressToNext = getProgressToNextLevel(progress.xp);
    const xpToNext = getXPToNextLevel(progress.xp);

    // Check streak status for today
    const today = getTodayString();
    const isActiveToday = progress.lastActiveDate === today;

    // Build all achievements with unlocked status
    const allAchievements = ACHIEVEMENTS.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      emoji: a.emoji,
      unlocked: progress!.achievements.some((ua: any) => ua.id === a.id),
      unlockedAt: progress!.achievements.find((ua: any) => ua.id === a.id)?.unlockedAt || null,
    }));

    return NextResponse.json({
      progress: serializeProgress(progress),
      level: levelInfo,
      progressToNextLevel: progressToNext,
      xpToNextLevel: xpToNext,
      achievements: allAchievements,
      isActiveToday,
      levels: LEVEL_THRESHOLDS,
    });
  } catch (error: any) {
    console.error('[Gamification GET] Error:', error.message);
    const isAuth = error.message?.includes('Unauthorized');
    return NextResponse.json({ error: error.message }, { status: isAuth ? 401 : 500 });
  }
}

/**
 * POST: Award XP when a task is completed.
 * Body: { taskId: string }
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    // Fetch the completed task for XP calculation
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const completedSubtasks = task.subTasks?.filter((s: any) => s.status === 'Done').length || 0;
    const xpEarned = calculateTaskXP(task.priority, completedSubtasks);

    // Get or create progress
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = new UserProgress({ userId });
    }

    const previousLevel = getLevelForXP(progress.xp).level;

    // Update XP and task count
    progress.xp += xpEarned;
    progress.totalTasksCompleted += 1;

    // Handle streak logic
    const today = getTodayString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (progress.lastActiveDate !== today) {
      if (progress.lastActiveDate === yesterdayStr) {
        // Consecutive day — extend streak
        progress.currentStreak += 1;
      } else if (progress.lastActiveDate !== today) {
        // Streak broken — reset to 1
        progress.currentStreak = 1;
      }
      progress.lastActiveDate = today;

      // Add daily login XP
      progress.xp += XP_REWARDS.dailyLogin;
    }

    // Update longest streak
    if (progress.currentStreak > progress.longestStreak) {
      progress.longestStreak = progress.currentStreak;
    }

    // Add streak bonus XP
    if (progress.currentStreak > 1) {
      progress.xp += XP_REWARDS.streakBonus;
    }

    // Weekly XP tracking
    const currentWeekMonday = getCurrentWeekMonday();
    if (progress.weeklyXpResetDate !== currentWeekMonday) {
      progress.weeklyXp = 0;
      progress.weeklyXpResetDate = currentWeekMonday;
    }
    progress.weeklyXp += xpEarned;

    // Recalculate level
    const newLevelInfo = getLevelForXP(progress.xp);
    progress.level = newLevelInfo.level;
    const leveledUp = newLevelInfo.level > previousLevel;

    // Check for new achievements
    const existingIds = progress.achievements.map((a: any) => a.id);
    const newAchievements = checkNewAchievements(
      {
        totalTasksCompleted: progress.totalTasksCompleted,
        currentStreak: progress.currentStreak,
        longestStreak: progress.longestStreak,
        level: progress.level,
        xp: progress.xp,
        weeklyXp: progress.weeklyXp,
      },
      existingIds
    );

    // Unlock new achievements
    for (const achievement of newAchievements) {
      progress.achievements.push({
        id: achievement.id,
        unlockedAt: new Date(),
      });
    }

    await progress.save();

    return NextResponse.json({
      xpEarned,
      totalXp: progress.xp,
      level: newLevelInfo,
      leveledUp,
      currentStreak: progress.currentStreak,
      newAchievements: newAchievements.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        emoji: a.emoji,
      })),
    });
  } catch (error: any) {
    console.error('[Gamification POST] Error:', error.message);
    const isAuth = error.message?.includes('Unauthorized');
    return NextResponse.json({ error: error.message }, { status: isAuth ? 401 : 500 });
  }
}
