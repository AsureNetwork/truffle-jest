const mkdirp = require("mkdirp");
const Config = require("truffle-config");
const Resolver = require("truffle-resolver");
const TestResolver = require("truffle-core/lib/testing/testresolver");
const TestSource = require("truffle-core/lib/testing/testsource");
const getTmpDir = require("../getTmpDir");
const { compile } = require("../truffle");
const { getConfig } = require("../utils");
const ClearIntervalFix = require("../utils/ClearIntervalFix");

module.exports = async function setup() {
  global.__clearIntervalFix = new ClearIntervalFix(global);

  const contractBuildDir = getTmpDir();
  mkdirp.sync(contractBuildDir);

  const config = Config.default().merge(
    getConfig().with({
      test_files: [],
      contracts_build_directory: contractBuildDir
    })
  );

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
};
