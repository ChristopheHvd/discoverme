/**
 * Ressources de profil pour DiscoverMe
 * 
 * Ces ressources permettent aux agents IA d'accéder aux informations
 * de profil des utilisateurs.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { profileServiceMongo } from '../services/profileServiceMongo.js';
import { logger } from '../utils/logger.js';

/**
 * Ressource pour le profil détaillé
 */
export const registerDetailedProfileResource = (server: McpServer) => {
  server.resource({
    name: 'detailed-profile',
    uriTemplate: 'profile://user/{userId}',
    handler: async (uri: URL, variables: Record<string, unknown>) => {
      logger.info(`Resource called: detailed-profile, URI: ${uri.href}, Variables: ${JSON.stringify(variables)}`);
      try {
        // Initialiser le service de profil
        await profileServiceMongo.initialize();
        
        // Récupérer l'ID de l'utilisateur ou utiliser la valeur par défaut
        const userId = variables.userId as string || undefined;
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
  });
};

/**
 * Ressource pour les compétences spécifiques d'un utilisateur
 */
export const registerUserSkillsResource = (server: McpServer) => {
  server.resource({
    name: 'user-skills',
    uriTemplate: 'skills://user/{userId}',
    handler: async (uri: URL, variables: Record<string, unknown>) => {
      logger.info(`Resource called: user-skills, URI: ${uri.href}, Variables: ${JSON.stringify(variables)}`);
      try {
        // Initialiser le service de profil
        await profileServiceMongo.initialize();
        
        // Récupérer l'ID de l'utilisateur ou utiliser la valeur par défaut
        const userId = variables.userId as string || undefined;
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
  });
};

/**
 * Ressource pour l'expérience professionnelle d'un utilisateur
 */
export const registerUserExperienceResource = (server: McpServer) => {
  server.resource({
    name: 'user-experience',
    uriTemplate: 'experience://user/{userId}',
    handler: async (uri: URL, variables: Record<string, unknown>) => {
      logger.info(`Resource called: user-experience, URI: ${uri.href}, Variables: ${JSON.stringify(variables)}`);
      try {
        // Initialiser le service de profil
        await profileServiceMongo.initialize();
        
        // Récupérer l'ID de l'utilisateur ou utiliser la valeur par défaut
        const userId = variables.userId as string || undefined;
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
  });
};

/**
 * Ressource pour l'éducation d'un utilisateur
 */
export const registerUserEducationResource = (server: McpServer) => {
  server.resource({
    name: 'user-education',
    uriTemplate: 'education://user/{userId}',
    handler: async (uri: URL, variables: Record<string, unknown>) => {
      logger.info(`Resource called: user-education, URI: ${uri.href}, Variables: ${JSON.stringify(variables)}`);
      try {
        // Initialiser le service de profil
        await profileServiceMongo.initialize();
        
        // Récupérer l'ID de l'utilisateur ou utiliser la valeur par défaut
        const userId = variables.userId as string || undefined;
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
  });
};

/**
 * Ressource pour une section spécifique du profil d'un utilisateur
 */
export const registerProfileSectionResource = (server: McpServer) => {
  server.resource({
    name: 'profile-section',
    uriTemplate: 'profile://user/{userId}/{section}',
    handler: async (uri: URL, variables: Record<string, unknown>) => {
      logger.info(`Resource called: profile-section, URI: ${uri.href}, Variables: ${JSON.stringify(variables)}`);
      try {
        // Initialiser le service de profil
        await profileServiceMongo.initialize();
        
        // Récupérer l'ID de l'utilisateur ou utiliser la valeur par défaut
        const userId = variables.userId as string || undefined;
        const section = variables.section as string;
        
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
  });
};

/**
 * Fonction pour enregistrer toutes les ressources de profil
 */
export const registerAllProfileResources = (server: McpServer) => {
  registerDetailedProfileResource(server);
  registerUserSkillsResource(server);
  registerUserExperienceResource(server);
  registerUserEducationResource(server);
  registerProfileSectionResource(server);
};
