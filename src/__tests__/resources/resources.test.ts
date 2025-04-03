import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// Utiliser le mock au lieu du service réel pour les tests
import { profileServiceMongo } from '../mocks/profileServiceMongo.mock.js';

// Type pour les handlers de ressources
type ResourceHandler = (...args: any[]) => Promise<any>;
import {
  registerProfileResource,
  registerSkillsResource,
  registerExperienceResource,
  registerEducationResource,
  registerProfileDetailsResource
} from '../../resources.js';

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
      getProfileSection: jest.fn((section) => mockProfile[section as keyof typeof mockProfile])
    }
  };
});

describe('MCP Resources', () => {
  let server: McpServer;
  let mockResourceHandler: jest.Mock;

  beforeEach(() => {
    // Cru00e9er un mock du serveur MCP
    mockResourceHandler = jest.fn();
    server = {
      resource: mockResourceHandler
    } as unknown as McpServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerProfileResource', () => {
    it('should register a profile resource with the server', () => {
      registerProfileResource(server);
      
      // Vu00e9rifier que la mu00e9thode resource a u00e9tu00e9 appelu00e9e avec les bons arguments
      expect(mockResourceHandler).toHaveBeenCalledTimes(1);
      expect(mockResourceHandler.mock.calls[0][0]).toBe('profile');
      expect(mockResourceHandler.mock.calls[0][1]).toBe('profile://user');
      
      // Vu00e9rifier que le gestionnaire de ressource est une fonction
      const handler = mockResourceHandler.mock.calls[0][2];
      expect(typeof handler).toBe('function');
    });

    it('should return profile data from the service', async () => {
      registerProfileResource(server);
      
      // Ru00e9cupu00e9rer le gestionnaire de ressource
      const handler = mockResourceHandler.mock.calls[0][2] as ResourceHandler;
      
      // Appeler le gestionnaire avec un URI fictif
      const result = await handler({ href: 'profile://user' });
      
      // Vu00e9rifier le format de la ru00e9ponse
      expect(result).toHaveProperty('contents');
      expect(Array.isArray(result.contents)).toBe(true);
      expect(result.contents[0]).toHaveProperty('uri', 'profile://user');
      expect(result.contents[0]).toHaveProperty('text');
      
      // Vu00e9rifier que le contenu est du JSON valide contenant les donnu00e9es du profil
      const content = JSON.parse(result.contents[0].text);
      expect(content).toHaveProperty('name', 'John Doe');
      expect(content).toHaveProperty('skills');
      expect(Array.isArray(content.skills)).toBe(true);
    });
  });

  describe('registerSkillsResource', () => {
    it('should register a skills resource with the server', () => {
      registerSkillsResource(server);
      
      expect(mockResourceHandler).toHaveBeenCalledTimes(1);
      expect(mockResourceHandler.mock.calls[0][0]).toBe('skills');
      expect(mockResourceHandler.mock.calls[0][1]).toBe('skills://user');
    });

    it('should return skills data from the service', async () => {
      registerSkillsResource(server);
      
      const handler = mockResourceHandler.mock.calls[0][2] as ResourceHandler;
      const result = await handler({ href: 'skills://user' });
      
      expect(result).toHaveProperty('contents');
      expect(result.contents[0]).toHaveProperty('uri', 'skills://user');
      
      const content = JSON.parse(result.contents[0].text);
      expect(Array.isArray(content)).toBe(true);
      expect(content).toContain('JavaScript');
      expect(content).toContain('TypeScript');
      expect(content).toContain('React');
    });
  });

  describe('registerProfileDetailsResource', () => {
    it('should register a parameterized resource with the server', () => {
      registerProfileDetailsResource(server);
      
      expect(mockResourceHandler).toHaveBeenCalledTimes(1);
      expect(mockResourceHandler.mock.calls[0][0]).toBe('profile-details');
      // Le deuxiu00e8me argument est un objet ResourceTemplate, donc nous ne pouvons pas faire une comparaison directe
    });

    it('should return the requested section when it exists', async () => {
      registerProfileDetailsResource(server);
      
      const handler = mockResourceHandler.mock.calls[0][2] as ResourceHandler;
      // Simuler un appel avec une section valide
      const result = await handler({ href: 'profile://user/skills' }, { section: 'skills' });
      
      expect(result).toHaveProperty('contents');
      expect(result.contents[0]).toHaveProperty('uri', 'profile://user/skills');
      
      const content = JSON.parse(result.contents[0].text);
      expect(Array.isArray(content)).toBe(true);
      expect(content).toContain('JavaScript');
    });

    it('should return an error message for non-existent sections', async () => {
      registerProfileDetailsResource(server);
      
      const handler = mockResourceHandler.mock.calls[0][2] as ResourceHandler;
      // Simuler un appel avec une section invalide
      const result = await handler({ href: 'profile://user/invalid' }, { section: 'invalid' });
      
      expect(result).toHaveProperty('contents');
      expect(result.contents[0]).toHaveProperty('uri', 'profile://user/invalid');
      expect(result.contents[0].text).toContain('non trouv');
    });
  });
});
