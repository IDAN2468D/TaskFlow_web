import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAuthSession extends Document {
  code: string;
  status: 'pending' | 'authorized' | 'consumed' | 'expired';
  userId?: mongoose.Types.ObjectId;
  token?: string;
  expiresAt: Date;
}

const AuthSessionSchema = new Schema<IAuthSession>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'authorized', 'consumed', 'expired'],
      default: 'pending',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    token: {
      type: String,
      required: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index to auto-delete expired sessions
    },
  },
  {
    timestamps: true,
  }
);

const AuthSession = models.AuthSession || model<IAuthSession>('AuthSession', AuthSessionSchema);

export default AuthSession;
