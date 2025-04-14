import Connection, { IConnection } from '../models/Connection.js';
import Recommendation, { IRecommendation } from '../models/Recommendation.js';
import User, { IUser } from '../models/User.js';
import { UserService } from './userService.js';
import { connectDB } from '../config/database.js';
import mongoose from 'mongoose';

/**
 * Service pour gérer les opérations liées au réseau professionnel
 */
export class NetworkService {
  private userService: UserService;
  private defaultUserId: string = '65e0a8c7b8d7f8e9d0c1b2a3'; // ID fictif pour le développement
  private isConnected: boolean = false;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Initialise la connexion à la base de données
   */
  async initialize(): Promise<void> {
    if (!this.isConnected) {
      await connectDB();
      this.isConnected = true;
      await this.ensureDefaultNetworkExists();
    }
  }

  /**
   * S'assure que le réseau par défaut existe dans la base de données
   */
  private async ensureDefaultNetworkExists(): Promise<void> {
    try {
      // Vérifier si l'utilisateur par défaut existe
      const defaultUser = await this.userService.getUserById(this.defaultUserId);
      
      if (!defaultUser) {
        console.error('L\'utilisateur par défaut n\'existe pas');
        return;
      }

      // Vérifier si des connexions existent déjà pour l'utilisateur par défaut
      const existingConnections = await Connection.find({ userId: this.defaultUserId }).lean();
      
      if (existingConnections.length === 0) {
        // Créer quelques connexions par défaut
        const users = await User.find({ _id: { $ne: this.defaultUserId } }).limit(3).lean();
        
        if (users.length > 0) {
          const connectionPromises = users.map(user => {
            const connection = new Connection({
              userId: this.defaultUserId,
              connectedUserId: user._id,
              relationship: '1st',
              connectedSince: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
            });
            return connection.save();
          });
          
          await Promise.all(connectionPromises);
          console.log('Connexions par défaut créées avec succès');
        }
      }

      // Vérifier si des recommandations existent déjà pour l'utilisateur par défaut
      const existingRecommendations = await Recommendation.find({ userId: this.defaultUserId }).lean();
      
      if (existingRecommendations.length === 0 && existingConnections.length > 0) {
        // Créer quelques recommandations par défaut
        const connectionIds = existingConnections.map(conn => conn.connectedUserId);
        const connectedUsers = await User.find({ _id: { $in: connectionIds } }).limit(2).lean();
        
        if (connectedUsers.length > 0) {
          const recommendationPromises = connectedUsers.map(user => {
            const recommendation = new Recommendation({
              userId: this.defaultUserId,
              authorId: user._id,
              text: `${defaultUser.name} est un professionnel exceptionnel avec qui j'ai eu le plaisir de collaborer.`,
              date: new Date(Date.now() - Math.floor(Math.random() * 5000000000))
            });
            return recommendation.save();
          });
          
          await Promise.all(recommendationPromises);
          console.log('Recommandations par défaut créées avec succès');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la création du réseau par défaut:', error);
    }
  }

  /**
   * Récupère le réseau complet d'un utilisateur
   * @param userId L'ID de l'utilisateur
   * @returns Le réseau complet (connexions et recommandations)
   */
  async getUserNetwork(userId: string = this.defaultUserId): Promise<any> {
    await this.initialize();
    
    try {
      // Récupérer les connexions et recommandations
      const connections = await this.getUserConnections(userId);
      const recommendations = await this.getUserRecommendations(userId);
      
      return {
        connections,
        recommendations
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du réseau:', error);
      throw error;
    }
  }

  /**
   * Récupère les connexions d'un utilisateur
   * @param userId L'ID de l'utilisateur
   * @returns Liste des connexions
   */
  async getUserConnections(userId: string = this.defaultUserId): Promise<any[]> {
    await this.initialize();
    
    try {
      // Récupérer les connexions depuis la base de données
      const connections = await Connection.find({ userId }).lean();
      
      // Récupérer les détails des utilisateurs connectés
      const userIds = connections.map(conn => conn.connectedUserId);
      const users = await User.find({ _id: { $in: userIds } }).lean();
      
      // Mapper les connexions avec les informations utilisateur
      return connections.map(conn => {
        const connectedUser = users.find(u => u._id.toString() === conn.connectedUserId.toString());
        return {
          userId: conn.connectedUserId.toString(),
          name: connectedUser ? connectedUser.name : 'Utilisateur inconnu',
          relationship: conn.relationship,
          connectedSince: conn.connectedSince.toISOString().split('T')[0]
        };
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des connexions:', error);
      return [];
    }
  }

  /**
   * Récupère les recommandations d'un utilisateur
   * @param userId L'ID de l'utilisateur
   * @returns Liste des recommandations
   */
  async getUserRecommendations(userId: string = this.defaultUserId): Promise<any[]> {
    await this.initialize();
    
    try {
      // Récupérer les recommandations depuis la base de données
      const recommendations = await Recommendation.find({ userId }).lean();
      
      // Récupérer les détails des auteurs
      const authorIds = recommendations.map(rec => rec.authorId);
      const authors = await User.find({ _id: { $in: authorIds } }).lean();
      
      // Mapper les recommandations avec les informations d'auteur
      return recommendations.map(rec => {
        const author = authors.find(a => a._id.toString() === rec.authorId.toString());
        return {
          userId: rec.authorId.toString(),
          name: author ? author.name : 'Utilisateur inconnu',
          date: rec.date.toISOString().split('T')[0],
          text: rec.text
        };
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des recommandations:', error);
      return [];
    }
  }

  /**
   * Ajoute une connexion entre deux utilisateurs
   * @param userId L'ID de l'utilisateur principal
   * @param connectedUserId L'ID de l'utilisateur à connecter
   * @param relationship Type de relation
   * @returns La connexion créée
   */
  async addConnection(userId: string, connectedUserId: string, relationship: string = '1st'): Promise<IConnection> {
    try {
      const connection = new Connection({
        userId,
        connectedUserId,
        relationship,
        connectedSince: new Date()
      });
      
      await connection.save();
      return connection;
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'une connexion:', error);
      throw error;
    }
  }

  /**
   * Ajoute une recommandation pour un utilisateur
   * @param userId L'ID de l'utilisateur qui reçoit la recommandation
   * @param authorId L'ID de l'auteur de la recommandation
   * @param text Le contenu de la recommandation
   * @returns La recommandation créée
   */
  async addRecommendation(userId: string, authorId: string, text: string): Promise<IRecommendation> {
    try {
      const recommendation = new Recommendation({
        userId,
        authorId,
        text,
        date: new Date()
      });
      
      await recommendation.save();
      return recommendation;
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'une recommandation:', error);
      throw error;
    }
  }
}

// Exporter une instance singleton du service
export const networkService = new NetworkService();
