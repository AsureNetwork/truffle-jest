const mkdirp = require("mkdirp");

const Config = require("truffle-config");
const TestResolver = require("truffle-core/lib/testing/testresolver");
const TestSource = require("truffle-core/lib/testing/testsource");
const Resolver = require("truffle-resolver");
const getTmpDir = require("./getTmpDir");
const ClearIntervalFix = require("./utils/ClearIntervalFix");
const start = require("./utils").start;
const { compile, deploy } = require("./truffle");

module.exports = async function setup() {
  global.__clearIntervalFix = new ClearIntervalFix(global);

  const contractBuildDir = getTmpDir();
  mkdirp.sync(contractBuildDir);

  try {
    const startResult = await start(contractBuildDir, true);
    global.cleanup = startResult.cleanup;

    const config = Config.default().merge(startResult.config);
    if (!config.resolver) {
      config.resolver = new Resolver(config);
    }

    test_resolver = new TestResolver(
      config.resolver,
      new TestSource(config),
      config.contracts_build_directory
    );
    test_resolver.cache_on = false;

    await compile([], config, test_resolver);
    await deploy(config, test_resolver);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
