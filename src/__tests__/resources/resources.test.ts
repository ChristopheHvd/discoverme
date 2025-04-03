import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// Utiliser le mock au lieu du service ru00e9el pour les tests
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
jest.mock('../../services/dataService.ts', () => {
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
      
      expect(mockResourceHandler).toHaveBeenCalledTimes(1);
      expect(mockResourceHandler.mock.calls[0][0]).toBe('profile');
      expect(typeof mockResourceHandler.mock.calls[0][1]).toBe('function');
    });

    it('should return profile data from the service', async () => {
      // Augmenter le timeout pour ce test
      jest.setTimeout(15000);
      
      // S'assurer que le mock retourne une valeur immu00e9diatement
      const mockProfileData = {
        name: 'John Doe',
        title: 'Du00e9veloppeur Full Stack',
        skills: ['JavaScript', 'TypeScript', 'React'],
        experience: [],
        education: [],
        contact: { email: 'john.doe@example.com', linkedin: 'linkedin.com/in/johndoe' }
      };
      jest.spyOn(profileServiceMongo, 'getProfile').mockImplementationOnce(() => Promise.resolve(mockProfileData));
      
      registerProfileResource(server);
      
      const handler = mockResourceHandler.mock.calls[0][1] as ResourceHandler;
      const result = await handler();
      
      expect(result).toHaveProperty('name', 'John Doe');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('skills');
      expect(Array.isArray(result.skills)).toBe(true);
    }, 15000);
  });

  describe('registerSkillsResource', () => {
    it('should register a skills resource with the server', () => {
      registerSkillsResource(server);
      
      expect(mockResourceHandler).toHaveBeenCalledTimes(1);
      expect(mockResourceHandler.mock.calls[0][0]).toBe('skills');
      expect(typeof mockResourceHandler.mock.calls[0][1]).toBe('function');
    });

    it('should return skills data from the service', async () => {
      // Augmenter le timeout pour ce test
      jest.setTimeout(15000);
      
      // S'assurer que le mock retourne une valeur immu00e9diatement
      const mockSkills = ['JavaScript', 'TypeScript', 'React'];
      jest.spyOn(profileServiceMongo, 'getProfileSection').mockImplementationOnce(() => Promise.resolve(mockSkills));
      
      registerSkillsResource(server);
      
      const handler = mockResourceHandler.mock.calls[0][1] as ResourceHandler;
      const result = await handler();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('JavaScript');
      expect(result).toContain('TypeScript');
      expect(result).toContain('React');
    }, 15000);
  });

  // Tests similaires pour les autres ressources
});
