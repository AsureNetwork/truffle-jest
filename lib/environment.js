const NodeEnvironment = require("jest-environment-node");
const TruffleTest = require("./TruffleTest");
const getTmpDir = require("./getTmpDir");

class TruffleEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    this.global.truffleTest = await TruffleTest.instance(getTmpDir());

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
