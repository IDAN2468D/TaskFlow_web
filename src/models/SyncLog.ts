import mongoose, { Schema, Document } from 'mongoose';

export interface ISyncLog extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId: string;
  status: 'Success' | 'Partial' | 'Failed';
  type: 'Cloud' | 'Local' | 'Automatic';
  timestamp: Date;
  details: string;
}

const SyncLogSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: String, required: true },
  status: { type: String, enum: ['Success', 'Partial', 'Failed'], default: 'Success' },
  type: { type: String, enum: ['Cloud', 'Local', 'Automatic'], default: 'Cloud' },
  timestamp: { type: Date, default: Date.now },
  details: { type: String }
});

export default mongoose.models.SyncLog || mongoose.model<ISyncLog>('SyncLog', SyncLogSchema);
