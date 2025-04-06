/**
 * Ressources de ru00e9seau pour DiscoverMe
 * 
 * Ces ressources permettent aux agents IA d'accu00e9der aux informations
 * de ru00e9seau des utilisateurs (connexions, recommandations, etc.).
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Donnu00e9es factices pour simuler un ru00e9seau professionnel
const mockNetworks = {
  '60d21b4667d0d8992e610c85': {
    connections: [
      { userId: '60d21b4667d0d8992e610c86', name: 'Thomas Dubois', relationship: '1st', connectedSince: '2023-05-15' },
      { userId: '60d21b4667d0d8992e610c87', name: 'Emma Bernard', relationship: '1st', connectedSince: '2023-08-22' },
      { userId: '60d21b4667d0d8992e610c89', name: 'Camille Leroy', relationship: '1st', connectedSince: '2024-01-10' }
    ],
    recommendations: [
      { userId: '60d21b4667d0d8992e610c86', name: 'Thomas Dubois', date: '2023-06-20', text: 'Sophie est une du00e9veloppeuse exceptionnelle avec une grande expertise en React et Node.js.' },
      { userId: '60d21b4667d0d8992e610c89', name: 'Camille Leroy', date: '2024-02-05', text: 'J\'ai eu le plaisir de travailler avec Sophie sur plusieurs projets. Son expertise technique et sa capacitu00e9 u00e0 ru00e9soudre des problu00e8mes complexes sont remarquables.' }
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
 * Ressource pour le ru00e9seau d'un utilisateur
 */
export const registerNetworkResource = (server: McpServer) => {
  server.resource(
    'network',
    'network://user/{userId}',
    async (uri, variables: Record<string, unknown>) => {
      // Extraire l'ID de l'utilisateur
      const userId = variables.userId as string;
      
      // En production, on ru00e9cupu00e8rerait le ru00e9seau de l'utilisateur depuis la base de donnu00e9es
      // const network = await networkService.getUserNetwork(userId);
      
      // Simulation avec des donnu00e9es factices
      const network = mockNetworks[userId as keyof typeof mockNetworks] || mockNetworks.default;
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(network, null, 2)
        }]
      };
    }
  );
};

/**
 * Ressource pour les connexions d'un utilisateur
 */
export const registerConnectionsResource = (server: McpServer) => {
  server.resource(
    'connections',
    'connections://user/{userId}',
    async (uri, variables: Record<string, unknown>) => {
      // Extraire l'ID de l'utilisateur
      const userId = variables.userId as string;
      
      // En production, on ru00e9cupu00e8rerait les connexions de l'utilisateur depuis la base de donnu00e9es
      // const connections = await networkService.getUserConnections(userId);
      
      // Simulation avec des donnu00e9es factices
      const network = mockNetworks[userId as keyof typeof mockNetworks] || mockNetworks.default;
      const connections = network.connections;
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(connections, null, 2)
        }]
      };
    }
  );
};

/**
 * Ressource pour les recommandations d'un utilisateur
 */
export const registerRecommendationsResource = (server: McpServer) => {
  server.resource(
    'recommendations',
    'recommendations://user/{userId}',
    async (uri, variables: Record<string, unknown>) => {
      // Extraire l'ID de l'utilisateur
      const userId = variables.userId as string;
      
      // En production, on ru00e9cupu00e8rerait les recommandations de l'utilisateur depuis la base de donnu00e9es
      // const recommendations = await networkService.getUserRecommendations(userId);
      
      // Simulation avec des donnu00e9es factices
      const network = mockNetworks[userId as keyof typeof mockNetworks] || mockNetworks.default;
      const recommendations = network.recommendations;
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(recommendations, null, 2)
        }]
      };
    }
  );
};

/**
 * Fonction pour enregistrer toutes les ressources de ru00e9seau
 */
export const registerAllNetworkResources = (server: McpServer) => {
  registerNetworkResource(server);
  registerConnectionsResource(server);
  registerRecommendationsResource(server);
};
