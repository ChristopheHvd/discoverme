/**
 * Service de donnu00e9es pour l'application DiscoverMe
 * 
 * Ce service fournit une interface pour accu00e9der aux donnu00e9es des profils utilisateurs.
 * Actuellement, il utilise des donnu00e9es statiques, mais il pourrait u00eatre u00e9tendu pour
 * se connecter u00e0 une base de donnu00e9es ou u00e0 une API externe.
 */

// Types pour les donnu00e9es du profil
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

// Donnu00e9es statiques pour le du00e9veloppement
const profiles: Record<string, Profile> = {
  'default': {
    name: 'John Doe',
    title: 'Du00e9veloppeur Full Stack',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'GraphQL'],
    experience: [
      {
        company: 'Tech Company',
        role: 'Senior Developer',
        period: '2020-2023',
        description: 'Du00e9veloppement d\'applications web modernes'
      },
      {
        company: 'Startup Innovation',
        role: 'Du00e9veloppeur Frontend',
        period: '2018-2020',
        description: 'Cru00e9ation d\'interfaces utilisateur ru00e9actives'
      }
    ],
    education: [
      {
        institution: 'Universitu00e9 de Technologie',
        degree: 'Master en Informatique',
        year: '2019'
      },
      {
        institution: 'Institut de Programmation',
        degree: 'Licence en Du00e9veloppement Web',
        year: '2017'
      }
    ],
    contact: {
      email: 'john.doe@example.com',
      linkedin: 'linkedin.com/in/johndoe',
      phone: '+33 6 12 34 56 78'
    },
    bio: 'Du00e9veloppeur passionnu00e9 avec plus de 5 ans d\'expu00e9rience dans la cru00e9ation d\'applications web performantes et conviviales.'
  }
};

// Classe de service pour accu00e9der aux donnu00e9es
export class ProfileService {
  /**
   * Ru00e9cupu00e8re un profil par son identifiant
   * @param profileId - Identifiant du profil (u00e0 du00e9faut: 'default')
   * @returns Le profil complet ou null si non trouvu00e9
   */
  getProfile(profileId: string = 'default'): Profile | null {
    return profiles[profileId] || null;
  }

  /**
   * Ru00e9cupu00e8re une section spu00e9cifique d'un profil
   * @param section - Nom de la section ('skills', 'experience', etc.)
   * @param profileId - Identifiant du profil (u00e0 du00e9faut: 'default')
   * @returns Les donnu00e9es de la section ou null si non trouvu00e9e
   */
  getProfileSection(section: keyof Profile, profileId: string = 'default'): any {
    const profile = this.getProfile(profileId);
    if (!profile) return null;
    
    return profile[section];
  }

  /**
   * Vu00e9rifie la disponibilitu00e9 d'un utilisateur u00e0 une date et heure donnu00e9es
   * @param date - Date au format YYYY-MM-DD
   * @param time - Heure au format HH:MM
   * @param profileId - Identifiant du profil (u00e0 du00e9faut: 'default')
   * @returns Objet indiquant la disponibilitu00e9
   */
  checkAvailability(date: string, time: string, profileId: string = 'default'): { available: boolean; message: string } {
    // Simulation de vu00e9rification de disponibilitu00e9
    // Dans une implu00e9mentation ru00e9elle, cela pourrait consulter un calendrier
    const profile = this.getProfile(profileId);
    if (!profile) {
      return { available: false, message: 'Profil non trouvu00e9' };
    }

    // Logique simplifiu00e9e pour la du00e9monstration
    // Considu00e9rons que l'utilisateur est disponible en semaine de 9h u00e0 18h
    const dateObj = new Date(date);
    const day = dateObj.getDay(); // 0 = dimanche, 1-5 = lundi-vendredi, 6 = samedi
    const [hours] = time.split(':').map(Number);

    const isWeekday = day >= 1 && day <= 5;
    const isBusinessHours = hours >= 9 && hours < 18;

    if (isWeekday && isBusinessHours) {
      return { 
        available: true, 
        message: `${profile.name} est disponible le ${date} u00e0 ${time}.` 
      };
    } else {
      return { 
        available: false, 
        message: `${profile.name} n'est pas disponible le ${date} u00e0 ${time}. Veuillez choisir un jour de semaine entre 9h et 18h.` 
      };
    }
  }

  /**
   * Enregistre une demande de contact
   * @param reason - Raison de la demande
   * @param contactMethod - Mu00e9thode de contact pru00e9fu00e9ru00e9e
   * @param profileId - Identifiant du profil (u00e0 du00e9faut: 'default')
   * @returns Objet indiquant le statut de la demande
   */
  requestContact(reason: string, contactMethod: string, profileId: string = 'default'): { success: boolean; message: string } {
    const profile = this.getProfile(profileId);
    if (!profile) {
      return { success: false, message: 'Profil non trouvu00e9' };
    }

    // Dans une implu00e9mentation ru00e9elle, on enregistrerait la demande dans une base de donnu00e9es
    // et on pourrait envoyer une notification u00e0 l'utilisateur
    
    return { 
      success: true, 
      message: `Votre demande de contact avec ${profile.name} par ${contactMethod} a u00e9tu00e9 enregistru00e9e. Raison: ${reason}` 
    };
  }
}

// Exporter une instance singleton du service
export const profileService = new ProfileService();
