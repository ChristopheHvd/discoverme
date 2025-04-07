/**
 * Outils de recommandation pour DiscoverMe
 * 
 * Ces outils permettent aux agents IA de recevoir des recommandations de profils
 * similaires ou pertinents en fonction de différents critères.
 */

import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { recommendationService } from '../services/recommendationService.js';

/**
 * Outil de recommandation de profils similaires
 */
export const registerSimilarProfilesTool = (server: McpServer) => {
  server.tool(
    'similar-profiles',
    {
      userId: z.string().describe('ID de l\'utilisateur dont on cherche des profils similaires'),
      limit: z.number().optional().describe('Nombre maximum de résultats')
    },
    async ({ userId, limit = 5 }) => {
      const results = await recommendationService.findSimilarProfiles(userId, limit);
      
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
      };
    }
  );
};

/**
 * Outil de recommandation de connexions potentielles
 */
export const registerPotentialConnectionsTool = (server: McpServer) => {
  server.tool(
    'potential-connections',
    {
      userId: z.string().describe('ID de l\'utilisateur pour lequel on cherche des connexions potentielles'),
      limit: z.number().optional().describe('Nombre maximum de résultats')
    },
    async ({ userId, limit = 5 }) => {
      const results = await recommendationService.findPotentialConnections(userId, limit);
      
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
      };
    }
  );
};

/**
 * Outil de recommandation d'experts dans un domaine
 */
export const registerFindExpertsTool = (server: McpServer) => {
  server.tool(
    'find-experts',
    {
      skills: z.array(z.string()).describe('Compétences recherchées'),
      industry: z.string().optional().describe('Secteur d\'activité'),
      limit: z.number().optional().describe('Nombre maximum de résultats')
    },
    async ({ skills, industry, limit = 5 }) => {
      const results = await recommendationService.findExperts(skills, industry, limit);
      
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
      };
    }
  );
};

/**
 * Fonction pour enregistrer tous les outils de recommandation
 */
export const registerAllRecommendationTools = (server: McpServer) => {
  registerSimilarProfilesTool(server);
  registerPotentialConnectionsTool(server);
  registerFindExpertsTool(server);
};
