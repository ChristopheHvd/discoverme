import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// Utiliser le mock au lieu du service ru00e9el pour les tests
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
// Utiliser un chemin absolu pour u00e9viter les problèmes de ru00e9solution de chemin
jest.mock('/Users/christophehavard/Code/discoverme-clean/discoverme/src/services/dataService', () => {
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

// Interface pour le profil mocku00e9
interface MockProfile {
  name: string;
  title: string;
  skills: string[];
  experience: any[];
  education: any[];
  contact: { email: string; linkedin: string };
}

// Interface pour la ru00e9ponse de disponibilitu00e9
interface AvailabilityResponse {
  available: boolean;
  message: string;
}

// Interface pour la ru00e9ponse de contact
interface ContactResponse {
  success: boolean;
  message: string;
}

describe('MCP Tools', () => {
  let server: McpServer;
  let mockToolHandler: jest.Mock;

  beforeEach(() => {
    // Cru00e9er un mock du serveur MCP
    mockToolHandler = jest.fn();
    server = {
      registerTool: mockToolHandler,
      registerResource: jest.fn()
    } as unknown as McpServer;
  });

  describe('registerGetProfileTool', () => {
    it('should register a get-profile tool with the server', () => {
      registerGetProfileTool(server);
      
      expect(mockToolHandler).toHaveBeenCalledTimes(1);
      expect(mockToolHandler.mock.calls[0][0]).toBe('get-profile');
      expect(mockToolHandler.mock.calls[0][1]).toEqual({});
      expect(typeof mockToolHandler.mock.calls[0][2]).toBe('function');
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
      
      // Utiliser jest.spyOn pour u00e9viter les problèmes de typage
      jest.spyOn(profileServiceMongo, 'getProfile').mockImplementationOnce(() => Promise.resolve(mockProfileData));
      
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
    }, 15000);
  });

  describe('registerGetSkillsTool', () => {
    it('should register a get-skills tool with the server', () => {
      registerGetSkillsTool(server);
      
      expect(mockToolHandler).toHaveBeenCalledTimes(1);
      expect(mockToolHandler.mock.calls[0][0]).toBe('get-skills');
      expect(mockToolHandler.mock.calls[0][1]).toEqual({});
    });

    it('should return skills data from the service', async () => {
      // Augmenter le timeout pour ce test
      jest.setTimeout(15000);
      
      // S'assurer que le mock retourne une valeur immu00e9diatement
      const mockSkills = ['JavaScript', 'TypeScript', 'React'];
      jest.spyOn(profileServiceMongo, 'getProfileSection').mockImplementationOnce(() => Promise.resolve(mockSkills));
      
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
    }, 15000);
  });

  describe('registerCheckAvailabilityTool', () => {
    it('should register a check-availability tool with the server', () => {
      registerCheckAvailabilityTool(server);
      
      expect(mockToolHandler).toHaveBeenCalledTimes(1);
      expect(mockToolHandler.mock.calls[0][0]).toBe('check-availability');
      // Vu00e9rifier que le schu00e9ma de validation est pru00e9sent
      expect(mockToolHandler.mock.calls[0][1]).toHaveProperty('date');
      expect(mockToolHandler.mock.calls[0][1]).toHaveProperty('time');
    });

    it('should call the service with the provided date and time', async () => {
      // Augmenter le timeout pour ce test
      jest.setTimeout(15000);
      
      // S'assurer que le mock retourne une valeur immu00e9diatement
      const mockAvailability = {
        available: true,
        message: 'John Doe est disponible le 2025-04-03 u00e0 14:00.'
      };
      jest.spyOn(profileServiceMongo, 'checkAvailability').mockImplementationOnce(() => Promise.resolve(mockAvailability));
      
      registerCheckAvailabilityTool(server);
      
      const handler = mockToolHandler.mock.calls[0][2] as ToolHandler;
      const result = await handler({ date: '2025-04-03', time: '14:00' });
      
      expect(result).toHaveProperty('content');
      expect(result.content[0]).toHaveProperty('type', 'text');
      
      const content = JSON.parse(result.content[0].text);
      expect(content).toHaveProperty('available', true);
      expect(content).toHaveProperty('message');
      expect(content.message).toContain('est disponible');
    }, 15000);
  });

  describe('registerRequestContactTool', () => {
    it('should register a request-contact tool with the server', () => {
      registerRequestContactTool(server);
      
      expect(mockToolHandler).toHaveBeenCalledTimes(1);
      expect(mockToolHandler.mock.calls[0][0]).toBe('request-contact');
      // Vu00e9rifier que le schu00e9ma de validation est pru00e9sent
      expect(mockToolHandler.mock.calls[0][1]).toHaveProperty('reason');
      expect(mockToolHandler.mock.calls[0][1]).toHaveProperty('contactMethod');
    });

    it('should call the service with the provided reason and contact method', async () => {
      // Augmenter le timeout pour ce test
      jest.setTimeout(15000);
      
      // S'assurer que le mock retourne une valeur immu00e9diatement
      const mockContactResponse = {
        success: true,
        message: 'Votre demande de contact avec John Doe par email a u00e9tu00e9 enregistru00e9e. Raison: Test'
      };
      jest.spyOn(profileServiceMongo, 'requestContact').mockImplementationOnce(() => Promise.resolve(mockContactResponse));
      
      registerRequestContactTool(server);
      
      const handler = mockToolHandler.mock.calls[0][2] as ToolHandler;
      const result = await handler({ reason: 'Test', contactMethod: 'email' });
      
      expect(result).toHaveProperty('content');
      expect(result.content[0]).toHaveProperty('type', 'text');
      
      const content = JSON.parse(result.content[0].text);
      expect(content).toHaveProperty('success', true);
      expect(content).toHaveProperty('message');
      expect(content.message).toContain('a u00e9tu00e9 enregistru00e9e');
    }, 15000);
  });
});
