import mongoose, { Document, Schema } from 'mongoose';

// Interface pour le modèle Content
export interface IContent extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  type: string;
  description?: string;
  fileId?: mongoose.Types.ObjectId;
  textContent?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Schéma pour le contenu
const ContentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  fileId: { type: Schema.Types.ObjectId },
  textContent: { type: String },
  tags: [{ type: String }],
}, { timestamps: true });

// Création et export du modèle
export default mongoose.model<IContent>('Content', ContentSchema);
