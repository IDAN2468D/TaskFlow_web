import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category?: string;
  color?: string;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    color: {
      type: String,
      default: '#6366f1', // Indigo accent
    },
  },
  {
    timestamps: true,
  }
);

const Skill = models.Skill || model<ISkill>('Skill', SkillSchema);

export default Skill;
