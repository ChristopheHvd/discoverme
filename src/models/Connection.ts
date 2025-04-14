import mongoose, { Document, Schema } from 'mongoose';

// Interface pour le modèle Connection
export interface IConnection extends Document {
  userId: mongoose.Types.ObjectId; // Utilisateur propriétaire de la connexion
  connectedUserId: mongoose.Types.ObjectId; // Utilisateur connecté
  relationship: string; // Type de relation (1st, 2nd, etc.)
  connectedSince: Date; // Date de connexion
  createdAt: Date;
  updatedAt: Date;
}

// Schéma pour les connexions
const ConnectionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  connectedUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  relationship: { type: String, default: '1st' },
  connectedSince: { type: Date, default: Date.now },
}, { timestamps: true });

// Index composé pour éviter les connexions en double
ConnectionSchema.index({ userId: 1, connectedUserId: 1 }, { unique: true });

// Création et export du modèle
export default mongoose.model<IConnection>('Connection', ConnectionSchema);
