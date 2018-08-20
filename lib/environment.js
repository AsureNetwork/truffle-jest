const path = require("path");
const fs = require("fs");
const NodeEnvironment = require("jest-environment-node");
const TruffleTest = require("./TruffleTest");

const DIR = "jest-test";

class TruffleEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    const contractsBuildDirectory = fs.readFileSync(path.join(DIR, 'contractsBuildDirectory'), 'utf8');
    if (!contractsBuildDirectory) {
      throw new Error('contractsBuildDirectory not found');
    }

    console.log("truffle-jest: Environment: Setup:", contractsBuildDirectory);
    this.global.truffleTest = await TruffleTest.instance(contractsBuildDirectory);

    this.global.artifacts = this.global.truffleTest.artifacts;
    this.global.accounts = this.global.truffleTest.accounts;
    this.global.web3 = this.global.truffleTest.web3;
    this.global.runner = this.global.truffleTest.runner;

    return new Promise(resolve => {
      this.global.truffleTest.runner.initialize(resolve);
    });
  }
}

module.exports = TruffleEnvironment;
