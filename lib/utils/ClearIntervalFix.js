/*
 * truffle-contract/lib/handlers.js:setup() subscribes the confimation event.
 * web3-core-method/srv/index.js:startWatching() will use setInterval to fetch
 * confirmation if the provider does not support PUB/SUB. These pending intervals
 * prevent a clean shutdown. For now we store all clearInterval id's and clear
 * them after the tests are done.
 */
class ClearIntervalFix {
  constructor(global) {
    this.global = global;
    this.intervalIds = [];

    this.monkeyPatch();
  }

  monkeyPatch() {
    this.setInterval = this.global.setInterval;

    this.global.setInterval = (...args) => {
      const id = this.setInterval(...args);
      this.intervalIds.push(id);
      return id;
    };
  }

  clearOutstandingIntervals() {
    this.intervalIds.forEach(id => this.global.clearInterval(id));
  }
}

module.exports = ClearIntervalFix;
