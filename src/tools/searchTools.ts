/**
 * Outils de recherche pour DiscoverMe
 * 
 * Ces outils permettent aux agents IA de rechercher des profils professionnels
 * de différentes manières.
 */

import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { searchService } from '../services/searchService.js';

/**
 * Outil de recherche par nom
 */
export const registerSearchByNameTool = (server: McpServer) => {
  server.tool(
    'search-by-name',
    {
      query: z.string().describe('Nom ou partie du nom à rechercher'),
      limit: z.number().optional().describe('Nombre maximum de résultats')
    },
    async ({ query, limit = 10 }) => {
      const results = await searchService.searchByName({ query, limit });
      
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
      };
    }
  );
};

/**
 * Outil de recherche par compétences
 */
export const registerSearchBySkillsTool = (server: McpServer) => {
  server.tool(
    'search-by-skills',
    {
      skills: z.array(z.string()).describe('Liste des compétences recherchées'),
      matchAll: z.boolean().optional().describe('Doit correspondre à toutes les compétences'),
      limit: z.number().optional().describe('Nombre maximum de résultats')
    },
    async ({ skills, matchAll = false, limit = 10 }) => {
      const results = await searchService.searchBySkills({ skills, matchAll, limit });
      
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
      };
    }
  );
};

/**
 * Outil de recherche avancée (multi-critères)
 */
export const registerAdvancedSearchTool = (server: McpServer) => {
  server.tool(
    'advanced-search',
    {
      keywords: z.string().optional().describe('Mots-clés généraux'),
      company: z.string().optional().describe('Entreprise actuelle ou passée'),
      position: z.string().optional().describe('Poste occupé'),
      location: z.string().optional().describe('Localisation'),
      experience: z.number().optional().describe('Années d\'expérience minimum'),
      limit: z.number().optional().describe('Nombre maximum de résultats')
    },
    async (params) => {
      const results = await searchService.advancedSearch(params);
      
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
      };
    }
  );
};

/**
 * Fonction pour enregistrer tous les outils de recherche
 */
export const registerAllSearchTools = (server: McpServer) => {
  registerSearchByNameTool(server);
  registerSearchBySkillsTool(server);
  registerAdvancedSearchTool(server);
};
