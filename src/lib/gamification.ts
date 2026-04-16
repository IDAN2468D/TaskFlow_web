/**
 * Gamification Engine — XP, Levels, and Achievements logic.
 * Pure functions for calculating game state, no side effects.
 */

// ─── Level Thresholds ───────────────────────────────────────────────
// XP required to reach each level (cumulative)
export const LEVEL_THRESHOLDS = [
  { level: 1, xpRequired: 0, title: 'מתחיל', titleEn: 'Rookie', emoji: '🌱' },
  { level: 2, xpRequired: 100, title: 'חניך', titleEn: 'Apprentice', emoji: '📘' },
  { level: 3, xpRequired: 300, title: 'שחקן', titleEn: 'Player', emoji: '⚡' },
  { level: 4, xpRequired: 600, title: 'מבצע', titleEn: 'Executor', emoji: '🔥' },
  { level: 5, xpRequired: 1000, title: 'אסטרטג', titleEn: 'Strategist', emoji: '🧠' },
  { level: 6, xpRequired: 1500, title: 'מפקד', titleEn: 'Commander', emoji: '🎖️' },
  { level: 7, xpRequired: 2200, title: 'אלוף', titleEn: 'Champion', emoji: '🏆' },
  { level: 8, xpRequired: 3000, title: 'מאסטר', titleEn: 'Master', emoji: '👑' },
  { level: 9, xpRequired: 4000, title: 'אדריכל', titleEn: 'Architect', emoji: '🏗️' },
  { level: 10, xpRequired: 5500, title: 'אגדה', titleEn: 'Legend', emoji: '💎' },
];

// ─── XP Reward Table ────────────────────────────────────────────────
export const XP_REWARDS = {
  taskCompleted: {
    Low: 10,
    Medium: 25,
    High: 50,
  },
  subtaskCompleted: 5,
  streakBonus: 15, // Bonus XP per active streak day
  aiInsightUsed: 5,
  dailyLogin: 10,
};

// ─── Achievement Definitions ────────────────────────────────────────
export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  condition: (stats: AchievementCheckStats) => boolean;
}

export interface AchievementCheckStats {
  totalTasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  xp: number;
  weeklyXp: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_task',
    title: 'צעד ראשון',
    description: 'השלמת את המשימה הראשונה שלך',
    emoji: '🎯',
    condition: (s) => s.totalTasksCompleted >= 1,
  },
  {
    id: 'five_tasks',
    title: 'חמש וחמש',
    description: 'השלמת 5 משימות',
    emoji: '✋',
    condition: (s) => s.totalTasksCompleted >= 5,
  },
  {
    id: 'ten_tasks',
    title: 'עשירייה',
    description: 'השלמת 10 משימות',
    emoji: '🔟',
    condition: (s) => s.totalTasksCompleted >= 10,
  },
  {
    id: 'twenty_five_tasks',
    title: 'רבע מאה',
    description: 'השלמת 25 משימות',
    emoji: '🏅',
    condition: (s) => s.totalTasksCompleted >= 25,
  },
  {
    id: 'fifty_tasks',
    title: 'חצי מאה',
    description: 'השלמת 50 משימות',
    emoji: '🎖️',
    condition: (s) => s.totalTasksCompleted >= 50,
  },
  {
    id: 'hundred_tasks',
    title: 'מאה!',
    description: 'השלמת 100 משימות',
    emoji: '💯',
    condition: (s) => s.totalTasksCompleted >= 100,
  },
  {
    id: 'streak_3',
    title: 'שלוש ברציפות',
    description: 'Streak של 3 ימים',
    emoji: '🔥',
    condition: (s) => s.currentStreak >= 3,
  },
  {
    id: 'streak_7',
    title: 'שבוע מושלם',
    description: 'Streak של 7 ימים',
    emoji: '🌟',
    condition: (s) => s.currentStreak >= 7,
  },
  {
    id: 'streak_14',
    title: 'שבועיים בלי הפסקה',
    description: 'Streak של 14 ימים',
    emoji: '⚡',
    condition: (s) => s.currentStreak >= 14,
  },
  {
    id: 'streak_30',
    title: 'חודש של אש',
    description: 'Streak של 30 ימים',
    emoji: '🏆',
    condition: (s) => s.longestStreak >= 30,
  },
  {
    id: 'level_5',
    title: 'אסטרטג רשמי',
    description: 'הגעת לרמה 5',
    emoji: '🧠',
    condition: (s) => s.level >= 5,
  },
  {
    id: 'level_10',
    title: 'אגדה חיה',
    description: 'הגעת לרמה 10',
    emoji: '💎',
    condition: (s) => s.level >= 10,
  },
  {
    id: 'xp_1000',
    title: 'אלף ואחד',
    description: 'צברת 1,000 XP',
    emoji: '🎇',
    condition: (s) => s.xp >= 1000,
  },
  {
    id: 'weekly_300',
    title: 'שבוע פרודוקטיבי',
    description: 'צברת 300 XP בשבוע אחד',
    emoji: '📈',
    condition: (s) => s.weeklyXp >= 300,
  },
];

// ─── Pure Functions ─────────────────────────────────────────────────

/**
 * Calculate the level for a given XP amount.
 */
export function getLevelForXP(xp: number) {
  let result = LEVEL_THRESHOLDS[0];
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.xpRequired) {
      result = threshold;
    } else {
      break;
    }
  }
  return result;
}

/**
 * Calculate progress toward the next level (0-1).
 */
export function getProgressToNextLevel(xp: number): number {
  const currentLevel = getLevelForXP(xp);
  const nextLevelIndex = LEVEL_THRESHOLDS.findIndex(t => t.level === currentLevel.level + 1);
  
  if (nextLevelIndex === -1) return 1; // Max level reached

  const nextThreshold = LEVEL_THRESHOLDS[nextLevelIndex];
  const xpInCurrentLevel = xp - currentLevel.xpRequired;
  const xpNeededForNext = nextThreshold.xpRequired - currentLevel.xpRequired;

  return Math.min(xpInCurrentLevel / xpNeededForNext, 1);
}

/**
 * Get XP needed for the next level.
 */
export function getXPToNextLevel(xp: number): number {
  const currentLevel = getLevelForXP(xp);
  const nextLevelIndex = LEVEL_THRESHOLDS.findIndex(t => t.level === currentLevel.level + 1);
  
  if (nextLevelIndex === -1) return 0;
  return LEVEL_THRESHOLDS[nextLevelIndex].xpRequired - xp;
}

/**
 * Calculate XP reward for completing a task.
 */
export function calculateTaskXP(priority: 'Low' | 'Medium' | 'High', subtasksCount: number): number {
  const baseXP = XP_REWARDS.taskCompleted[priority] || XP_REWARDS.taskCompleted.Medium;
  const subtaskBonus = subtasksCount * XP_REWARDS.subtaskCompleted;
  return baseXP + subtaskBonus;
}

/**
 * Check today's date string (YYYY-MM-DD format).
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Check which new achievements should be unlocked.
 */
export function checkNewAchievements(
  stats: AchievementCheckStats,
  existingAchievementIds: string[]
): AchievementDef[] {
  return ACHIEVEMENTS.filter(
    a => !existingAchievementIds.includes(a.id) && a.condition(stats)
  );
}

/**
 * Get the Monday of the current ISO week (for weekly XP reset).
 */
export function getCurrentWeekMonday(): string {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sunday
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}
