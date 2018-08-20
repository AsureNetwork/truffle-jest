const TruffleTest = require("./TruffleTest");

module.exports = async function setup() {
  global.__truffleTest = await TruffleTest.instance();
};
