/**
 * Ressources de réseau pour DiscoverMe
 * 
 * Ces ressources permettent aux agents IA d'accéder aux informations
 * de réseau des utilisateurs (connexions, recommandations, etc.).
 */

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { logger } from '../utils/logger.js';

// Définition des modèles d'URI pour éviter les erreurs d'URL
const NETWORK_URI = new ResourceTemplate('network://user/{userId}', { userId: undefined });
const CONNECTIONS_URI = new ResourceTemplate('connections://user/{userId}', { userId: undefined });
const RECOMMENDATIONS_URI = new ResourceTemplate('recommendations://user/{userId}', { userId: undefined });

// Donnuées factices pour simuler un ruéseau professionnel
const mockNetworks = {
  '60d21b4667d0d8992e610c85': {
    connections: [
      { userId: '60d21b4667d0d8992e610c86', name: 'Thomas Dubois', relationship: '1st', connectedSince: '2023-05-15' },
      { userId: '60d21b4667d0d8992e610c87', name: 'Emma Bernard', relationship: '1st', connectedSince: '2023-08-22' },
      { userId: '60d21b4667d0d8992e610c89', name: 'Camille Leroy', relationship: '1st', connectedSince: '2024-01-10' }
    ],
    recommendations: [
      { userId: '60d21b4667d0d8992e610c86', name: 'Thomas Dubois', date: '2023-06-20', text: 'Sophie est une duéveloppeuse exceptionnelle avec une grande expertise en React et Node.js.' },
      { userId: '60d21b4667d0d8992e610c89', name: 'Camille Leroy', date: '2024-02-05', text: 'J\'ai eu le plaisir de travailler avec Sophie sur plusieurs projets. Son expertise technique et sa capacitué u00e0 ruésoudre des problu00e8mes complexes sont remarquables.' }
    ]
  },
  '60d21b4667d0d8992e610c86': {
    connections: [
      { userId: '60d21b4667d0d8992e610c85', name: 'Sophie Martin', relationship: '1st', connectedSince: '2023-05-15' },
      { userId: '60d21b4667d0d8992e610c88', name: 'Lucas Moreau', relationship: '1st', connectedSince: '2022-11-08' }
    ],
    recommendations: [
      { userId: '60d21b4667d0d8992e610c88', name: 'Lucas Moreau', date: '2023-01-15', text: 'Thomas est un architecte cloud exceptionnel avec une connaissance approfondie d\'AWS et Kubernetes.' }
    ]
  },
  'default': {
    connections: [
      { userId: '60d21b4667d0d8992e610c85', name: 'Sophie Martin', relationship: '1st', connectedSince: '2023-07-12' },
      { userId: '60d21b4667d0d8992e610c86', name: 'Thomas Dubois', relationship: '2nd', connectedSince: '2023-09-18' },
      { userId: '60d21b4667d0d8992e610c87', name: 'Emma Bernard', relationship: '1st', connectedSince: '2023-11-05' }
    ],
    recommendations: [
      { userId: '60d21b4667d0d8992e610c85', name: 'Sophie Martin', date: '2023-08-20', text: 'Un professionnel exceptionnel avec qui j\'ai eu le plaisir de collaborer.' }
    ]
  }
};

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
        
        // En production, on récupèrerait le réseau de l'utilisateur depuis la base de données
        // const network = await networkService.getUserNetwork(userId);
        
        // Simulation avec des données factices
        const network = mockNetworks[userId as keyof typeof mockNetworks] || mockNetworks.default;
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
        
        // En production, on récupèrerait les connexions de l'utilisateur depuis la base de données
        // const connections = await networkService.getUserConnections(userId);
        
        // Simulation avec des données factices
        const network = mockNetworks[userId as keyof typeof mockNetworks] || mockNetworks.default;
        const connections = network.connections;
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
        
        // En production, on récupèrerait les recommandations de l'utilisateur depuis la base de données
        // const recommendations = await networkService.getUserRecommendations(userId);
        
        // Simulation avec des données factices
        const network = mockNetworks[userId as keyof typeof mockNetworks] || mockNetworks.default;
        const recommendations = network.recommendations;
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
    logger.info('Enregistrement des ressources de réseau...');
    
    registerNetworkResource(server);
    logger.info('Resource network enregistrée avec succès');
    
    registerConnectionsResource(server);
    logger.info('Resource connections enregistrée avec succès');
    
    registerRecommendationsResource(server);
    logger.info('Resource recommendations enregistrée avec succès');
    
    // Marquer les ressources comme enregistrées
    networkResourcesRegistered = true;
    logger.info('Toutes les ressources de réseau ont été enregistrées avec succès');
  } catch (error) {
    logger.error(`Erreur lors de l'enregistrement des ressources de réseau: ${error}`);
  }
};
