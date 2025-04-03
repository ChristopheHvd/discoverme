import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAllResources } from '../../resources.js';
import {
  registerGetProfileTool,
  registerGetSkillsTool,
  registerCheckAvailabilityTool,
  registerRequestContactTool
} from '../../tools.js';

// Avec les modules ES, il faut importer jest explicitement
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Ce test vu00e9rifie que le serveur MCP peut u00eatre correctement configuru00e9 avec toutes les ressources et outils
describe('MCP Server Integration', () => {
  let server: McpServer;

  beforeEach(() => {
    // Cru00e9er une vraie instance du serveur MCP pour les tests d'intu00e9gration
    server = new McpServer({
      name: 'DiscoverMe-Test',
      version: '1.0.0',
      description: 'Serveur de test pour DiscoverMe'
    });
  });

  it('should successfully register all tools and resources', () => {
    // Espionner les mu00e9thodes du serveur pour vu00e9rifier qu'elles sont appelu00e9es
    const resourceSpy = jest.spyOn(server, 'resource');
    const toolSpy = jest.spyOn(server, 'tool');

    // Enregistrer les outils
    registerGetProfileTool(server);
    registerGetSkillsTool(server);
    registerCheckAvailabilityTool(server);
    registerRequestContactTool(server);

    // Enregistrer les ressources
    registerAllResources(server);

    // Vu00e9rifier que les mu00e9thodes ont u00e9tu00e9 appelu00e9es le bon nombre de fois
    // 5 ressources: profile, skills, experience, education, profile-details
    expect(resourceSpy).toHaveBeenCalledTimes(5);
    
    // 5 outils: ping (dans index.ts), get-profile, get-skills, check-availability, request-contact
    // Note: Comme nous n'incluons pas index.ts dans ce test, nous ne comptons que 4 outils
    expect(toolSpy).toHaveBeenCalledTimes(4);

    // Nettoyer les espions
    resourceSpy.mockRestore();
    toolSpy.mockRestore();
  });

  // Note: Les propriu00e9tu00e9s name, version et description ne sont pas accessibles directement
  // car elles sont privates dans la classe McpServer
  it('should create a server instance successfully', () => {
    // Si la cru00e9ation du serveur ne lance pas d'erreur, le test passe
    expect(server).toBeDefined();
    expect(typeof server.resource).toBe('function');
    expect(typeof server.tool).toBe('function');
  });

  // Dans un environnement de production, nous pourrions ajouter des tests plus complets
  // qui simulent des requu00eates et des ru00e9ponses ru00e9elles avec un client MCP
});
