export default {
  testEnvironment: "node",

  setupFilesAfterEnv: [
    "<rootDir>/tests/setup.js"
  ],

  testMatch: [
    "**/tests/**/*.test.js"
  ],

  clearMocks: true,

  verbose: true
};