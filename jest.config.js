export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\.tsx?$': ['ts-jest', {
      useESM: true,
    }],
  },
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
  },
  // Du00e9finir les variables d'environnement pour les tests
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  // Ignorer les fichiers de du00e9finition TypeScript et les fichiers de mock
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '\.d\.ts$',
    '<rootDir>/src/__tests__/mocks/',
    '<rootDir>/src/__tests__/setup.ts'
  ],
  // Augmenter le timeout global pour les tests
  testTimeout: 30000,
};
