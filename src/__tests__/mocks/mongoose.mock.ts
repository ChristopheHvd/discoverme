// Mock pour mongoose
import { jest } from '@jest/globals';

// Interface pour les donnu00e9es utilisateur mocku00e9es
interface MockUser {
  _id: string;
  name: string;
  title: string;
  skills: string[];
  experience: any[];
  education: any[];
  contact: { email: string; linkedin: string };
}

// Cru00e9er un utilisateur mock
const mockUser: MockUser = {
  _id: 'mockid123',
  name: 'John Doe',
  title: 'Du00e9veloppeur Full Stack',
  skills: ['JavaScript', 'TypeScript', 'React'],
  experience: [],
  education: [],
  contact: { email: 'john.doe@example.com', linkedin: 'linkedin.com/in/johndoe' }
};

// Cru00e9er les fonctions mock avec des types corrects
const connect = jest.fn().mockResolvedValue(true);
const disconnect = jest.fn().mockResolvedValue(true);

// Cru00e9er les fonctions de requ00eate mock
const findFn = jest.fn().mockReturnValue({
  limit: jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue([mockUser])
  })
});

const findOneFn = jest.fn().mockResolvedValue(mockUser);
const createFn = jest.fn().mockResolvedValue(mockUser);

// Cru00e9er la fonction model mock
const modelFn = jest.fn().mockReturnValue({
  find: findFn,
  findOne: findOneFn,
  create: createFn
});

// Cru00e9er le mock Schema
const Schema = function() { return {}; };
Schema.Types = {
  ObjectId: String,
  String: String,
  Number: Number,
  Boolean: Boolean,
  Array: Array,
  Date: Date
};

// Mock des fonctions mongoose avec des types corrects
const mockMongoose = {
  connect,
  disconnect,
  model: modelFn,
  Schema,
  Types: Schema.Types
};

// Exporter le mock
export default mockMongoose;
