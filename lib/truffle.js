const Contracts = require("truffle-workflow-compile");
const Migrate = require("truffle-migrate");
const Profiler = require("truffle-compile/profiler.js");

function compile(solidity_test_files, config, test_resolver) {
  return new Promise((resolve, reject) => {
    Profiler.updated(
      config.with({
        resolver: test_resolver
      }),
      (err, updated) => {
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
          (err, abstractions, paths) => {
            if (err) return reject(err);
            resolve(paths);
          }
        );
      }
    );
  });
}

function deploy(config, resolver) {
  return new Promise((resolve, reject) => {
    Migrate.run(
      config.with({
        reset: true,
        resolver: resolver,
        quiet: true
      }),
      err => {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    );
  });
}

module.exports = {
  compile,
  deploy
};
