const TestRunner = require("jest-runner");

/**
 * TestRunner that runs always in band.
 */
class TruffleJestTestRunner extends TestRunner {
  async runTests(tests, watcher, onStart, onResult, onFailure, options) {
    return await this._createInBandTestRun(
      tests,
      watcher,
      onStart,
      onResult,
      onFailure
    );
  }
}

module.exports = TruffleJestTestRunner;
