module.exports = {
  verbose: true,
  setupTestFrameworkScriptFile: "./jest.setup.js",
  globalSetup: "truffle-jest/lib/inproc/setup",
  globalTeardown: "truffle-jest/lib/inproc/teardown",
  testEnvironment: "truffle-jest/lib/inproc/environment"
};
