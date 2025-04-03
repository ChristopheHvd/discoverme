// Configuration pour les tests Jest
import { jest } from '@jest/globals';

// Définir NODE_ENV=test
process.env.NODE_ENV = 'test';

// Interface pour l'utilisateur mocké
interface MockUser {
  _id: string;
  name: string;
  title: string;
  skills: string[];
  experience: any[];
  education: any[];
  contact: { email: string; linkedin: string };
}

// Créer un utilisateur mock
const mockUser: MockUser = {
  _id: 'mockid123',
  name: 'John Doe',
  title: 'Développeur Full Stack',
  skills: ['JavaScript', 'TypeScript', 'React'],
  experience: [],
  education: [],
  contact: { email: 'john.doe@example.com', linkedin: 'linkedin.com/in/johndoe' }
};

// Mock mongoose
jest.mock('mongoose', () => {
  // Créer un mock de Schema avec Types.ObjectId
  const Schema = function() { return {}; };
  Schema.Types = {
    ObjectId: String,
    String: String,
    Number: Number,
    Boolean: Boolean,
    Array: Array,
    Date: Date
  };
  
  // Créer les fonctions mock avec des types corrects
  const connect = jest.fn().mockImplementation(() => Promise.resolve(true));
  const disconnect = jest.fn().mockImplementation(() => Promise.resolve(true));
  
  // Créer les fonctions de requête mock
  const leanFn = jest.fn().mockImplementation(() => Promise.resolve([mockUser]));
  const limitFn = jest.fn().mockImplementation(() => ({ lean: leanFn }));
  const findFn = jest.fn().mockImplementation(() => ({ limit: limitFn }));
  
  const findOneFn = jest.fn().mockImplementation(() => Promise.resolve(mockUser));
  const createFn = jest.fn().mockImplementation(() => Promise.resolve(mockUser));
  
  // Créer la fonction model mock
  const modelFn = jest.fn().mockReturnValue({
    find: findFn,
    findOne: findOneFn,
    create: createFn
  });
  
  return {
    connect,
    disconnect,
    model: modelFn,
    Schema,
    Types: Schema.Types
  };
});

// Mock les modèles MongoDB
jest.mock('../models/User', () => {
  // Créer les fonctions de requête mock
  const leanFn = jest.fn().mockImplementation(() => Promise.resolve([mockUser]));
  const limitFn = jest.fn().mockImplementation(() => ({ lean: leanFn }));
  const findFn = jest.fn().mockImplementation(() => ({ limit: limitFn }));
  
  const findOneFn = jest.fn().mockImplementation(() => Promise.resolve(mockUser));
  const createFn = jest.fn().mockImplementation(() => Promise.resolve(mockUser));
  
  return {
    default: jest.fn().mockReturnValue({
      find: findFn,
      findOne: findOneFn,
      create: createFn
    })
  };
});

jest.mock('../models/Content', () => ({
  default: jest.fn().mockReturnValue({})
}));

jest.mock('../models/Action', () => ({
  default: jest.fn().mockReturnValue({})
}));
