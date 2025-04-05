import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerGetProfileTool, registerGetSkillsTool, registerCheckAvailabilityTool, registerRequestContactTool } from './tools.js';
import { registerAllResources } from './resources.js';
import { serverConfig } from './config.js';
import { profileServiceMongo } from './services/profileServiceMongo.js';
import { connectDB } from './config/database.js';
import { logger, setupGlobalLogger } from './utils/logger.js';

// Configurer le logger global - toujours actif
setupGlobalLogger();

// Détecter si nous sommes en mode MCP (via l'inspecteur)
if (process.argv.includes('--mcp-mode')) {
  process.env.MCP_MODE = 'true';
  logger.info('Démarrage en mode MCP - logs console désactivés, logs fichier actifs');
} else {
  logger.info('Démarrage normal - logs console et fichier actifs');
}

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
  logger.info('Connexion MongoDB établie avec succès');
} catch (error) {
  logger.error('Erreur lors de l\'initialisation de MongoDB:', error);
}

// Démarrer le serveur avec le transport stdio
const transport = new StdioServerTransport();
await server.connect(transport);

logger.info('Serveur MCP DiscoverMe démarré');
