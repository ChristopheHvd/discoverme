import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { profileServiceMongo } from './services/profileServiceMongo.js';

// Outil pour récupérer le profil professionnel de l'utilisateur
export const registerGetProfileTool = (server: McpServer) => {
  server.tool(
    'get-profile',
    {},
    async () => {
      // Utiliser le service pour récupérer le profil
      const profile = await profileServiceMongo.getProfile();
      
      return {
        content: [{ type: 'text', text: JSON.stringify(profile, null, 2) }]
      };
    }
  );
};

// Outil pour récupérer uniquement les compétences de l'utilisateur
export const registerGetSkillsTool = (server: McpServer) => {
  server.tool(
    'get-skills',
    {},
    async () => {
      // Utiliser le service pour récupérer les compétences
      const skills = await profileServiceMongo.getProfileSection('skills');
      
      return {
        content: [{ type: 'text', text: JSON.stringify(skills, null, 2) }]
      };
    }
  );
};

// Outil pour vérifier la disponibilité de l'utilisateur
export const registerCheckAvailabilityTool = (server: McpServer) => {
  server.tool(
    'check-availability',
    {
      date: z.string().describe('La date au format YYYY-MM-DD'),
      time: z.string().describe('L\'heure au format HH:MM')
    },
    async ({ date, time }: { date: string; time: string }) => {
      // Utiliser le service pour vérifier la disponibilité
      const result = await profileServiceMongo.checkAvailability(date, time);
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    }
  );
};

// Outil pour demander un contact avec l'utilisateur
export const registerRequestContactTool = (server: McpServer) => {
  server.tool(
    'request-contact',
    {
      reason: z.string().describe('La raison de la demande de contact'),
      contactMethod: z.enum(['email', 'téléphone', 'visioconférence']).describe('La méthode de contact préférée')
    },
    async ({ reason, contactMethod }: { reason: string; contactMethod: string }) => {
      // Utiliser le service pour enregistrer la demande de contact
      const result = await profileServiceMongo.requestContact(reason, contactMethod);
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    }
  );
};
