const NodeEnvironment = require("jest-environment-node");
const TruffleTest = require("../TruffleTest");
const ClearIntervalFix = require("../utils/ClearIntervalFix");
const getTmpDir = require("../getTmpDir");

class TruffleEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    this.global.__clearIntervalFix = new ClearIntervalFix(global);
    this.global.__truffleTest = await TruffleTest.create(getTmpDir(), null, true);

    this.global.artifacts = this.global.__truffleTest.artifacts;
    this.global.accounts = this.global.__truffleTest.accounts;
    this.global.web3 = this.global.__truffleTest.web3;
    this.global.runner = this.global.__truffleTest.runner;

    return new Promise(resolve => {
      this.global.__truffleTest.runner.initialize(resolve);
    });
  }

  async teardown() {
    await super.teardown();
    this.global.__clearIntervalFix.clearOutstandingIntervals();
    this.global.__truffleTest.cleanup();
  }
}

module.exports = TruffleEnvironment;
