const NodeEnvironment = require("jest-environment-node");
const Config = require("truffle-config");
const Resolver = require("truffle-resolver");
const TestRunner = require("truffle-core/lib/testing/testrunner");
const TestResolver = require("truffle-core/lib/testing/testresolver");
const TestSource = require("truffle-core/lib/testing/testsource");

const ClearIntervalFix = require("../utils/ClearIntervalFix");
const getTmpDir = require("../getTmpDir");
const startInProc = require("../utils").startInProc;
const { createWeb3, getAccounts } = require("../web3");
const { deploy } = require("../truffle");


async function setup() {
  try {
    const startResult = await startInProc(getTmpDir());
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

    await deploy(config, test_resolver);
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
      runner: new TestRunner(config)
    };
  } catch(err) {
    console.error(err);
    throw err;
  }
}

class TruffleEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    this.global.__clearIntervalFix = new ClearIntervalFix(global);
    Object.assign(this.global, await setup());

    return new Promise(resolve => {
      this.global.runner.initialize(resolve);
    });
  }

  async teardown() {
    await super.teardown();
    this.global.__clearIntervalFix.clearOutstandingIntervals();
  }
}

module.exports = TruffleEnvironment;
