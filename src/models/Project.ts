import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId | string;
  productName: string;
  elevatorPitch: string;
  targetAudience: string;
  designBrief: string;
  coreFeatures: string[];
  estimatedDevTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productName: { type: String, required: true },
    elevatorPitch: { type: String, required: true },
    targetAudience: { type: String, required: true },
    designBrief: { type: String, required: true },
    coreFeatures: { type: [String], default: [] },
    estimatedDevTime: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
