/**
 * Types pour l'application DiscoverMe
 * 
 * Ce fichier définit les interfaces pour les données des profils utilisateurs.
 * Ces interfaces sont utilisées par les services MongoDB et d'autres composants de l'application.
 */

// Types pour les données du profil
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

