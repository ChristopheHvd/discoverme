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
  // Duéfinir les variables d'environnement pour les tests
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  // Ignorer les fichiers de duéfinition TypeScript et les fichiers de mock
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '\.d\.ts$',
    '<rootDir>/src/__tests__/mocks/',
    '<rootDir>/src/__tests__/setup.ts'
  ],
  // Spécifier explicitement les fichiers de test
  testRegex: '(/__tests__/(?!mocks/)(?!setup\.ts).*)\.(test|spec)\.[jt]sx?$',
  // Augmenter le timeout global pour les tests
  testTimeout: 30000,
};
