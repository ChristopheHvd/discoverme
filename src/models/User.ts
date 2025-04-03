import mongoose, { Document, Schema } from 'mongoose';

// Interface pour le modèle User
export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  headline?: string;
  openToWork: boolean;
  hiring: boolean;
  skills: Array<{
    name: string;
    level?: string;
    endorsements?: number;
  }>;
  experience: Array<{
    title: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    startYear: number;
    endYear?: number;
  }>;
  contentIds: mongoose.Types.ObjectId[];
  profileViews: number;
  actionPerformed: {
    calls: number;
    messages: number;
    [key: string]: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Schéma pour les compétences
const SkillSchema = new Schema({
  name: { type: String, required: true },
  level: { type: String },
  endorsements: { type: Number, default: 0 }
});

// Schéma pour les expériences professionnelles
const ExperienceSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String }
});

// Schéma pour les formations
const EducationSchema = new Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String },
  startYear: { type: Number, required: true },
  endYear: { type: Number }
});

// Schéma pour les actions effectuées
const ActionPerformedSchema = new Schema({
  calls: { type: Number, default: 0 },
  messages: { type: Number, default: 0 }
}, { _id: false, strict: false });

// Schéma principal pour l'utilisateur
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  avatar: { type: String },
  headline: { type: String },
  openToWork: { type: Boolean, default: false },
  hiring: { type: Boolean, default: false },
  skills: [SkillSchema],
  experience: [ExperienceSchema],
  education: [EducationSchema],
  contentIds: [{ type: Schema.Types.ObjectId, ref: 'Content' }],
  profileViews: { type: Number, default: 0 },
  actionPerformed: { type: ActionPerformedSchema, default: {} },
}, { timestamps: true });

// Création et export du modèle
export default mongoose.model<IUser>('User', UserSchema);
