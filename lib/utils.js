const fs = require("fs");
const OS = require("os");
const util = require("util");

const Config = require("truffle-config");
const Artifactor = require("truffle-artifactor");
const Environment = require("truffle-core/lib/environment");
const Develop = require("truffle-core/lib/develop");
const copy = require("truffle-core/lib/copy");
const createGanacheProvider = require("ganache-core").provider;
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const getTmpDir = require("./getTmpDir");

function getConfig() {
  const config = Config.detect({ workingDirectory: process.cwd() });

  // if "development" exists, default to using that for testing
  if (!config.network && config.networks.development) {
    config.network = "development";
  }

  if (!config.network) {
    config.network = "test";
  }

  // Override console.warn() because web3 outputs gross errors to it.
  // e.g., https://github.com/ethereum/web3.js/blob/master/lib/web3/allevents.js#L61
  // Output looks like this during tests: https://gist.github.com/tcoulter/1988349d1ec65ce6b958
  var warn = config.logger.warn;
  config.logger.warn = function(message) {
    if (message !== "cannot find event for log" && warn) {
      warn.apply(console, arguments);
    }
  };

  config.logger = console;

  return config;
}

const startDevelop = util.promisify(Develop.start);
const connectDevelop = util.promisify(Develop.connect);
const stat = util.promisify(fs.stat);
const detectEnvironment  = util.promisify(Environment.detect);
const developEnvironment  = util.promisify(Environment.develop);
const copyAsync = util.promisify(copy);

function start(temporaryDirectory, startOnly, done) {
  const config = getConfig();
  let ipcDisconnect;

  if (config.networks[config.network]) {
    await detectEnvironment(config);
  } else {
    const ipcOptions = {
      network: "test"
    };

    const testrpcOptions = {
      host: "127.0.0.1",
      port: 7545,
      network_id: 4447,
      mnemonic:
        "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
      gasLimit: config.gas //,
      noVMErrorsOnRPCResponse: true
    };

    if (startOnly) {
      await startDevelop(ipcOptions, testrpcOptions)
    } else {
      ipcDisconnect = await connectDevelop(ipcOptions)
    }
    await developEnvironment(config, testrpcOptions);
  }

  try {
    await stat(config.contracts_build_directory)
    await copyAsync(config.contracts_build_directory, temporaryDirectory);
  } catch(err) {
  }

  config.logger.log("Using network '" + config.network + "'." + OS.EOL);

  // Set a new artifactor; don't rely on the one created by Environments.
  // TODO: Make the test artifactor configurable.
  config.artifactor = new Artifactor(temporaryDirectory);

  return {
    config: config.with({
      test_files: [],
      contracts_build_directory: temporaryDirectory
    }),
    cleanup: () => {
      if (ipcDisconnect) {
        ipcDisconnect();
      }
    }
  };
}


async function startInProc(temporaryDirectory) {
  const config = getConfig();

  const provider = createGanacheProvider();
  const network = "inproc";
  config.networks[network] = {
    network_id: "*",
    provider: function() {
      return provider;
    }
  };
  config.network = network;

  await detectEnvironment(config);
  try {
    await stat(config.contracts_build_directory)
    await copyAsync(config.contracts_build_directory, temporaryDirectory);
  } catch(err) {
  }

  config.logger.log("Using network '" + config.network + "'." + OS.EOL);

  // Set a new artifactor; don't rely on the one created by Environments.
  // TODO: Make the test artifactor configurable.
  config.artifactor = new Artifactor(temporaryDirectory);

  return {
    config: config.with({
      test_files: [],
      contracts_build_directory: temporaryDirectory
    }),
    cleanup: () => {}
  };
}

module.exports = {
  start,
  startInProc,
  getConfig
};
