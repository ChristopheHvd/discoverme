/**
 * Tests pour les nouveaux outils de DiscoverMe - Le LinkedIn des agents IA
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { registerAllSearchTools } from '../../tools/searchTools.js';
import { registerAllInteractionTools } from '../../tools/interactionTools.js';

// Type pour les handlers d'outils
type ToolHandler = (...args: any[]) => Promise<any>;

describe('DiscoverMe New Tools', () => {
  let server: McpServer;
  let mockToolHandler: jest.Mock;

  beforeEach(() => {
    // Cruéer un mock du serveur MCP
    mockToolHandler = jest.fn();
    server = {
      tool: mockToolHandler,
      resource: jest.fn()
    } as unknown as McpServer;
  });

  describe('Search Tools', () => {
    it('should register all search tools correctly', () => {
      // Enregistrer les outils de recherche
      registerAllSearchTools(server);
      
      // Vuérifier que 3 outils de recherche ont uétué enregistrués
      expect(mockToolHandler).toHaveBeenCalledTimes(3);
      
      // Vuérifier les noms des outils enregistrués
      const toolNames = mockToolHandler.mock.calls.map(call => call[0]);
      expect(toolNames).toContain('search-by-name');
      expect(toolNames).toContain('search-by-skills');
      expect(toolNames).toContain('advanced-search');
    });

    it('should define correct schemas for search tools', () => {
      // Enregistrer les outils de recherche
      registerAllSearchTools(server);
      
      // Vuérifier les schuémas des outils
      const searchByNameSchema = mockToolHandler.mock.calls.find(call => call[0] === 'search-by-name')?.[1];
      const searchBySkillsSchema = mockToolHandler.mock.calls.find(call => call[0] === 'search-by-skills')?.[1];
      const advancedSearchSchema = mockToolHandler.mock.calls.find(call => call[0] === 'advanced-search')?.[1];
      
      // Vuérifier le schuéma de search-by-name
      expect(searchByNameSchema).toHaveProperty('query');
      expect(searchByNameSchema).toHaveProperty('limit');
      
      // Vuérifier le schuéma de search-by-skills
      expect(searchBySkillsSchema).toHaveProperty('skills');
      expect(searchBySkillsSchema).toHaveProperty('matchAll');
      expect(searchBySkillsSchema).toHaveProperty('limit');
      
      // Vuérifier le schuéma de advanced-search
      expect(advancedSearchSchema).toHaveProperty('keywords');
      expect(advancedSearchSchema).toHaveProperty('company');
      expect(advancedSearchSchema).toHaveProperty('position');
      expect(advancedSearchSchema).toHaveProperty('location');
      expect(advancedSearchSchema).toHaveProperty('experience');
      expect(advancedSearchSchema).toHaveProperty('limit');
    });
  });

  describe('Interaction Tools', () => {
    it('should register all interaction tools correctly', () => {
      // Enregistrer les outils d'interaction
      registerAllInteractionTools(server);
      
      // Vuérifier que 3 outils d'interaction ont uétué enregistrués
      expect(mockToolHandler).toHaveBeenCalledTimes(3);
      
      // Vuérifier les noms des outils enregistrués
      const toolNames = mockToolHandler.mock.calls.map(call => call[0]);
      expect(toolNames).toContain('request-introduction');
      expect(toolNames).toContain('recommend-profile');
      expect(toolNames).toContain('send-message');
    });

    it('should define correct schemas for interaction tools', () => {
      // Enregistrer les outils d'interaction
      registerAllInteractionTools(server);
      
      // Vuérifier les schuémas des outils
      const requestIntroSchema = mockToolHandler.mock.calls.find(call => call[0] === 'request-introduction')?.[1];
      const recommendProfileSchema = mockToolHandler.mock.calls.find(call => call[0] === 'recommend-profile')?.[1];
      const sendMessageSchema = mockToolHandler.mock.calls.find(call => call[0] === 'send-message')?.[1];
      
      // Vuérifier le schuéma de request-introduction
      expect(requestIntroSchema).toHaveProperty('userId');
      expect(requestIntroSchema).toHaveProperty('agentId');
      expect(requestIntroSchema).toHaveProperty('reason');
      expect(requestIntroSchema).toHaveProperty('message');
      
      // Vuérifier le schuéma de recommend-profile
      expect(recommendProfileSchema).toHaveProperty('userId');
      expect(recommendProfileSchema).toHaveProperty('recommenderId');
      expect(recommendProfileSchema).toHaveProperty('skills');
      expect(recommendProfileSchema).toHaveProperty('message');
      
      // Vuérifier le schuéma de send-message
      expect(sendMessageSchema).toHaveProperty('userId');
      expect(sendMessageSchema).toHaveProperty('senderId');
      expect(sendMessageSchema).toHaveProperty('content');
    });
  });
});
