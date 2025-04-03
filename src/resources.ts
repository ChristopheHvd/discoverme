import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { profileServiceMongo } from './services/profileServiceMongo.js';

// Les données sont maintenant stockées dans MongoDB Atlas

/**
 * Enregistre une ressource statique pour le profil complet
 */
export const registerProfileResource = (server: McpServer) => {
  server.resource(
    'profile',                // Nom de la ressource
    'profile://user',         // URI de la ressource
    async (uri) => {
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
 * Enregistre une ressource dynamique pour les compétences
 */
export const registerSkillsResource = (server: McpServer) => {
  server.resource(
    'skills',
    'skills://user',
    async (uri) => {
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
 * Enregistre une ressource dynamique pour l'expérience professionnelle
 */
export const registerExperienceResource = (server: McpServer) => {
  server.resource(
    'experience',
    'experience://user',
    async (uri) => {
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
 * Enregistre une ressource dynamique pour l'éducation
 */
export const registerEducationResource = (server: McpServer) => {
  server.resource(
    'education',
    'education://user',
    async (uri) => {
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
 * Enregistre une ressource paramétrable pour les détails spécifiques du profil
 * Exemple d'URI: profile://user/skills, profile://user/experience, etc.
 */
export const registerProfileDetailsResource = (server: McpServer) => {
  server.resource(
    'profile-details',
    new ResourceTemplate('profile://user/{section}', { list: undefined }),
    async (uri, variables) => {
      // Extraire la section des variables
      const section = variables.section as string;
      
      // Vérifier si la section demandée est valide
      const validSections = ['name', 'title', 'skills', 'experience', 'education', 'contact', 'bio'];
      if (validSections.includes(section)) {
        const sectionData = await profileServiceMongo.getProfileSection(section as any);
        if (sectionData) {
          return {
            contents: [{
              uri: uri.href,
              text: JSON.stringify(sectionData, null, 2)
            }]
          };
        }
      }
      
      // Si la section n'existe pas, retourner un message d'erreur
      return {
        contents: [{
          uri: uri.href,
          text: `Section '${section}' non trouvée dans le profil.`
        }]
      };
    }
  );
};

/**
 * Fonction utilitaire pour enregistrer toutes les ressources sur le serveur
 */
export const registerAllResources = (server: McpServer) => {
  registerProfileResource(server);
  registerSkillsResource(server);
  registerExperienceResource(server);
  registerEducationResource(server);
  registerProfileDetailsResource(server);
};
