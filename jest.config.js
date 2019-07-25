module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageThreshold: {
    "global": {
      "branches": 0,
      "functions": 0,
      "lines": 0,
      "statements": 0,
    }
  },
  coveragePathIgnorePatterns: [ 
    "/node_modules/",
    "<rootDir>/dist"
  ]
};