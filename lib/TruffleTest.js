const TestRunner = require("truffle-core/lib/testing/testrunner");
const TestResolver = require("truffle-core/lib/testing/testresolver");
const TestSource = require("truffle-core/lib/testing/testsource");
const Profiler = require("truffle-compile/profiler.js");
const Contracts = require("truffle-workflow-compile");
const Resolver = require("truffle-resolver");
const Migrate = require("truffle-migrate");
const Config = require("truffle-config");
const start = require("./utils");
const { createWeb3, getAccounts } = require("./web3");

function performInitialDeploy(config, resolver) {
  return new Promise(function(accept, reject) {
    Migrate.run(
      config.with({
        reset: true,
        resolver: resolver,
        quiet: true
      }),
      function(err) {
        if (err) return reject(err);
        accept();
      }
    );
  });
}

function compileContractsWithTestFilesIfNeeded(
  solidity_test_files,
  config,
  test_resolver
) {
  return new Promise(function(accept, reject) {
    Profiler.updated(
      config.with({
        resolver: test_resolver
      }),
      function(err, updated) {
        if (err) return reject(err);

        updated = updated || [];

        // Compile project contracts and test contracts
        Contracts.compile(
          config.with({
            all: config.compileAll === true,
            files: updated.concat(solidity_test_files),
            resolver: test_resolver,
            quiet: false,
            quietWrite: true
          }),
          function(err, abstractions, paths) {
            if (err) return reject(err);
            accept(paths);
          }
        );
      }
    );
  });
}

class TruffleTest {
  static create(temporaryDirectory, startOnly) {
    return new Promise((resolve, reject) => {
      start(temporaryDirectory, startOnly, (err, options, cleanup) => {
        if (err) {
          console.error(err);
          reject(err);
        }

        const config = Config.default().merge(options);
        const web3 = createWeb3(config.provider);

        let accounts, test_resolver;

        getAccounts(web3)
          .then(accs => {
            accounts = accs;

            if (!config.from) {
              config.from = accounts[0];
            }
            if (!config.resolver) {
              config.resolver = new Resolver(config);
            }

            test_resolver = new TestResolver(
              config.resolver,
              new TestSource(config),
              config.contracts_build_directory
            );
            test_resolver.cache_on = false;

            return compileContractsWithTestFilesIfNeeded(
              [],
              config,
              test_resolver
            );
          })
          .then(() => {
            performInitialDeploy(config, test_resolver).then(() => {
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
      });
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
