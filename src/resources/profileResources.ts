/**
 * Ressources de profil pour DiscoverMe
 * 
 * Ces ressources permettent aux agents IA d'accuéder aux informations
 * de profil des utilisateurs.
 */

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { profileServiceMongo } from '../services/profileServiceMongo.js';

/**
 * Ressource pour le profil duétaillué
 */
export const registerDetailedProfileResource = (server: McpServer) => {
  server.resource(
    'detailed-profile',
    'profile://user/{userId}',
    async (uri, variables) => {
      // En production, on ruécupu00e8rerait le profil spuécifique
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
 * Ressource pour les compuétences spuécifiques d'un utilisateur
 */
export const registerUserSkillsResource = (server: McpServer) => {
  server.resource(
    'user-skills',
    'skills://user/{userId}',
    async (uri, variables) => {
      // En production, on ruécupu00e8rerait les compuétences d'un utilisateur spuécifique
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
 * Ressource pour l'expuérience professionnelle d'un utilisateur
 */
export const registerUserExperienceResource = (server: McpServer) => {
  server.resource(
    'user-experience',
    'experience://user/{userId}',
    async (uri, variables) => {
      // En production, on ruécupu00e8rerait l'expuérience d'un utilisateur spuécifique
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
 * Ressource pour l'uéducation d'un utilisateur
 */
export const registerUserEducationResource = (server: McpServer) => {
  server.resource(
    'user-education',
    'education://user/{userId}',
    async (uri, variables) => {
      // En production, on ruécupu00e8rerait l'uéducation d'un utilisateur spuécifique
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
 * Ressource pour une section spuécifique du profil d'un utilisateur
 */
export const registerProfileSectionResource = (server: McpServer) => {
  server.resource(
    'profile-section',
    new ResourceTemplate('profile://user/{userId}/{section}', { list: undefined }),
    async (uri, variables) => {
      // Extraire les variables
      // const userId = variables.userId as string;
      const section = variables.section as string;
      
      // Vuérifier si la section demanduée est valide
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
