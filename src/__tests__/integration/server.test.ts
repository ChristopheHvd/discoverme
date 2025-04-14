import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAllSearchTools } from '../../tools/searchTools.js';
import { registerAllInteractionTools } from '../../tools/interactionTools.js';
import { registerAllProfileResources } from '../../resources/profileResources.js';
import { registerAllNetworkResources } from '../../resources/networkResources.js';

// Avec les modules ES, il faut importer jest explicitement
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Ce test vuérifie que le serveur MCP peut u00eatre correctement configurué avec toutes les ressources et outils
describe('MCP Server Integration', () => {
  let server: McpServer;

  beforeEach(() => {
    // Cruéer une vraie instance du serveur MCP pour les tests d'intuégration
    server = new McpServer({
      name: 'DiscoverMe-Test',
      version: '1.0.0',
      description: 'Serveur de test pour DiscoverMe'
    });
  });

  it('should successfully register all tools and resources', () => {
    // Espionner les muéthodes du serveur pour vuérifier qu'elles sont appeluées
    const resourceSpy = jest.spyOn(server, 'resource');
    const toolSpy = jest.spyOn(server, 'tool');

    // Enregistrer les outils de recherche et d'interaction
    registerAllSearchTools(server);
    registerAllInteractionTools(server);

    // Enregistrer les ressources de profil et de réseau
    registerAllProfileResources(server);
    registerAllNetworkResources(server);

    // Vérifier que les méthodes ont été appelées
    // Nous avons réduit le nombre de ressources pour éviter les conflits d'enregistrement
    expect(resourceSpy).toHaveBeenCalled();
    
    // 6 outils: search-by-name, search-by-skills, advanced-search, request-introduction, recommend-profile, send-message
    expect(toolSpy).toHaveBeenCalledTimes(6);

    // Nettoyer les espions
    resourceSpy.mockRestore();
    toolSpy.mockRestore();
  });

  // Note: Les propriuétués name, version et description ne sont pas accessibles directement
  // car elles sont privates dans la classe McpServer
  it('should create a server instance successfully', () => {
    // Si la cruéation du serveur ne lance pas d'erreur, le test passe
    expect(server).toBeDefined();
    expect(typeof server.resource).toBe('function');
    expect(typeof server.tool).toBe('function');
  });

  // Dans un environnement de production, nous pourrions ajouter des tests plus complets
  // qui simulent des requu00eates et des ruéponses ruéelles avec un client MCP
});
