import Content, { IContent } from '../models/Content.js';
import mongoose from 'mongoose';

/**
 * Service pour gérer les opérations liées aux contenus
 */
export class ContentService {
  /**
   * Crée un nouveau contenu
   * @param contentData Les données du contenu à créer
   * @returns Le contenu créé
   */
  async createContent(contentData: Partial<IContent>): Promise<IContent> {
    try {
      const content = new Content(contentData);
      await content.save();
      return content;
    } catch (error) {
      console.error('Erreur lors de la création du contenu:', error);
      throw error;
    }
  }

  /**
   * Récupère un contenu par son ID
   * @param contentId L'ID du contenu
   * @returns Le contenu trouvé ou null
   */
  async getContentById(contentId: string): Promise<IContent | null> {
    try {
      return await Content.findById(contentId);
    } catch (error) {
      console.error('Erreur lors de la récupération du contenu:', error);
      throw error;
    }
  }

  /**
   * Récupère tous les contenus d'un utilisateur
   * @param userId L'ID de l'utilisateur
   * @returns Liste des contenus de l'utilisateur
   */
  async getUserContents(userId: string): Promise<IContent[]> {
    try {
      return await Content.find({ userId });
    } catch (error) {
      console.error('Erreur lors de la récupération des contenus utilisateur:', error);
      throw error;
    }
  }

  /**
   * Met à jour un contenu
   * @param contentId L'ID du contenu
   * @param updateData Les données à mettre à jour
   * @returns Le contenu mis à jour
   */
  async updateContent(contentId: string, updateData: Partial<IContent>): Promise<IContent | null> {
    try {
      return await Content.findByIdAndUpdate(
        contentId,
        updateData,
        { new: true }
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du contenu:', error);
      throw error;
    }
  }

  /**
   * Supprime un contenu
   * @param contentId L'ID du contenu à supprimer
   * @returns true si supprimé, false sinon
   */
  async deleteContent(contentId: string): Promise<boolean> {
    try {
      const result = await Content.findByIdAndDelete(contentId);
      return result !== null;
    } catch (error) {
      console.error('Erreur lors de la suppression du contenu:', error);
      throw error;
    }
  }

  /**
   * Recherche des contenus par type
   * @param type Le type de contenu à rechercher
   * @returns Liste des contenus correspondants
   */
  async findContentsByType(type: string): Promise<IContent[]> {
    try {
      return await Content.find({ type });
    } catch (error) {
      console.error('Erreur lors de la recherche de contenus par type:', error);
      throw error;
    }
  }

  /**
   * Recherche des contenus par tags
   * @param tags Les tags à rechercher
   * @returns Liste des contenus correspondants
   */
  async findContentsByTags(tags: string[]): Promise<IContent[]> {
    try {
      return await Content.find({ tags: { $in: tags } });
    } catch (error) {
      console.error('Erreur lors de la recherche de contenus par tags:', error);
      throw error;
    }
  }

  /**
   * Recherche textuelle dans le contenu
   * @param query La requête de recherche
   * @returns Liste des contenus correspondants
   */
  async searchInTextContent(query: string): Promise<IContent[]> {
    try {
      return await Content.find({ textContent: { $regex: query, $options: 'i' } });
    } catch (error) {
      console.error('Erreur lors de la recherche textuelle dans les contenus:', error);
      throw error;
    }
  }
}
