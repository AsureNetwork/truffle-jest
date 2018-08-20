const TruffleTest = require("./TruffleTest");

const DIR = "jest-test";

module.exports = async function teardown() {
  console.log("truffle-jest: Teardown");
  await global.__truffleTest.cleanup();
};
