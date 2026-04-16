import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * ActivityLog Schema
 * Tracks system-wide events for the Team Timeline.
 */

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId | string;
  action: 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_DELETED' | 'AI_ASSIGNED' | 'FOCUS_MODE_TOGGLED' | 'VOICE_TASK_CREATED';
  targetId?: string;
  details?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      required: true,
      enum: [
        'TASK_CREATED',
        'TASK_UPDATED',
        'TASK_DELETED',
        'AI_ASSIGNED',
        'FOCUS_MODE_TOGGLED',
        'VOICE_TASK_CREATED',
      ],
    },
    targetId: { type: String, required: false },
    details: { type: String, required: false },
    metadata: { type: Schema.Types.Mixed, required: false },
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false },
  }
);

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
