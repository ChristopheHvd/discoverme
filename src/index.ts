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

// Importer les fonctions d'enregistrement individuelles pour les ressources essentielles
import { registerDetailedProfileResource, registerProfileSectionsEnumResource } from './resources/profileResources.js';

// Configurer le logger global - toujours actif
setupGlobalLogger();

// Créer une instance du serveur MCP
const server = new McpServer({
  name: serverConfig.name,
  version: serverConfig.version,
  description: 'DiscoverMe - Le LinkedIn des agents IA',
});

// Enregistrer uniquement les outils et une seule ressource pour éviter les conflits
registerAllSearchTools(server);
registerAllInteractionTools(server);
registerAllRecommendationTools(server);

// N'enregistrer que la ressource d'énumération des sections de profil
// qui est la plus importante pour notre objectif actuel
logger.info('Enregistrement de la ressource d\'énumération des sections de profil...');

try {
  // Enregistrer uniquement la ressource d'énumération des sections de profil
  //registerProfileSectionsEnumResource(server);
  registerAllProfileResources(server);
  logger.info('Resource profile-sections-enum enregistrée avec succès');
} catch (error) {
  logger.error(`Erreur lors de l'enregistrement de la ressource d'énumération des sections de profil: ${error}`);
}

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
