module.exports = async function teardown() {
  await global.__truffleTest.cleanup();
};
