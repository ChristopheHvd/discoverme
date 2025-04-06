/**
 * Service de recherche pour DiscoverMe
 * 
 * Ce service fournit des fonctionnalités de recherche avancée pour les profils utilisateurs.
 * Pour l'instant, il utilise des données factices, mais il pourrait être étendu
 * pour utiliser MongoDB Atlas Search ou Elasticsearch à l'avenir.
 */

import { logger } from '../utils/logger.js';
import UserModel from '../models/User.js';

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
  title: string;
  company?: string;
  location?: string;
  skills: string[];
  relevanceScore: number; // Score de pertinence entre 0 et 1
}

// Données factices pour simuler des résultats de recherche
const mockProfiles = [
  {
    _id: '60d21b4667d0d8992e610c85',
    name: 'Sophie Martin',
    title: 'Développeuse Full Stack Senior',
    company: 'TechInnovate',
    location: 'Paris, France',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'GraphQL', 'TypeScript'],
    experience: [
      { company: 'TechInnovate', position: 'Développeuse Full Stack Senior', years: 3 },
      { company: 'WebSolutions', position: 'Développeuse Frontend', years: 2 }
    ]
  },
  {
    _id: '60d21b4667d0d8992e610c86',
    name: 'Thomas Dubois',
    title: 'Architecte Cloud',
    company: 'CloudNative',
    location: 'Lyon, France',
    skills: ['AWS', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'Go', 'Python'],
    experience: [
      { company: 'CloudNative', position: 'Architecte Cloud', years: 4 },
      { company: 'DataTech', position: 'DevOps Engineer', years: 3 }
    ]
  },
  {
    _id: '60d21b4667d0d8992e610c87',
    name: 'Emma Bernard',
    title: 'Data Scientist',
    company: 'DataInsight',
    location: 'Bordeaux, France',
    skills: ['Python', 'R', 'Machine Learning', 'TensorFlow', 'SQL', 'Data Visualization'],
    experience: [
      { company: 'DataInsight', position: 'Data Scientist', years: 2 },
      { company: 'AnalyticsPro', position: 'Data Analyst', years: 2 }
    ]
  },
  {
    _id: '60d21b4667d0d8992e610c88',
    name: 'Lucas Moreau',
    title: 'Ingénieur DevOps',
    company: 'InfraScale',
    location: 'Lille, France',
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'Ansible', 'Terraform', 'AWS', 'Linux'],
    experience: [
      { company: 'InfraScale', position: 'Ingénieur DevOps', years: 3 },
      { company: 'TechOps', position: 'Administrateur Système', years: 2 }
    ]
  },
  {
    _id: '60d21b4667d0d8992e610c89',
    name: 'Camille Leroy',
    title: 'UX/UI Designer',
    company: 'DesignFirst',
    location: 'Nantes, France',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Prototyping', 'HTML/CSS'],
    experience: [
      { company: 'DesignFirst', position: 'UX/UI Designer', years: 4 },
      { company: 'CreativeAgency', position: 'UI Designer', years: 2 }
    ]
  }
];

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
      
      // En production, on utiliserait MongoDB
      // const results = await UserModel.find(
      //   { name: { $regex: query, $options: 'i' } },
      //   { name: 1, title: 1, skills: 1 }
      // ).limit(limit).lean();
      
      // Simulation avec des données factices
      const results = mockProfiles
        .filter(profile => profile.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, limit)
        .map(profile => ({
          _id: profile._id,
          name: profile.name,
          title: profile.title,
          company: profile.company,
          location: profile.location,
          skills: profile.skills,
          relevanceScore: this._calculateRelevanceScore(profile, { nameQuery: query })
        }));
      
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
      
      // En production, on utiliserait MongoDB
      // const query = matchAll
      //   ? { skills: { $all: skills } }
      //   : { skills: { $in: skills } };
      // const results = await UserModel.find(query).limit(limit).lean();
      
      // Simulation avec des données factices
      const results = mockProfiles
        .filter(profile => {
          if (matchAll) {
            return skills.every(skill => 
              profile.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
            );
          } else {
            return skills.some(skill => 
              profile.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
            );
          }
        })
        .slice(0, limit)
        .map(profile => ({
          _id: profile._id,
          name: profile.name,
          title: profile.title,
          company: profile.company,
          location: profile.location,
          skills: profile.skills,
          relevanceScore: this._calculateRelevanceScore(profile, { skillsQuery: skills })
        }));
      
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
      
      // En production, on utiliserait MongoDB avec une requête complexe
      // const query = {};
      // if (params.keywords) query.$text = { $search: params.keywords };
      // if (params.company) query['experience.company'] = { $regex: params.company, $options: 'i' };
      // ...
      
      // Simulation avec des données factices
      let results = [...mockProfiles];
      
      // Filtrer par mots-clés (recherche dans le nom, titre et compétences)
      if (params.keywords) {
        const keywords = params.keywords.toLowerCase();
        results = results.filter(profile => 
          profile.name.toLowerCase().includes(keywords) ||
          profile.title.toLowerCase().includes(keywords) ||
          profile.skills.some(skill => skill.toLowerCase().includes(keywords))
        );
      }
      
      // Filtrer par entreprise
      if (params.company) {
        const company = params.company.toLowerCase();
        results = results.filter(profile => 
          profile.company?.toLowerCase().includes(company) ||
          profile.experience.some(exp => exp.company.toLowerCase().includes(company))
        );
      }
      
      // Filtrer par poste
      if (params.position) {
        const position = params.position.toLowerCase();
        results = results.filter(profile => 
          profile.title.toLowerCase().includes(position) ||
          profile.experience.some(exp => exp.position.toLowerCase().includes(position))
        );
      }
      
      // Filtrer par localisation
      if (params.location) {
        const location = params.location.toLowerCase();
        results = results.filter(profile => 
          profile.location?.toLowerCase().includes(location)
        );
      }
      
      // Filtrer par années d'expérience minimum
      if (params.experience) {
        results = results.filter(profile => {
          const totalExperience = profile.experience.reduce((sum, exp) => sum + exp.years, 0);
          return totalExperience >= params.experience!;
        });
      }
      
      // Limiter le nombre de résultats
      results = results.slice(0, params.limit || 10);
      
      // Formater les résultats
      return results.map(profile => ({
        _id: profile._id,
        name: profile.name,
        title: profile.title,
        company: profile.company,
        location: profile.location,
        skills: profile.skills,
        relevanceScore: this._calculateRelevanceScore(profile, params)
      }));
    } catch (error) {
      logger.error('Erreur lors de la recherche avancée:', error);
      return [];
    }
  }

  /**
   * Calcule un score de pertinence pour un profil par rapport à une requête
   * @private
   */
  private _calculateRelevanceScore(profile: any, query: any): number {
    let score = 0.5; // Score de base
    
    // Score basé sur la correspondance du nom
    if (query.nameQuery && profile.name) {
      const nameMatch = profile.name.toLowerCase().includes(query.nameQuery.toLowerCase());
      if (nameMatch) score += 0.3;
    }
    
    // Score basé sur la correspondance des compétences
    if (query.skillsQuery && profile.skills) {
      const matchingSkills = query.skillsQuery.filter((skill: string) => 
        profile.skills.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()))
      );
      score += (matchingSkills.length / query.skillsQuery.length) * 0.3;
    }
    
    // Score basé sur la correspondance de l'entreprise
    if (query.company && profile.company) {
      const companyMatch = profile.company.toLowerCase().includes(query.company.toLowerCase());
      if (companyMatch) score += 0.2;
    }
    
    // Normaliser le score entre 0 et 1
    return Math.min(Math.max(score, 0), 1);
  }
}

// Exporter une instance singleton du service
export const searchService = new SearchService();
