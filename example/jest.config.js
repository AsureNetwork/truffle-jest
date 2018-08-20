module.exports = {
  verbose: true,
  setupTestFrameworkScriptFile: "./jest.setup.js",
  globalSetup: "truffle-jest/lib/setup",
  globalTeardown: "truffle-jest/lib/teardown",
  testEnvironment: "truffle-jest/lib/environment"
};
