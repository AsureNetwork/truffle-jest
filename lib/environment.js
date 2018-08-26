const NodeEnvironment = require("jest-environment-node");
const Config = require("truffle-config");
const Resolver = require("truffle-resolver");
const TestRunner = require("truffle-core/lib/testing/testrunner");
const TestResolver = require("truffle-core/lib/testing/testresolver");
const TestSource = require("truffle-core/lib/testing/testsource");

const ClearIntervalFix = require("./utils/ClearIntervalFix");
const getTmpDir = require("./getTmpDir");
const start = require("./utils").start;
const { createWeb3, getAccounts } = require("./web3");

async function setup() {
  const startResult = await start(getTmpDir());
  const config = Config.default().merge(startResult.config);
  const web3 = createWeb3(config.provider);

  const accounts = await getAccounts(web3);

  if (!config.resolver) {
    config.resolver = new Resolver(config);
  }

  test_resolver = new TestResolver(
    config.resolver,
    new TestSource(config),
    config.contracts_build_directory
  );
  test_resolver.cache_on = false;

  return {
    config: config,
    web3: web3,
    accounts: accounts,
    test_resolver: test_resolver,
    artifacts: {
      require: import_path => {
        return test_resolver.require(import_path);
      }
    },
    runner: new TestRunner(config),
    cleanup: startResult.cleanup
  };
}

async function setupCached() {
  if (!global.__cached) {
    global.__cached = await setup();
  }

  return global.__cached;
}

class TruffleEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    this.global.__clearIntervalFix = new ClearIntervalFix(global);
    try {
      Object.assign(this.global, await setupCached());
    } catch(err) {
      console.error(err);
      throw err;
    }

    return new Promise(resolve => {
      this.global.runner.initialize(resolve);
    });
  }

  async teardown() {
    await super.teardown();
    this.global.__clearIntervalFix.clearOutstandingIntervals();
    if(this.global.cleanup) {
      this.global.cleanup();
    }
  }
}

module.exports = TruffleEnvironment;
