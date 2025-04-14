/**
 * Ressources de réseau pour DiscoverMe
 * 
 * Ces ressources permettent aux agents IA d'accéder aux informations
 * de réseau des utilisateurs (connexions, recommandations, etc.).
 */

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { logger } from '../utils/logger.js';
import { networkService } from '../services/networkService.js';

// Définition des modèles d'URI pour éviter les erreurs d'URL
const NETWORK_URI = new ResourceTemplate('network://user/{userId}', { userId: undefined });
const CONNECTIONS_URI = new ResourceTemplate('connections://user/{userId}', { userId: undefined });
const RECOMMENDATIONS_URI = new ResourceTemplate('recommendations://user/{userId}', { userId: undefined });

/**
 * Ressource pour le réseau d'un utilisateur
 */
export const registerNetworkResource = (server: McpServer) => {
  server.resource(
    'network',
    NETWORK_URI,
    async (params: any) => {
      const uri = new URL(params.uri);
      const variables = params.variables || {};
      logger.info(`Resource called: network, URI: ${uri.href}, Variables: ${JSON.stringify(variables)}`);
      try {
        // Extraire l'ID de l'utilisateur
        const userId = variables.userId as string;
        
        // Récupérer le réseau de l'utilisateur depuis MongoDB
        const network = await networkService.getUserNetwork(userId);
        logger.info(`Network retrieved successfully for ${userId || 'default user'}`);
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(network, null, 2)
          }]
        };
      } catch (error) {
        logger.error(`Error in network resource: ${error}`);
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify({ error: 'Failed to retrieve network' }, null, 2)
          }]
        };
      }
    }
  );
};

/**
 * Ressource pour les connexions d'un utilisateur
 */
export const registerConnectionsResource = (server: McpServer) => {
  server.resource(
    'connections',
    CONNECTIONS_URI,
   async (params: any) => {
    const uri = new URL(params.uri); 
    try {
        // Extraire l'ID de l'utilisateur
        const userId = params.userId as string;
        
        // Récupérer les connexions de l'utilisateur depuis MongoDB
        const connections = await networkService.getUserConnections(userId);
        logger.info(`Connections retrieved successfully for ${userId || 'default user'}`);
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(connections, null, 2)
          }]
        };
      } catch (error) {
        logger.error(`Error in connections resource: ${error}`);
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify({ error: 'Failed to retrieve connections' }, null, 2)
          }]
        };
      }
    }
  );
};

/**
 * Ressource pour les recommandations d'un utilisateur
 */
export const registerRecommendationsResource = (server: McpServer) => {
  server.resource(
    'recommendations',
    RECOMMENDATIONS_URI,
    async (params: any) => {
      const uri = new URL(params.uri);try {
        // Extraire l'ID de l'utilisateur
        const userId = params.userId as string;
        
        // Récupérer les recommandations de l'utilisateur depuis MongoDB
        const recommendations = await networkService.getUserRecommendations(userId);
        logger.info(`Recommendations retrieved successfully for ${userId || 'default user'}`);
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(recommendations, null, 2)
          }]
        };
      } catch (error) {
        logger.error(`Error in recommendations resource: ${error}`);
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify({ error: 'Failed to retrieve recommendations' }, null, 2)
          }]
        };
      }
    }
  );
};

// Variable pour suivre si les ressources ont déjà été enregistrées
let networkResourcesRegistered = false;

/**
 * Fonction pour enregistrer toutes les ressources de réseau
 * Utilise un flag global pour éviter les enregistrements multiples
 */
export const registerAllNetworkResources = (server: McpServer) => {
  // Si les ressources ont déjà été enregistrées, ne rien faire
  if (networkResourcesRegistered) {
    logger.info('Ressources de réseau déjà enregistrées, ignorant...');
    return;
  }
  
  try {
    // Enregistrer les ressources de réseau
    
    registerNetworkResource(server);
    
    registerConnectionsResource(server);
    
    registerRecommendationsResource(server);
    
    // Marquer les ressources comme enregistrées
    networkResourcesRegistered = true;
    logger.info('Toutes les ressources de réseau ont été enregistrées avec succès');
  } catch (error) {
    logger.error(`Erreur lors de l'enregistrement des ressources de réseau: ${error}`);
  }
};
