/**
 * Outils d'interaction pour DiscoverMe
 * 
 * Ces outils permettent aux agents IA d'interagir avec les profils professionnels
 * de diffuérentes maniu00e8res.
 */

import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { interactionService } from '../services/interactionService.js';

/**
 * Outil pour demander une introduction
 */
export const registerRequestIntroductionTool = (server: McpServer) => {
  server.tool(
    'request-introduction',
    {
      userId: z.string().describe('ID de l\'utilisateur u00e0 contacter'),
      agentId: z.string().describe('ID de l\'agent qui fait la demande'),
      reason: z.string().describe('Raison de la demande d\'introduction'),
      message: z.string().describe('Message personnalisué')
    },
    async ({ userId, agentId, reason, message }) => {
      const result = await interactionService.requestIntroduction({ userId, agentId, reason, message });
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    }
  );
};

/**
 * Outil pour recommander un profil
 */
export const registerRecommendProfileTool = (server: McpServer) => {
  server.tool(
    'recommend-profile',
    {
      userId: z.string().describe('ID de l\'utilisateur u00e0 recommander'),
      recommenderId: z.string().describe('ID de l\'agent qui fait la recommandation'),
      skills: z.array(z.string()).optional().describe('Compuétences spuécifiques u00e0 recommander'),
      message: z.string().describe('Message de recommandation')
    },
    async ({ userId, recommenderId, skills, message }) => {
      const result = await interactionService.recommendProfile({ userId, recommenderId, skills, message });
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    }
  );
};

/**
 * Outil pour envoyer un message
 */
export const registerSendMessageTool = (server: McpServer) => {
  server.tool(
    'send-message',
    {
      userId: z.string().describe('ID de l\'utilisateur destinataire'),
      senderId: z.string().describe('ID de l\'expuéditeur'),
      content: z.string().describe('Contenu du message')
    },
    async ({ userId, senderId, content }) => {
      const result = await interactionService.sendMessage(userId, senderId, content);
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    }
  );
};

/**
 * Fonction pour enregistrer tous les outils d'interaction
 */
export const registerAllInteractionTools = (server: McpServer) => {
  registerRequestIntroductionTool(server);
  registerRecommendProfileTool(server);
  registerSendMessageTool(server);
};
