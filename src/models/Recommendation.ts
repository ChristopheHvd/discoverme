import mongoose, { Document, Schema } from 'mongoose';

// Interface pour le modu00e8le Recommendation
export interface IRecommendation extends Document {
  userId: mongoose.Types.ObjectId; // Utilisateur qui reu00e7oit la recommandation
  authorId: mongoose.Types.ObjectId; // Utilisateur qui u00e9crit la recommandation
  text: string; // Contenu de la recommandation
  date: Date; // Date de la recommandation
  createdAt: Date;
  updatedAt: Date;
}

// Schu00e9ma pour les recommandations
const RecommendationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

// Index composu00e9 pour faciliter la recherche
RecommendationSchema.index({ userId: 1, authorId: 1 });

// Cru00e9ation et export du modu00e8le
export default mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
