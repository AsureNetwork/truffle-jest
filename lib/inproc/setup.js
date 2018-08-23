const mkdirp = require("mkdirp");
const getTmpDir = require("../getTmpDir");
const TruffleTest = require("../TruffleTest");
const ClearIntervalFix = require("../utils/ClearIntervalFix");

module.exports = async function setup() {
  global.__clearIntervalFix = new ClearIntervalFix(global);

  mkdirp.sync(getTmpDir());
  //global.__truffleTest = await TruffleTest.create(getTmpDir(), true);
};
