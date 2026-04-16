/**
 * XP Calculation Helper for TaskFlow AI
 * Based on the gamification rules defined in xp-system-plan.md
 */

export interface XpStats {
  xpGain: number;
  newXp: number;
  newLevel: number;
  leveledUp: boolean;
}

/**
 * Calculate XP gained for a completed task
 */
export function calculateXpGain(estimatedTime: number = 0, priority: string = 'Medium'): number {
  const baseMinutes = Math.max(10, estimatedTime);
  const baseRate = 2; // 2 XP per 10 minutes
  let xp = (baseMinutes / 10) * baseRate;

  // Priority Multipliers
  switch (priority) {
    case 'High': xp *= 2; break;
    case 'Medium': xp *= 1.5; break;
    case 'Low': xp *= 1; break;
  }

  return Math.max(10, Math.floor(xp));
}

/**
 * Calculate the XP required to reach a specific level
 */
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  // Formula: Level * 100 * (1.2 ^ (Level-1))
  return Math.floor(level * 100 * Math.pow(1.2, level - 1));
}

/**
 * Process progress for a skill
 */
export function processSkillProgress(currentXp: number, currentLevel: number, gain: number): { xp: number, level: number, leveledUp: boolean } {
  let xp = currentXp + gain;
  let level = currentLevel;
  let leveledUp = false;

  while (true) {
    const required = getXpRequiredForLevel(level + 1);
    // Note: This required is the TOTAL XP needed for that level.
    if (xp >= required) {
      level++;
      leveledUp = true;
    } else {
      break;
    }
  }

  return { xp, level, leveledUp };
}
