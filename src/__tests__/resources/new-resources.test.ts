/**
 * Tests pour les nouvelles ressources de DiscoverMe - Le LinkedIn des agents IA
 */
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { registerAllProfileResources } from '../../resources/profileResources.js';
import { registerAllNetworkResources } from '../../resources/networkResources.js';

// Type pour les handlers de ressources
type ResourceHandler = (...args: any[]) => Promise<any>;

describe('DiscoverMe New Resources', () => {
  let server: McpServer;
  let mockResourceHandler: jest.Mock;

  beforeEach(() => {
    // Cruéer un mock du serveur MCP
    mockResourceHandler = jest.fn();
    server = {
      resource: mockResourceHandler,
      tool: jest.fn()
    } as unknown as McpServer;
  });

  describe('Profile Resources', () => {
    it('should register all profile resources correctly', () => {
      // Enregistrer les ressources de profil
      registerAllProfileResources(server);
      
      // Vuérifier que 5 ressources de profil ont uétué enregistruées
      expect(mockResourceHandler).toHaveBeenCalledTimes(5);
      
      // Vuérifier les noms des ressources enregistruées
      const resourceNames = mockResourceHandler.mock.calls.map(call => call[0]);
      expect(resourceNames).toContain('detailed-profile');
      expect(resourceNames).toContain('user-skills');
      expect(resourceNames).toContain('user-experience');
      expect(resourceNames).toContain('user-education');
      expect(resourceNames).toContain('profile-section');
    });

    it('should define correct URIs for profile resources', () => {
      // Enregistrer les ressources de profil
      registerAllProfileResources(server);
      
      // Vuérifier les URIs des ressources
      const detailedProfileURI = mockResourceHandler.mock.calls.find(call => call[0] === 'detailed-profile')?.[1];
      const userSkillsURI = mockResourceHandler.mock.calls.find(call => call[0] === 'user-skills')?.[1];
      const userExperienceURI = mockResourceHandler.mock.calls.find(call => call[0] === 'user-experience')?.[1];
      const userEducationURI = mockResourceHandler.mock.calls.find(call => call[0] === 'user-education')?.[1];
      
      // Vuérifier les URIs
      expect(detailedProfileURI).toBe('profile://user/{userId}');
      expect(userSkillsURI).toBe('skills://user/{userId}');
      expect(userExperienceURI).toBe('experience://user/{userId}');
      expect(userEducationURI).toBe('education://user/{userId}');
    });
  });

  describe('Network Resources', () => {
    it('should register all network resources correctly', () => {
      // Enregistrer les ressources de ruéseau
      registerAllNetworkResources(server);
      
      // Vuérifier que 3 ressources de ruéseau ont uétué enregistruées
      expect(mockResourceHandler).toHaveBeenCalledTimes(3);
      
      // Vuérifier les noms des ressources enregistruées
      const resourceNames = mockResourceHandler.mock.calls.map(call => call[0]);
      expect(resourceNames).toContain('network');
      expect(resourceNames).toContain('connections');
      expect(resourceNames).toContain('recommendations');
    });

    it('should define correct URIs for network resources', () => {
      // Enregistrer les ressources de ruéseau
      registerAllNetworkResources(server);
      
      // Vuérifier les URIs des ressources
      const networkURI = mockResourceHandler.mock.calls.find(call => call[0] === 'network')?.[1];
      const connectionsURI = mockResourceHandler.mock.calls.find(call => call[0] === 'connections')?.[1];
      const recommendationsURI = mockResourceHandler.mock.calls.find(call => call[0] === 'recommendations')?.[1];
      
      // Vuérifier les URIs
      expect(networkURI).toBe('network://user/{userId}');
      expect(connectionsURI).toBe('connections://user/{userId}');
      expect(recommendationsURI).toBe('recommendations://user/{userId}');
    });
  });
});
