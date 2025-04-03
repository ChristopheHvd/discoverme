import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// Utiliser le mock au lieu du service réel pour les tests
import { profileServiceMongo } from '../mocks/profileServiceMongo.mock.js';

// Type pour les handlers d'outils
type ToolHandler = (...args: any[]) => Promise<any>;
import {
  registerGetProfileTool,
  registerGetSkillsTool,
  registerCheckAvailabilityTool,
  registerRequestContactTool
} from '../../tools.js';

// Avec les modules ES, il faut importer jest explicitement
import { jest } from '@jest/globals';

// Mock du service de profil
jest.mock('../../services/dataService.js', () => {
  const mockProfile = {
    name: 'Test User',
    title: 'Test Developer',
    skills: ['Test', 'Mock', 'Jest'],
    experience: [{ company: 'Test Company', role: 'Tester', period: '2020-2023', description: 'Testing' }],
    education: [{ institution: 'Test University', degree: 'Test Degree', year: '2019' }],
    contact: { email: 'test@example.com', linkedin: 'linkedin.com/test' }
  };

  return {
    profileService: {
      getProfile: jest.fn().mockReturnValue(mockProfile),
      getProfileSection: jest.fn((section) => mockProfile[section as keyof typeof mockProfile]),
      checkAvailability: jest.fn().mockReturnValue({
        available: true,
        message: 'Test User est disponible le 2025-04-03 u00e0 14:00.'
      }),
      requestContact: jest.fn().mockReturnValue({
        success: true,
        message: 'Votre demande de contact avec Test User par email a u00e9tu00e9 enregistru00e9e. Raison: Test'
      })
    }
  };
});

describe('MCP Tools', () => {
  let server: McpServer;
  let mockToolHandler: jest.Mock;

  beforeEach(() => {
    // Cru00e9er un mock du serveur MCP
    mockToolHandler = jest.fn();
    server = {
      tool: mockToolHandler
    } as unknown as McpServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerGetProfileTool', () => {
    it('should register a get-profile tool with the server', () => {
      registerGetProfileTool(server);
      
      // Vu00e9rifier que la mu00e9thode tool a u00e9tu00e9 appelu00e9e avec les bons arguments
      expect(mockToolHandler).toHaveBeenCalledTimes(1);
      expect(mockToolHandler.mock.calls[0][0]).toBe('get-profile');
      expect(mockToolHandler.mock.calls[0][1]).toEqual({});
      
      // Vu00e9rifier que le gestionnaire d'outil est une fonction
      const handler = mockToolHandler.mock.calls[0][2];
      expect(typeof handler).toBe('function');
    });

    it('should return profile data from the service', async () => {
      registerGetProfileTool(server);
      
      // Ru00e9cupu00e9rer le gestionnaire d'outil
      const handler = mockToolHandler.mock.calls[0][2] as ToolHandler;
      
      // Appeler le gestionnaire
      const result = await handler({});
      
      // Vu00e9rifier le format de la ru00e9ponse
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');
      
      // Vu00e9rifier que le contenu est du JSON valide contenant les donnu00e9es du profil
      const content = JSON.parse(result.content[0].text);
      expect(content).toHaveProperty('name', 'John Doe');
      expect(content).toHaveProperty('skills');
      expect(Array.isArray(content.skills)).toBe(true);
    });
  });

  describe('registerGetSkillsTool', () => {
    it('should register a get-skills tool with the server', () => {
      registerGetSkillsTool(server);
      
      expect(mockToolHandler).toHaveBeenCalledTimes(1);
      expect(mockToolHandler.mock.calls[0][0]).toBe('get-skills');
      expect(mockToolHandler.mock.calls[0][1]).toEqual({});
    });

    it('should return skills data from the service', async () => {
      registerGetSkillsTool(server);
      
      const handler = mockToolHandler.mock.calls[0][2] as ToolHandler;
      const result = await handler({});
      
      expect(result).toHaveProperty('content');
      expect(result.content[0]).toHaveProperty('type', 'text');
      
      const content = JSON.parse(result.content[0].text);
      expect(Array.isArray(content)).toBe(true);
      expect(content).toContain('JavaScript');
      expect(content).toContain('TypeScript');
      expect(content).toContain('React');
    });
  });

  describe('registerCheckAvailabilityTool', () => {
    it('should register a check-availability tool with the server', () => {
      registerCheckAvailabilityTool(server);
      
      expect(mockToolHandler).toHaveBeenCalledTimes(1);
      expect(mockToolHandler.mock.calls[0][0]).toBe('check-availability');
      // Vu00e9rifier que le schéma de validation est présent
      expect(mockToolHandler.mock.calls[0][1]).toHaveProperty('date');
      expect(mockToolHandler.mock.calls[0][1]).toHaveProperty('time');
    });

    it('should call the service with the provided date and time', async () => {
      registerCheckAvailabilityTool(server);
      
      const handler = mockToolHandler.mock.calls[0][2] as ToolHandler;
      const result = await handler({ date: '2025-04-03', time: '14:00' });
      
      expect(result).toHaveProperty('content');
      expect(result.content[0]).toHaveProperty('type', 'text');
      
      const content = JSON.parse(result.content[0].text);
      expect(content).toHaveProperty('available', true);
      expect(content).toHaveProperty('message');
      expect(content.message).toContain('est disponible');
    });
  });

  describe('registerRequestContactTool', () => {
    it('should register a request-contact tool with the server', () => {
      registerRequestContactTool(server);
      
      expect(mockToolHandler).toHaveBeenCalledTimes(1);
      expect(mockToolHandler.mock.calls[0][0]).toBe('request-contact');
      // Vu00e9rifier que le schéma de validation est présent
      expect(mockToolHandler.mock.calls[0][1]).toHaveProperty('reason');
      expect(mockToolHandler.mock.calls[0][1]).toHaveProperty('contactMethod');
    });

    it('should call the service with the provided reason and contact method', async () => {
      registerRequestContactTool(server);
      
      const handler = mockToolHandler.mock.calls[0][2] as ToolHandler;
      const result = await handler({ reason: 'Test', contactMethod: 'email' });
      
      expect(result).toHaveProperty('content');
      expect(result.content[0]).toHaveProperty('type', 'text');
      
      const content = JSON.parse(result.content[0].text);
      expect(content).toHaveProperty('success', true);
      expect(content).toHaveProperty('message');
      expect(content.message).toContain('a u00e9tu00e9 enregistru00e9e');
    });
  });
});
