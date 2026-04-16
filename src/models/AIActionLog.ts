import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAIActionLog extends Document {
  userId: mongoose.Types.ObjectId;
  actionType: 'decompose' | 'insights' | 'prd' | 'chat' | 'prioritize' | 'briefing';
  timestamp: Date;
}

const AIActionLogSchema = new Schema<IAIActionLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    actionType: {
      type: String,
      required: true,
      enum: ['decompose', 'insights', 'prd', 'chat', 'prioritize', 'briefing'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false, // We only care about the action timestamp
  }
);

// Compound index for monthly queries: userId + timestamp
AIActionLogSchema.index({ userId: 1, timestamp: -1 });

const AIActionLog = models.AIActionLog || model<IAIActionLog>('AIActionLog', AIActionLogSchema);

export default AIActionLog;
