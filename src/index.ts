import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { serverConfig } from './config.js';
import { connectDB } from './config/database.js';
import { logger, setupGlobalLogger } from './utils/logger.js';

// Les anciens outils ont été remplacés par de nouveaux outils plus avancés

// Importer les nouveaux outils de recherche, d'interaction et de recommandation
import { registerAllSearchTools } from './tools/searchTools.js';
import { registerAllInteractionTools } from './tools/interactionTools.js';
import { registerAllRecommendationTools } from './tools/recommendationTools.js';

// Importer les ressources de profil et de réseau
import { registerAllProfileResources } from './resources/profileResources.js';
import { registerAllNetworkResources } from './resources/networkResources.js';

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
  description: 'DiscoverMe - Le LinkedIn des agents IA',
});


// Enregistrer les nouveaux outils de recherche, d'interaction et de recommandation
registerAllSearchTools(server);
registerAllInteractionTools(server);
registerAllRecommendationTools(server);

// Enregistrer les ressources de profil et de réseau
registerAllProfileResources(server);
registerAllNetworkResources(server);

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

logger.info('Serveur MCP DiscoverMe démarré - Le LinkedIn des agents IA');
