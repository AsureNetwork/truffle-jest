// Setup logic for jest.
jest.setTimeout(15000);

// reset after every test case instead of every file
beforeEach(() => {
  return new Promise(resolve => {
    truffleTest.runner.initialize(resolve);
  });
});
