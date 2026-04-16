import mongoose, { Schema, Document, models, model } from 'mongoose';

/**
 * Achievement definition
 */
export interface IAchievement {
  id: string;
  unlockedAt: Date;
}

/**
 * UserProgress Model — Gamification state for each user.
 * Tracks XP, levels, streaks, and unlocked achievements.
 */
export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  xp: number;
  level: number;
  totalTasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD format for easy comparison
  achievements: IAchievement[];
  weeklyXp: number;
  weeklyXpResetDate: string; // YYYY-MM-DD – reset weekly
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    totalTasksCompleted: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: String,
      default: '',
    },
    achievements: [
      {
        id: { type: String, required: true },
        unlockedAt: { type: Date, default: Date.now },
      },
    ],
    weeklyXp: {
      type: Number,
      default: 0,
    },
    weeklyXpResetDate: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const UserProgress = models.UserProgress || model<IUserProgress>('UserProgress', UserProgressSchema);

export default UserProgress;
