import Action, { IAction } from '../models/Action.js';
import mongoose from 'mongoose';

/**
 * Service pour gu00e9rer les opu00e9rations liu00e9es aux actions
 */
export class ActionService {
  /**
   * Cru00e9e une nouvelle action
   * @param actionData Les donnu00e9es de l'action u00e0 cru00e9er
   * @returns L'action cru00e9u00e9e
   */
  async createAction(actionData: Partial<IAction>): Promise<IAction> {
    try {
      const action = new Action(actionData);
      await action.save();
      return action;
    } catch (error) {
      console.error('Erreur lors de la cru00e9ation de l\'action:', error);
      throw error;
    }
  }

  /**
   * Ru00e9cupu00e8re une action par son ID
   * @param actionId L'ID de l'action
   * @returns L'action trouvu00e9e ou null
   */
  async getActionById(actionId: string): Promise<IAction | null> {
    try {
      return await Action.findById(actionId);
    } catch (error) {
      console.error('Erreur lors de la ru00e9cupu00e9ration de l\'action:', error);
      throw error;
    }
  }

  /**
   * Ru00e9cupu00e8re toutes les actions d'un utilisateur
   * @param userId L'ID de l'utilisateur
   * @returns Liste des actions de l'utilisateur
   */
  async getUserActions(userId: string): Promise<IAction[]> {
    try {
      return await Action.find({ userId });
    } catch (error) {
      console.error('Erreur lors de la ru00e9cupu00e9ration des actions utilisateur:', error);
      throw error;
    }
  }

  /**
   * Met u00e0 jour une action
   * @param actionId L'ID de l'action
   * @param updateData Les donnu00e9es u00e0 mettre u00e0 jour
   * @returns L'action mise u00e0 jour
   */
  async updateAction(actionId: string, updateData: Partial<IAction>): Promise<IAction | null> {
    try {
      return await Action.findByIdAndUpdate(
        actionId,
        updateData,
        { new: true }
      );
    } catch (error) {
      console.error('Erreur lors de la mise u00e0 jour de l\'action:', error);
      throw error;
    }
  }

  /**
   * Supprime une action
   * @param actionId L'ID de l'action u00e0 supprimer
   * @returns true si supprimu00e9e, false sinon
   */
  async deleteAction(actionId: string): Promise<boolean> {
    try {
      const result = await Action.findByIdAndDelete(actionId);
      return result !== null;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'action:', error);
      throw error;
    }
  }

  /**
   * Recherche des actions par nom
   * @param name Le nom de l'action u00e0 rechercher
   * @returns Liste des actions correspondantes
   */
  async findActionsByName(name: string): Promise<IAction[]> {
    try {
      return await Action.find({ name: { $regex: name, $options: 'i' } });
    } catch (error) {
      console.error('Erreur lors de la recherche d\'actions par nom:', error);
      throw error;
    }
  }
}
