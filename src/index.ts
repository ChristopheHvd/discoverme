import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerGetProfileTool, registerGetSkillsTool, registerCheckAvailabilityTool, registerRequestContactTool } from './tools.js';
import { registerAllResources } from './resources.js';
import { serverConfig } from './config.js';
import { profileServiceMongo } from './services/profileServiceMongo.js';
import { connectDB } from './config/database.js';

// Créer une instance du serveur MCP
const server = new McpServer({
  name: serverConfig.name,
  version: serverConfig.version,
  description: serverConfig.description,
});

// Définir un outil simple pour tester que le serveur fonctionne
server.tool(
  'ping',
  {},
  async () => ({
    content: [{ type: 'text', text: 'pong' }]
  })
);

// Enregistrer les outils sur le serveur
registerGetProfileTool(server);
registerGetSkillsTool(server);
registerCheckAvailabilityTool(server);
registerRequestContactTool(server);

// Enregistrer les ressources sur le serveur
registerAllResources(server);

// Initialiser la connexion MongoDB
try {
  await connectDB();
  console.error('Connexion MongoDB établie avec succès');
  
  // Initialiser le service de profil MongoDB (création de l'utilisateur par défaut si nécessaire)
  await profileServiceMongo.initialize();
  console.error('Service de profil MongoDB initialisé');
} catch (error) {
  console.error('Erreur lors de l\'initialisation de MongoDB:', error);
}

// Démarrer le serveur avec le transport stdio
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('Serveur MCP DiscoverMe démarré');
