/**
 * Service de recommandation pour DiscoverMe
 * 
 * Ce service fournit des fonctionnalitués de recommandation de profils
 * en fonction de diffuérents critu00e8res comme les compuétences, l'expuérience,
 * et les connexions existantes.
 */

import { logger } from '../utils/logger.js';
import UserModel, { IUser } from '../models/User.js';
import mongoose from 'mongoose';

// Type pour les ruésultats de recommandation
export interface RecommendationResult {
  _id: string;
  name: string;
  headline?: string;
  skills: Array<{
    name: string;
    level?: string;
    endorsements?: number;
  }>;
  relevanceScore: number; // Score de pertinence entre 0 et 1
  matchingSkills?: string[]; // Compuétences en commun
  openToWork?: boolean;
}

/**
 * Classe de service pour les fonctionnalitués de recommandation
 */
class RecommendationService {
  /**
   * Trouve des profils similaires u00e0 un utilisateur donnué
   * @param userId ID de l'utilisateur
   * @param limit Nombre maximum de ruésultats
   */
  async findSimilarProfiles(userId: string, limit: number = 5): Promise<RecommendationResult[]> {
    try {
      logger.info(`Recherche de profils similaires pour l'utilisateur: ${userId}`);
      
      // Ruécupuérer le profil de l'utilisateur
      const user = await UserModel.findById(userId).lean();
      
      if (!user) {
        logger.error(`Utilisateur non trouvé: ${userId}`);
        return [];
      }
      
      // Extraire les compuétences de l'utilisateur
      const userSkills = user.skills.map(skill => skill.name);
      
      // Trouver des utilisateurs avec des compuétences similaires
      const similarUsers = await UserModel.aggregate([
        // Exclure l'utilisateur lui-mu00eame
        { $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } } },
        
        // Ajouter un champ pour compter les compuétences en commun
        { $addFields: {
          matchingSkills: {
            $filter: {
              input: "$skills.name",
              as: "skillName",
              cond: { $in: ["$$skillName", userSkills] }
            }
          }
        }},
        
        // Ajouter un champ pour le nombre de compuétences en commun
        { $addFields: {
          matchingSkillsCount: { $size: "$matchingSkills" }
        }},
        
        // Filtrer pour garder seulement ceux qui ont au moins une compuétence en commun
        { $match: { matchingSkillsCount: { $gt: 0 } } },
        
        // Trier par nombre de compuétences en commun (descendant)
        { $sort: { matchingSkillsCount: -1 } },
        
        // Limiter le nombre de ruésultats
        { $limit: limit }
      ]);
      
      // Formater les ruésultats
      return similarUsers.map(user => ({
        _id: user._id.toString(),
        name: user.name,
        headline: user.headline,
        skills: user.skills || [],
        relevanceScore: user.matchingSkillsCount / Math.max(userSkills.length, 1),
        matchingSkills: user.matchingSkills,
        openToWork: user.openToWork
      }));
    } catch (error) {
      logger.error('Erreur lors de la recherche de profils similaires:', error);
      return [];
    }
  }
  
  /**
   * Trouve des connexions potentielles pour un utilisateur
   * (connexions de second niveau - amis d'amis)
   * @param userId ID de l'utilisateur
   * @param limit Nombre maximum de ruésultats
   */
  async findPotentialConnections(userId: string, limit: number = 5): Promise<RecommendationResult[]> {
    try {
      logger.info(`Recherche de connexions potentielles pour l'utilisateur: ${userId}`);
      
      // Note: Cette fonctionnalitué nuécessite un modu00e8le de connexions
      // Pour l'instant, nous allons simuler en recommandant des profils avec des compuétences similaires
      // mais qui ne sont pas encore connectués
      
      // Implémenter plus tard avec un modèle de connexions
      // Pour l'instant, retourner des profils similaires
      return this.findSimilarProfiles(userId, limit);
    } catch (error) {
      logger.error('Erreur lors de la recherche de connexions potentielles:', error);
      return [];
    }
  }
  
  /**
   * Trouve des experts dans un domaine spuécifique
   * @param skills Compuétences recherchuées
   * @param industry Secteur d'activitué (optionnel)
   * @param limit Nombre maximum de ruésultats
   */
  async findExperts(skills: string[], industry?: string, limit: number = 5): Promise<RecommendationResult[]> {
    try {
      logger.info(`Recherche d'experts avec les compuétences: ${skills.join(', ')}`);
      
      // Construire la requête MongoDB
      const query: any = {
        'skills.name': { $in: skills.map(skill => new RegExp(skill, 'i')) },
        // Ajouter un critère pour le niveau d'expertise (endorsements élevés)
        'skills.endorsements': { $gte: 5 }
      };
      
      // Ajouter le filtre par secteur d'activité si fourni
      // Note: Nécessite d'ajouter un champ 'industry' au modèle User
      if (industry) {
        // query.industry = new RegExp(industry, 'i');
        // Pour l'instant, nous ignorons ce filtre car le modèle ne contient pas ce champ
      }
      
      // Trouver les experts
      const experts = await UserModel.find(query)
        .sort({ 'skills.endorsements': -1 })
        .limit(limit)
        .lean();
      
      // Formater les résultats
      return experts.map(user => {
        // Calculer les compétences correspondantes
        const matchingSkills = user.skills
          .filter((skill: any) => 
            skills.some(s => new RegExp(s, 'i').test(skill.name))
          )
          .map((skill: any) => skill.name);
        
        return {
          _id: user._id.toString(),
          name: user.name,
          headline: user.headline,
          skills: user.skills || [],
          relevanceScore: matchingSkills.length / Math.max(skills.length, 1),
          matchingSkills,
          openToWork: user.openToWork
        };
      });
    } catch (error) {
      logger.error('Erreur lors de la recherche d\'experts:', error);
      return [];
    }
  }
}

// Exporter une instance singleton du service
export const recommendationService = new RecommendationService();
