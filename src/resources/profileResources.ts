/**
 * Ressources de profil pour DiscoverMe
 * 
 * Ces ressources permettent aux agents IA d'accu00e9der aux informations
 * de profil des utilisateurs.
 */

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { profileServiceMongo } from '../services/profileServiceMongo.js';

/**
 * Ressource pour le profil du00e9taillu00e9
 */
export const registerDetailedProfileResource = (server: McpServer) => {
  server.resource(
    'detailed-profile',
    'profile://user/{userId}',
    async (uri, variables) => {
      // En production, on ru00e9cupu00e8rerait le profil spu00e9cifique
      // const userId = variables.userId as string;
      // const profile = await userService.getDetailedProfile(userId);
      
      // Pour l'instant, on utilise le service existant
      const profile = await profileServiceMongo.getProfile();
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(profile, null, 2)
        }]
      };
    }
  );
};

/**
 * Ressource pour les compu00e9tences spu00e9cifiques d'un utilisateur
 */
export const registerUserSkillsResource = (server: McpServer) => {
  server.resource(
    'user-skills',
    'skills://user/{userId}',
    async (uri, variables) => {
      // En production, on ru00e9cupu00e8rerait les compu00e9tences d'un utilisateur spu00e9cifique
      // const userId = variables.userId as string;
      // const skills = await userService.getUserSkills(userId);
      
      // Pour l'instant, on utilise le service existant
      const skills = await profileServiceMongo.getProfileSection('skills');
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(skills, null, 2)
        }]
      };
    }
  );
};

/**
 * Ressource pour l'expu00e9rience professionnelle d'un utilisateur
 */
export const registerUserExperienceResource = (server: McpServer) => {
  server.resource(
    'user-experience',
    'experience://user/{userId}',
    async (uri, variables) => {
      // En production, on ru00e9cupu00e8rerait l'expu00e9rience d'un utilisateur spu00e9cifique
      // const userId = variables.userId as string;
      // const experience = await userService.getUserExperience(userId);
      
      // Pour l'instant, on utilise le service existant
      const experience = await profileServiceMongo.getProfileSection('experience');
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(experience, null, 2)
        }]
      };
    }
  );
};

/**
 * Ressource pour l'u00e9ducation d'un utilisateur
 */
export const registerUserEducationResource = (server: McpServer) => {
  server.resource(
    'user-education',
    'education://user/{userId}',
    async (uri, variables) => {
      // En production, on ru00e9cupu00e8rerait l'u00e9ducation d'un utilisateur spu00e9cifique
      // const userId = variables.userId as string;
      // const education = await userService.getUserEducation(userId);
      
      // Pour l'instant, on utilise le service existant
      const education = await profileServiceMongo.getProfileSection('education');
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(education, null, 2)
        }]
      };
    }
  );
};

/**
 * Ressource pour une section spu00e9cifique du profil d'un utilisateur
 */
export const registerProfileSectionResource = (server: McpServer) => {
  server.resource(
    'profile-section',
    new ResourceTemplate('profile://user/{userId}/{section}', { list: undefined }),
    async (uri, variables) => {
      // Extraire les variables
      // const userId = variables.userId as string;
      const section = variables.section as string;
      
      // Vu00e9rifier si la section demandu00e9e est valide
      const validSections = ['name', 'title', 'skills', 'experience', 'education', 'contact', 'bio'];
      if (validSections.includes(section)) {
        const sectionData = await profileServiceMongo.getProfileSection(section as any);
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(sectionData, null, 2)
          }]
        };
      } else {
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify({ error: 'Section invalide' }, null, 2)
          }]
        };
      }
    }
  );
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
