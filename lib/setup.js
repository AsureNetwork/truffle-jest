const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const TruffleTest = require("./TruffleTest");

const DIR = "jest-test";

module.exports = async function setup() {
  console.log("truffle-jest: Setup");
  global.__truffleTest = await TruffleTest.instance();

  // use the file system to expose the contractsBuildDirectory for TestEnvironments
  mkdirp.sync(DIR);
  fs.writeFileSync(
    path.join(DIR, "contractsBuildDirectory"),
    global.__truffleTest.config.contracts_build_directory
  );
};
