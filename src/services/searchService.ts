/**
 * Service de recherche pour DiscoverMe
 * 
 * Ce service fournit des fonctionnalités de recherche avancée pour les profils utilisateurs.
 * Il utilise MongoDB pour stocker et interroger les données des utilisateurs.
 * À l'avenir, il pourrait être amélioré avec MongoDB Atlas Search pour des recherches plus sophistiquées.
 */

import { logger } from '../utils/logger.js';
import UserModel, { IUser } from '../models/User.js';
import mongoose from 'mongoose';

// Types pour les paramètres de recherche
export interface SearchByNameParams {
  query: string;
  limit?: number;
}

export interface SearchBySkillsParams {
  skills: string[];
  matchAll?: boolean;
  limit?: number;
}

export interface AdvancedSearchParams {
  keywords?: string;
  company?: string;
  position?: string;
  location?: string;
  experience?: number;
  limit?: number;
}

// Type pour les résultats de recherche
export interface SearchResult {
  _id: string;
  name: string;
  headline?: string;
  skills: Array<{
    name: string;
    level?: string;
    endorsements?: number;
  }>;
  experience?: Array<{
    title: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    field?: string;
    startYear: number;
    endYear?: number;
  }>;
  relevanceScore: number; // Score de pertinence entre 0 et 1
  openToWork?: boolean;
  profileViews?: number;
}

/**
 * Classe de service pour les fonctionnalités de recherche
 */
class SearchService {
  /**
   * Recherche des profils par nom ou partie du nom
   */
  async searchByName({ query, limit = 10 }: SearchByNameParams): Promise<SearchResult[]> {
    try {
      logger.info(`Recherche de profils par nom: ${query}`);
      
      // Utiliser MongoDB pour la recherche
      const users = await UserModel.find(
        { name: { $regex: query, $options: 'i' } }
      )
      .limit(limit)
      .lean();
      
      // Formater les résultats
      const results = users.map(user => this._formatSearchResult(user, { nameQuery: query }));
      
      return results;
    } catch (error) {
      logger.error('Erreur lors de la recherche par nom:', error);
      return [];
    }
  }

  /**
   * Recherche des profils par compétences
   */
  async searchBySkills({ skills, matchAll = false, limit = 10 }: SearchBySkillsParams): Promise<SearchResult[]> {
    try {
      logger.info(`Recherche de profils par compétences: ${skills.join(', ')}`);
      
      // Construire la requête MongoDB en fonction du paramètre matchAll
      let query;
      if (matchAll) {
        // Doit correspondre à toutes les compétences (utiliser $all)
        query = { 'skills.name': { $all: skills.map(skill => new RegExp(skill, 'i')) } };
      } else {
        // Doit correspondre à au moins une des compétences (utiliser $in)
        query = { 'skills.name': { $in: skills.map(skill => new RegExp(skill, 'i')) } };
      }
      
      // Exécuter la requête
      const users = await UserModel.find(query)
        .limit(limit)
        .lean();
      
      // Formater les résultats
      const results = users.map(user => this._formatSearchResult(user, { skillsQuery: skills }));
      
      return results;
    } catch (error) {
      logger.error('Erreur lors de la recherche par compétences:', error);
      return [];
    }
  }

  /**
   * Recherche avancée multi-critères
   */
  async advancedSearch(params: AdvancedSearchParams): Promise<SearchResult[]> {
    try {
      logger.info(`Recherche avancée avec paramètres: ${JSON.stringify(params)}`);
      
      // Construire la requête MongoDB
      const query: any = {};
      const aggregationPipeline: any[] = [];
      
      // Recherche par mots-clés (nom, headline, compétences)
      if (params.keywords) {
        const keywordRegex = new RegExp(params.keywords, 'i');
        query.$or = [
          { name: keywordRegex },
          { headline: keywordRegex },
          { 'skills.name': keywordRegex }
        ];
      }
      
      // Recherche par entreprise (dans les expériences professionnelles)
      if (params.company) {
        query['experience.company'] = new RegExp(params.company, 'i');
      }
      
      // Recherche par poste (dans le titre ou les expériences)
      if (params.position) {
        query.$or = query.$or || [];
        query.$or.push(
          { headline: new RegExp(params.position, 'i') },
          { 'experience.title': new RegExp(params.position, 'i') }
        );
      }
      
      // Recherche par localisation (à implémenter plus tard dans le modèle User)
      // if (params.location) {
      //   query.location = new RegExp(params.location, 'i');
      // }
      
      // Recherche par années d'expérience minimum
      if (params.experience) {
        // Ajouter un pipeline d'agrégation pour calculer l'expérience totale
        aggregationPipeline.push(
          {
            $addFields: {
              totalExperience: {
                $reduce: {
                  input: '$experience',
                  initialValue: 0,
                  in: {
                    $add: [
                      '$$value',
                      {
                        $divide: [
                          {
                            $subtract: [
                              { $ifNull: ['$$this.endDate', new Date()] },
                              '$$this.startDate'
                            ]
                          },
                          // Convertir millisecondes en années (approximatif)
                          31536000000 // 1000 * 60 * 60 * 24 * 365
                        ]
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            $match: {
              totalExperience: { $gte: params.experience }
            }
          }
        );
      }
      
      // Exécuter la requête avec ou sans agrégation
      let users;
      if (aggregationPipeline.length > 0) {
        // Ajouter le matching initial au pipeline d'agrégation
        aggregationPipeline.unshift({ $match: query });
        
        // Ajouter la limite au pipeline
        aggregationPipeline.push({ $limit: params.limit || 10 });
        
        users = await UserModel.aggregate(aggregationPipeline);
      } else {
        // Utiliser une simple requête find si pas besoin d'agrégation
        users = await UserModel.find(query)
          .limit(params.limit || 10)
          .lean();
      }
      
      // Formater les résultats
      return users.map(user => this._formatSearchResult(user, params));
    } catch (error) {
      logger.error('Erreur lors de la recherche avancée:', error);
      return [];
    }
  }

  /**
   * Formate un utilisateur en résultat de recherche
   * @private
   */
  private _formatSearchResult(user: any, query: any): SearchResult {
    // Extraire les données pertinentes du profil utilisateur
    return {
      _id: user._id.toString(),
      name: user.name,
      headline: user.headline,
      skills: user.skills || [],
      experience: user.experience || [],
      education: user.education || [],
      relevanceScore: this._calculateRelevanceScore(user, query),
      openToWork: user.openToWork,
      profileViews: user.profileViews
    };
  }

  /**
   * Calcule un score de pertinence pour un profil par rapport à une requête
   * @private
   */
  private _calculateRelevanceScore(user: any, query: any): number {
    let score = 0.5; // Score de base
    
    // Score basé sur la correspondance du nom
    if (query.nameQuery && user.name) {
      const nameMatch = user.name.toLowerCase().includes(query.nameQuery.toLowerCase());
      if (nameMatch) score += 0.3;
    }
    
    // Score basé sur la correspondance des compétences
    if (query.skillsQuery && user.skills && user.skills.length > 0) {
      const matchingSkills = query.skillsQuery.filter((skill: string) => 
        user.skills.some((s: any) => s.name.toLowerCase().includes(skill.toLowerCase()))
      );
      score += (matchingSkills.length / query.skillsQuery.length) * 0.3;
    }
    
    // Score basé sur la correspondance de l'entreprise
    if (query.company && user.experience && user.experience.length > 0) {
      const companyMatch = user.experience.some((exp: any) => 
        exp.company.toLowerCase().includes(query.company.toLowerCase())
      );
      if (companyMatch) score += 0.2;
    }
    
    // Score bonus pour les profils ouverts aux opportunités
    if (user.openToWork) score += 0.1;
    
    // Normaliser le score entre 0 et 1
    return Math.min(Math.max(score, 0), 1);
  }
}

// Exporter une instance singleton du service
export const searchService = new SearchService();
