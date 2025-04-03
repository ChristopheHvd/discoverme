import User, { IUser } from '../models/User.js';
import mongoose from 'mongoose';

/**
 * Service pour gérer les opérations liées aux utilisateurs
 */
export class UserService {
  /**
   * Crée un nouvel utilisateur
   * @param userData Les données de l'utilisateur à créer
   * @returns L'utilisateur créé
   */
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Récupère un utilisateur par son ID
   * @param userId L'ID de l'utilisateur
   * @returns L'utilisateur trouvé ou null
   */
  async getUserById(userId: string): Promise<IUser | null> {
    try {
      return await User.findById(userId);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Récupère un utilisateur par son email
   * @param email L'email de l'utilisateur
   * @returns L'utilisateur trouvé ou null
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur par email:', error);
      throw error;
    }
  }

  /**
   * Met à jour un utilisateur
   * @param userId L'ID de l'utilisateur
   * @param updateData Les données à mettre à jour
   * @returns L'utilisateur mis à jour
   */
  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Supprime un utilisateur
   * @param userId L'ID de l'utilisateur à supprimer
   * @returns true si supprimé, false sinon
   */
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(userId);
      return result !== null;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Ajoute une compétence à un utilisateur
   * @param userId L'ID de l'utilisateur
   * @param skill La compétence à ajouter
   * @returns L'utilisateur mis à jour
   */
  async addSkill(userId: string, skill: { name: string; level?: string; endorsements?: number }): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(
        userId,
        { $push: { skills: skill } },
        { new: true }
      );
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'une compétence:', error);
      throw error;
    }
  }

  /**
   * Ajoute une expérience professionnelle à un utilisateur
   * @param userId L'ID de l'utilisateur
   * @param experience L'expérience à ajouter
   * @returns L'utilisateur mis à jour
   */
  async addExperience(userId: string, experience: {
    title: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(
        userId,
        { $push: { experience: experience } },
        { new: true }
      );
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'une expérience:', error);
      throw error;
    }
  }

  /**
   * Incrémente le compteur d'une action spécifique
   * @param userId L'ID de l'utilisateur
   * @param actionType Le type d'action (calls, messages, etc.)
   * @returns L'utilisateur mis à jour
   */
  async incrementActionCounter(userId: string, actionType: string): Promise<IUser | null> {
    try {
      const updateQuery: any = {};
      updateQuery[`actionPerformed.${actionType}`] = 1;

      return await User.findByIdAndUpdate(
        userId,
        { $inc: updateQuery },
        { new: true }
      );
    } catch (error) {
      console.error(`Erreur lors de l'incrémentation du compteur ${actionType}:`, error);
      throw error;
    }
  }

  /**
   * Recherche des utilisateurs selon des critères
   * @param criteria Les critères de recherche
   * @returns Liste des utilisateurs correspondants
   */
  async searchUsers(criteria: any): Promise<IUser[]> {
    try {
      return await User.find(criteria);
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      throw error;
    }
  }
}
