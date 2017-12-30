module.exports = {
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  moduleDirectories: ['node_modules', 'src', 'spec'],
  moduleNameMapper: {
    '^.+\\.s?css$': '<rootDir>/spec/jest/stub.js',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/spec/**/*.spec.(ts|tsx)'],
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*.{ts,tsx}'],
  coverageReporters: ['text'],
  mapCoverage: true,
  setupTestFrameworkScriptFile: 'raf/polyfill',
  globals: {
    "ts-jest": {
      tsConfigFile: "./spec/tsconfig.json",
    },
  },
}
