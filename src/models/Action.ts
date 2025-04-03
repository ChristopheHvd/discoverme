import mongoose, { Document, Schema } from 'mongoose';

// Interface pour les paramètres d'action
interface IActionParameter {
  name: string;
  type: string;
  required: boolean;
}

// Interface pour le modèle Action
export interface IAction extends Document {
  name: string;
  description: string;
  endpoint: string;
  parameters: IActionParameter[];
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Schéma pour les paramètres d'action
const ActionParameterSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  required: { type: Boolean, default: false }
}, { _id: false });

// Schéma pour les actions
const ActionSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  endpoint: { type: String, required: true },
  parameters: [ActionParameterSchema],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Création et export du modèle
export default mongoose.model<IAction>('Action', ActionSchema);
