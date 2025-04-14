/**
 * Ressources de profil pour DiscoverMe
 * 
 * Ces ressources permettent aux agents IA d'accéder aux informations
 * de profil des utilisateurs.
 */

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { profileServiceMongo } from '../services/profileServiceMongo.js';
import { logger } from '../utils/logger.js';

// Définition des modèles d'URI pour éviter les erreurs d'URL
const PROFILE_SECTIONS_URI = 'profile://sections'; // only static resource we have here
const PROFILE_SECTION_URI = new ResourceTemplate('profile://user/{userId}/{section}', { userId: undefined, section: undefined });
const DETAILED_PROFILE_URI = new ResourceTemplate('profile://user/{userId}', { userId: undefined });
const USER_SKILLS_URI = new ResourceTemplate('skills://user/{userId}', { userId: undefined });
const USER_EXPERIENCE_URI = new ResourceTemplate('experience://user/{userId}', { userId: undefined });
const USER_EDUCATION_URI = new ResourceTemplate('education://user/{userId}', { userId: undefined });

/**
 * Ressource pour le profil détaillé
 */
export const registerDetailedProfileResource = (server: McpServer) => {
  server.resource(
    'detailed-profile',
    DETAILED_PROFILE_URI,
    async (uri: URL, params: any) => {
      logger.info(`Resource called: detailed-profile, URI: ${uri.href}, Variables: ${JSON.stringify(params)}`);
      try {
        // Initialiser le service de profil
        await profileServiceMongo.initialize();
        
        // Récupérer l'ID de l'utilisateur ou utiliser la valeur par défaut
        const userId = params.userId as string || undefined;
        const profile = await profileServiceMongo.getProfile(userId);
        
        logger.info(`Profile retrieved successfully for ${userId || 'default user'}`);
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(profile, null, 2)
          }]
        };
      } catch (error) {
        logger.error(`Error in detailed-profile resource: ${error}`);
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify({ error: 'Failed to retrieve profile' }, null, 2)
          }]
        };
      }
    }
  );
};

/**
 * Ressource pour les compétences spécifiques d'un utilisateur
 */
export const registerUserSkillsResource = (server: McpServer) => {
  server.resource(
    'user-skills',
    USER_SKILLS_URI,
    async (uri: URL, params: any) => {
      logger.info(`Resource called: user-skills, URI: ${uri.href}, Variables: ${JSON.stringify(params)}`);
      try {
        // Initialiser le service de profil
        await profileServiceMongo.initialize();
        
        // Récupérer l'ID de l'utilisateur ou utiliser la valeur par défaut
        const userId = params.userId as string || undefined;
        const skills = await profileServiceMongo.getProfileSection('skills', userId);
        
        logger.info(`Skills retrieved successfully for ${userId || 'default user'}`);
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(skills, null, 2)
          }]
        };
      } catch (error) {
        logger.error(`Error in user-skills resource: ${error}`);
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify({ error: 'Failed to retrieve skills' }, null, 2)
          }]
        };
      }
    }
  );
};

/**
 * Ressource pour l'expérience professionnelle d'un utilisateur
 */
export const registerUserExperienceResource = (server: McpServer) => {
  server.resource(
    'user-experience',
    USER_EXPERIENCE_URI,
    async (uri: URL, params: any) => {
      logger.info(`Resource called: user-experience, URI: ${uri.href}, Variables: ${JSON.stringify(params)}`);
      try {
        // Initialiser le service de profil
        await profileServiceMongo.initialize();
        
        // Récupérer l'ID de l'utilisateur ou utiliser la valeur par défaut
        const userId = params.userId as string || undefined;
        const experience = await profileServiceMongo.getProfileSection('experience', userId);
        
        logger.info(`Experience retrieved successfully for ${userId || 'default user'}`);
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(experience, null, 2)
          }]
        };
      } catch (error) {
        logger.error(`Error in user-experience resource: ${error}`);
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify({ error: 'Failed to retrieve experience' }, null, 2)
          }]
        };
      }
    }
  );
};

/**
 * Ressource pour l'éducation d'un utilisateur
 */
export const registerUserEducationResource = (server: McpServer) => {
  server.resource(
    'user-education',
    USER_EDUCATION_URI,
    async (uri: URL, params: any) => {
      logger.info(`Resource called: user-education, URI: ${uri.href}, Variables: ${JSON.stringify(params)}`);
      try {
        // Initialiser le service de profil
        await profileServiceMongo.initialize();
        
        // Récupérer l'ID de l'utilisateur ou utiliser la valeur par défaut
        const userId = params.userId as string || undefined;
        const education = await profileServiceMongo.getProfileSection('education', userId);
        
        logger.info(`Education retrieved successfully for ${userId || 'default user'}`);
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(education, null, 2)
          }]
        };
      } catch (error) {
        logger.error(`Error in user-education resource: ${error}`);
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify({ error: 'Failed to retrieve education' }, null, 2)
          }]
        };
      }
    }
  );
};

/**
 * Ressource pour une section spécifique du profil d'un utilisateur
 */
export const registerProfileSectionResource = (server: McpServer) => {
  server.resource(
    'profile-section',
    PROFILE_SECTION_URI,
    async (uri: URL, params: any) => {
      logger.info(`Resource called: profile-section, URI: ${uri.href}, Variables: ${JSON.stringify(params)}`);
      try {
        // Initialiser le service de profil
        await profileServiceMongo.initialize();
        
        // Récupérer l'ID de l'utilisateur ou utiliser la valeur par défaut
        const userId = params.userId as string || undefined;
        const section = params.section as string;
        
        // Vérifier si la section demandée est valide
        const validSections = ['name', 'title', 'skills', 'experience', 'education', 'contact', 'bio'];
        
        if (validSections.includes(section)) {
          const sectionData = await profileServiceMongo.getProfileSection(section as any, userId);
          logger.info(`Section ${section} retrieved successfully for ${userId || 'default user'}`);
          
          return {
            contents: [{
              uri: uri.href,
              text: JSON.stringify(sectionData, null, 2)
            }]
          };
        } else {
          logger.warn(`Invalid section requested: ${section}`);
          return {
            contents: [{
              uri: uri.href,
              text: JSON.stringify({ error: 'Section invalide' }, null, 2)
            }]
          };
        }
      } catch (error) {
        logger.error(`Error in profile-section resource: ${error}`);
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify({ error: 'Failed to retrieve profile section' }, null, 2)
          }]
        };
      }
    }
  );
};

/**
 * Ressource pour l'énumération des sections de profil disponibles
 * Cette ressource permet aux clients MCP de découvrir les sections valides qu'ils peuvent utiliser
 */
export const registerProfileSectionsEnumResource = (server: McpServer) => {
  server.resource(
    'profile-sections-enum',
    PROFILE_SECTIONS_URI,
    async (uri: URL, params: any) => {
      logger.info(`Resource called: profile-sections-enum, URI: ${uri.href}`);
      try {
        // Liste des sections valides
        const validSections = ['name', 'title', 'skills', 'experience', 'education', 'contact', 'bio'];
        
        // Description de chaque section
        const sectionsDescription = {
          name: "Nom complet de l'utilisateur",
          title: "Titre professionnel ou poste actuel",
          skills: "Compétences professionnelles et techniques",
          experience: "Expériences professionnelles",
          education: "Formation académique",
          contact: "Informations de contact",
          bio: "Biographie ou présentation personnelle"
        };
        
        logger.info('Profile sections enumeration retrieved successfully');
        
        // Formater les données selon le format attendu par le SDK MCP
        const responseData = {
          validSections,
          sectionsDescription,
          usage: {
            profileSection: "profile://user/{userId}/{section}",
            example: "profile://user/user123/skills"
          }
        };
        
        // Retourner les données dans le format attendu par le SDK
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(responseData, null, 2)
          }]
        };
      } catch (error) {
        logger.error(`Error in profile-sections-enum resource: ${error}`);
        throw error;
      }
    }
  );
};

// Variable pour suivre si les ressources ont déjà été enregistrées
let profileResourcesRegistered = false;

/**
 * Fonction pour enregistrer toutes les ressources de profil
 * Utilise un flag global pour éviter les enregistrements multiples
 */
export const registerAllProfileResources = (server: McpServer) => {
  // Si les ressources ont déjà été enregistrées, ne rien faire
  if (profileResourcesRegistered) {
    logger.info('Ressources de profil déjà enregistrées, ignoring...');
    return;
  }
  
  try {
    // Enregistrer les ressources de profil
    registerDetailedProfileResource(server);
    
    registerUserSkillsResource(server);
    
    registerUserExperienceResource(server);
    
    registerUserEducationResource(server);
    
    registerProfileSectionResource(server);
    
    registerProfileSectionsEnumResource(server);
    
    // Marquer les ressources comme enregistrées
    profileResourcesRegistered = true;
    logger.info('Toutes les ressources de profil ont été enregistrées avec succès');
  } catch (error) {
    logger.error(`Erreur lors de l'enregistrement des ressources de profil: ${error}`);
  }
};
