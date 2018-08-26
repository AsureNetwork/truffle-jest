const TestRunner = require("truffle-core/lib/testing/testrunner");
const TestResolver = require("truffle-core/lib/testing/testresolver");
const TestSource = require("truffle-core/lib/testing/testsource");
const Profiler = require("truffle-compile/profiler.js");
const Contracts = require("truffle-workflow-compile");
const Resolver = require("truffle-resolver");
const Migrate = require("truffle-migrate");
const Config = require("truffle-config");
const start = require("./utils").start;
const startInProc = require("./utils").startInProc;
const { createWeb3, getAccounts } = require("./web3");
const { compile, deploy } = require("./truffle");


class TruffleTest {
  static create(temporaryDirectory, startOnly, shouldStartInProc) {
    return new Promise((resolve, reject) => {
      const onStart = (err, options, cleanup) => {
        if (err) {
          console.error(err);
          reject(err);
        }

        const config = Config.default().merge(options);

        let web3 = createWeb3(config.provider);

        let accounts, test_resolver;

        getAccounts(web3)
          .then(accs => {
            accounts = accs;

            if (!config.resolver) {
              config.resolver = new Resolver(config);
            }

            test_resolver = new TestResolver(
              config.resolver,
              new TestSource(config),
              config.contracts_build_directory
            );
            test_resolver.cache_on = false;

            return compile(
              [],
              config,
              test_resolver
            );
          })
          .then(() => {
            deploy(config, test_resolver).then(() => {
              resolve(
                new TruffleTest({
                  config,
                  web3,
                  accounts,
                  test_resolver,
                  cleanup
                })
              );
            });
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
      }

      if(shouldStartInProc) {
        startInProc(temporaryDirectory, onStart);
      } else {
        start(temporaryDirectory, startOnly, onStart);
      }
    });
  }

  constructor(options) {
    Object.assign(this, options);

    this.runner = new TestRunner(this.config);
  }

  get artifacts() {
    return {
      require: import_path => {
        return this.test_resolver.require(import_path);
      }
    };
  }
}

module.exports = TruffleTest;
