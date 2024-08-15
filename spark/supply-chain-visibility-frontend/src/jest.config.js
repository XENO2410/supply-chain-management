export default {
    testEnvironment: 'jsdom', // Ensure jsdom is used
    setupFilesAfterEnv: ['<rootDir>/src/jest.setup.js'], // Adjust if you have a setup file
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
      '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js', // Mock file imports
    },
    transform: {
      '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'babel-jest', // Use babel-jest to transform files
    },
    transformIgnorePatterns: [
      'node_modules/(?!(bootstrap)/)', // Ignore transformation of node_modules except for bootstrap
    ],
  };
  