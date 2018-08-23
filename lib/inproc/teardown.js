const rimraf = require("rimraf");
const getTmpDir = require("../getTmpDir");

const deleteTmpDir = () => {
  return new Promise(resolve => {
    rimraf(getTmpDir(), resolve);
  });
};

module.exports = async function teardown() {
  global.__clearIntervalFix.clearOutstandingIntervals();

  //global.__truffleTest.cleanup();
  await deleteTmpDir();
};
