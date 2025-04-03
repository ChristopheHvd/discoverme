// Mock du service de profil MongoDB pour les tests

// Données fictives pour les tests
const mockProfile = {
  name: 'John Doe',
  title: 'Développeur Full Stack',
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'GraphQL'],
  experience: [
    {
      company: 'Tech Company',
      role: 'Senior Developer',
      period: '2020-2023',
      description: 'Développement d\'applications web modernes'
    }
  ],
  education: [
    {
      institution: 'Université de Technologie',
      degree: 'Master en Informatique',
      year: '2019'
    }
  ],
  contact: {
    email: 'john.doe@example.com',
    linkedin: 'linkedin.com/in/johndoe'
  },
  bio: 'Développeur passionné avec plus de 5 ans d\'expérience'
};

// Mock du service profileServiceMongo
export const profileServiceMongo = {
  initialize: jest.fn().mockResolvedValue(undefined),
  getProfile: jest.fn().mockResolvedValue(mockProfile),
  getProfileSection: jest.fn().mockImplementation((section: string) => {
    return Promise.resolve((mockProfile as any)[section] || null);
  }),
  checkAvailability: jest.fn().mockResolvedValue({
    available: true,
    message: 'John Doe est disponible le 2025-04-03 à 14:00.'
  }),
  requestContact: jest.fn().mockResolvedValue({
    success: true,
    message: 'Votre demande de contact avec John Doe par email a été enregistrée. Raison: Test'
  })
};

// Réinitialiser tous les mocks
export const resetMocks = () => {
  jest.clearAllMocks();
};
