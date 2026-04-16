import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Task Schema Definition
 * Strictly aligned with .agent/schema-task.md
 */

export interface ISubTask {
  _id?: string;
  title: string;
  status: string;
  estimatedTime?: number; // minutes
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'Todo' | 'InProgress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: Date;
  subTasks: ISubTask[];
  aiInsights?: string | Record<string, any>;
  tags: string[];
  estimatedTime?: number; // minutes
  userId: mongoose.Types.ObjectId | string;
  xpRewarded?: boolean;
  aiPriorityScore?: number;
  audioUrl?: string;
  assignedSkillId?: mongoose.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const SubTaskSchema = new Schema<ISubTask>({
  title: { type: String, required: true },
  status: { type: String, required: true, default: 'Todo' },
  estimatedTime: { type: Number, required: false },
});

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    status: {
      type: String,
      enum: ['Todo', 'InProgress', 'Done'],
      default: 'Todo',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dueDate: { type: Date, required: false },
    subTasks: [SubTaskSchema],
    aiInsights: { type: Schema.Types.Mixed, required: false },
    tags: { type: [String], default: [] },
    estimatedTime: { type: Number, required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    xpRewarded: { type: Boolean, default: false },
    aiPriorityScore: { type: Number, min: 0, max: 100, default: 0 },
    audioUrl: { type: String, required: false },
    assignedSkillId: { type: Schema.Types.ObjectId, ref: 'Skill', required: false },
  },
  {
    timestamps: true,
  }
);

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
