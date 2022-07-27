module.exports = {
    clearMocks: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    modulePathIgnorePatterns: ["./dist"],
    setupFilesAfterEnv: ['<rootDir>/singleton.ts'],
  };
  