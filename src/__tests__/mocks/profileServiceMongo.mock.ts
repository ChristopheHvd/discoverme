// Mock du service de profil MongoDB pour les tests
import { jest, describe, it, expect } from '@jest/globals';

// Interface pour le profil mockué
interface MockProfile {
  name: string;
  title: string;
  skills: string[];
  experience: Array<{
    company: string;
    role: string;
    period: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  contact: {
    email: string;
    linkedin: string;
  };
  bio: string;
}

// Interface pour la ruéponse de disponibilitué
interface AvailabilityResponse {
  available: boolean;
  message: string;
}

// Interface pour la ruéponse de contact
interface ContactResponse {
  success: boolean;
  message: string;
}

// Donnuées fictives pour les tests
const mockProfile: MockProfile = {
  name: 'John Doe',
  title: 'Duéveloppeur Full Stack',
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'GraphQL'],
  experience: [
    {
      company: 'Tech Company',
      role: 'Senior Developer',
      period: '2020-2023',
      description: 'Duéveloppement d\'applications web modernes'
    }
  ],
  education: [
    {
      institution: 'Universitué de Technologie',
      degree: 'Master en Informatique',
      year: '2019'
    }
  ],
  contact: {
    email: 'john.doe@example.com',
    linkedin: 'linkedin.com/in/johndoe'
  },
  bio: 'Duéveloppeur passionnué avec plus de 5 ans d\'expuérience'
};

// Cruéer les fonctions mock individuellement
const initializeFn = jest.fn().mockImplementation(() => Promise.resolve(undefined));
const getProfileFn = jest.fn().mockImplementation(() => Promise.resolve(mockProfile));
// Utiliser une fonction sans typage explicite du paramètre pour éviter l'erreur
const getProfileSectionFn = jest.fn().mockImplementation(section => {
  // Cast le paramètre en string pour l'utiliser dans l'accès à l'objet
  const sectionKey = section as string;
  return Promise.resolve((mockProfile as any)[sectionKey] || null);
});

const availabilityResponse = {
  available: true,
  message: 'John Doe est disponible le 2025-04-03 u00e0 14:00.'
};
const checkAvailabilityFn = jest.fn().mockImplementation(() => Promise.resolve(availabilityResponse));

const contactResponse = {
  success: true,
  message: 'Votre demande de contact avec John Doe par email a uétué enregistruée. Raison: Test'
};
const requestContactFn = jest.fn().mockImplementation(() => Promise.resolve(contactResponse));

// Mock du service profileServiceMongo avec des types corrects
export const profileServiceMongo = {
  initialize: initializeFn,
  getProfile: getProfileFn,
  getProfileSection: getProfileSectionFn,
  checkAvailability: checkAvailabilityFn,
  requestContact: requestContactFn
};

// Ruéinitialiser tous les mocks
export const resetMocks = () => {
  jest.clearAllMocks();
};
