import { UserService } from './userService.js';
import { ContentService } from './contentService.js';
import { ActionService } from './actionService.js';
import User, { IUser } from '../models/User.js';
import { connectDB } from '../config/database.js';
import mongoose from 'mongoose';

// Types pour la compatibilité avec l'ancien service
export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface Contact {
  email: string;
  linkedin: string;
  phone?: string;
}

export interface Profile {
  name: string;
  title: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  contact: Contact;
  bio?: string;
}

/**
 * Service de profil utilisant MongoDB
 */
export class ProfileServiceMongo {
  private userService: UserService;
  private contentService: ContentService;
  private actionService: ActionService;
  private defaultUserId: string = '65e0a8c7b8d7f8e9d0c1b2a3'; // ID fictif pour le développement
  private isConnected: boolean = false;

  constructor() {
    this.userService = new UserService();
    this.contentService = new ContentService();
    this.actionService = new ActionService();
  }

  /**
   * Initialise la connexion à la base de données
   */
  async initialize(): Promise<void> {
    if (!this.isConnected) {
      await connectDB();
      this.isConnected = true;
      await this.ensureDefaultUserExists();
    }
  }

  /**
   * S'assure que l'utilisateur par défaut existe dans la base de données
   */
  private async ensureDefaultUserExists(): Promise<void> {
    try {
      // Vérifier si l'utilisateur par défaut existe déjà
      const existingUser = await this.userService.getUserById(this.defaultUserId);
      
      if (!existingUser) {
        // Créer un utilisateur par défaut si nécessaire
        const defaultUser = {
          _id: new mongoose.Types.ObjectId(this.defaultUserId),
          name: 'John Doe',
          email: 'john.doe@example.com',
          headline: 'Développeur Full Stack',
          openToWork: true,
          hiring: false,
          skills: [
            { name: 'JavaScript', level: 'Expert', endorsements: 15 },
            { name: 'TypeScript', level: 'Expert', endorsements: 12 },
            { name: 'React', level: 'Advanced', endorsements: 10 },
            { name: 'Node.js', level: 'Advanced', endorsements: 8 },
            { name: 'GraphQL', level: 'Intermediate', endorsements: 5 }
          ],
          experience: [
            {
              title: 'Senior Developer',
              company: 'Tech Company',
              startDate: new Date('2020-01-01'),
              endDate: new Date('2023-12-31'),
              description: 'Développement d\'applications web modernes'
            },
            {
              title: 'Développeur Frontend',
              company: 'Startup Innovation',
              startDate: new Date('2018-01-01'),
              endDate: new Date('2019-12-31'),
              description: 'Création d\'interfaces utilisateur réactives'
            }
          ],
          education: [
            {
              institution: 'Université de Technologie',
              degree: 'Master en Informatique',
              field: 'Développement Web',
              startYear: 2017,
              endYear: 2019
            },
            {
              institution: 'Institut de Programmation',
              degree: 'Licence en Développement Web',
              field: 'Programmation',
              startYear: 2014,
              endYear: 2017
            }
          ],
          contentIds: [],
          profileViews: 0,
          actionPerformed: {
            calls: 0,
            messages: 0
          }
        } as Partial<IUser>;

        await this.userService.createUser(defaultUser);
        console.log('Utilisateur par défaut créé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification/création de l\'utilisateur par défaut:', error);
    }
  }

  /**
   * Récupère un profil par son identifiant
   * @param profileId - Identifiant du profil (à défaut: valeur par défaut)
   * @returns Le profil complet ou null si non trouvé
   */
  async getProfile(profileId: string = this.defaultUserId): Promise<Profile | null> {
    await this.initialize();
    
    try {
      // Essayer de récupérer l'utilisateur par l'ID spécifié
      let user = await this.userService.getUserById(profileId);
      
      // Si l'utilisateur n'est pas trouvé et que l'ID est celui par défaut,
      // essayer de récupérer le premier utilisateur disponible
      if (!user && profileId === this.defaultUserId) {
        const users = await User.find().limit(1).lean();
        if (users.length > 0) {
          user = users[0];
        }
      }
      
      if (!user) return null;

      // Convertir le modèle MongoDB en format Profile attendu par l'application
      return this.convertUserToProfile(user);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return null;
    }
  }

  /**
   * Convertit un document User MongoDB en objet Profile
   */
  private convertUserToProfile(user: IUser): Profile {
    return {
      name: user.name,
      title: user.headline || '',
      skills: user.skills.map((skill: { name: string }) => skill.name),
      experience: user.experience.map((exp: { company: string; title: string; startDate: Date; endDate?: Date; description?: string }) => ({
        company: exp.company,
        role: exp.title,
        period: `${new Date(exp.startDate).getFullYear()}-${exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}`,
        description: exp.description || ''
      })),
      education: user.education.map((edu: { institution: string; degree: string; startYear: number; endYear?: number }) => ({
        institution: edu.institution,
        degree: edu.degree,
        year: `${edu.startYear}-${edu.endYear || 'Present'}`
      })),
      contact: {
        email: user.email,
        linkedin: `linkedin.com/in/${user.name.toLowerCase().replace(' ', '-')}`,
        phone: user.phone
      },
      bio: user.headline
    };
  }

  /**
   * Récupère une section spécifique d'un profil
   * @param section - Nom de la section ('skills', 'experience', etc.)
   * @param profileId - Identifiant du profil (à défaut: valeur par défaut)
   * @returns Les données de la section ou null si non trouvée
   */
  async getProfileSection(section: keyof Profile, profileId: string = this.defaultUserId): Promise<any> {
    const profile = await this.getProfile(profileId);
    if (!profile) return null;
    
    return profile[section];
  }

  /**
   * Vérifie la disponibilité d'un utilisateur à une date et heure données
   * @param date - Date au format YYYY-MM-DD
   * @param time - Heure au format HH:MM
   * @param profileId - Identifiant du profil (à défaut: valeur par défaut)
   * @returns Objet indiquant la disponibilité
   */
  async checkAvailability(date: string, time: string, profileId: string = this.defaultUserId): Promise<{ available: boolean; message: string }> {
    await this.initialize();
    
    const profile = await this.getProfile(profileId);
    if (!profile) {
      return { available: false, message: 'Profil non trouvé' };
    }

    // Logique simplifiée pour la démonstration
    // Considérons que l'utilisateur est disponible en semaine de 9h à 18h
    const dateObj = new Date(date);
    const day = dateObj.getDay(); // 0 = dimanche, 1-5 = lundi-vendredi, 6 = samedi
    const [hours] = time.split(':').map(Number);

    const isWeekday = day >= 1 && day <= 5;
    const isBusinessHours = hours >= 9 && hours < 18;

    if (isWeekday && isBusinessHours) {
      // Incrémenter le compteur d'actions
      await this.userService.incrementActionCounter(profileId, 'availability_checks');
      
      return { 
        available: true, 
        message: `${profile.name} est disponible le ${date} à ${time}.` 
      };
    } else {
      return { 
        available: false, 
        message: `${profile.name} n'est pas disponible le ${date} à ${time}. Veuillez choisir un jour de semaine entre 9h et 18h.` 
      };
    }
  }

  /**
   * Enregistre une demande de contact
   * @param reason - Raison de la demande
   * @param contactMethod - Méthode de contact préférée
   * @param profileId - Identifiant du profil (à défaut: valeur par défaut)
   * @returns Objet indiquant le statut de la demande
   */
  async requestContact(reason: string, contactMethod: string, profileId: string = this.defaultUserId): Promise<{ success: boolean; message: string }> {
    await this.initialize();
    
    const profile = await this.getProfile(profileId);
    if (!profile) {
      return { success: false, message: 'Profil non trouvé' };
    }

    try {
      // Incrémenter le compteur d'actions
      await this.userService.incrementActionCounter(profileId, 'contact_requests');
      
      // Dans une implémentation réelle, on pourrait stocker la demande dans une collection dédiée
      
      return { 
        success: true, 
        message: `Votre demande de contact avec ${profile.name} par ${contactMethod} a été enregistrée. Raison: ${reason}` 
      };
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la demande de contact:', error);
      return { success: false, message: 'Une erreur est survenue lors de la demande de contact' };
    }
  }
}

// Exporter une instance singleton du service
export const profileServiceMongo = new ProfileServiceMongo();
