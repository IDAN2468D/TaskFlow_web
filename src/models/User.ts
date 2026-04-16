import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  plan: 'Free' | 'Pro' | 'Ultra';
  lastLogins: { ip: string; timestamp: Date }[];
  skills: {
    skillId: mongoose.Types.ObjectId;
    xp: number;
    level: number;
    assignedAt: Date;
  }[];
  isFocusModeEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    avatar: {
      type: String,
      required: false,
    },
    plan: {
      type: String,
      enum: ['Free', 'Pro', 'Ultra'],
      default: 'Free'
    },
    lastLogins: [
      {
        ip: String,
        timestamp: { type: Date, default: Date.now }
      }
    ],
    skills: [
      {
        skillId: {
          type: Schema.Types.ObjectId,
          ref: 'Skill',
          required: true,
        },
        xp: {
          type: Number,
          default: 0,
        },
        level: {
          type: Number,
          default: 1,
        },
        assignedAt: {
          type: Date,
          default: Date.now,
        }
      }
    ],
    isFocusModeEnabled: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

/**
 * User Model for TaskFlow AI.
 * Handles authentication and basic profile data.
 */
const User = models.User || model<IUser>('User', UserSchema);

export default User;
