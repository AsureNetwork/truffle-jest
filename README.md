# truffle-jest

Run your truffle tests with the standard [Jest](https://jestjs.io/docs/en/configuration)
test runner instead of `truffle test`.

**NOTE: This implementation is still very much a work in progress.** It
can be used for testing, but it should not be used for any
serious development yet.

## Example

![Image of Webstorm and Tests](https://github.com/AsureFoundation/truffle-jest/blob/master/screenshot.png)

## How to setup?

Please take a look a [the example](https://github.com/AsureFoundation/truffle-jest/tree/master/example).

```bash
mkdir demo
cd demo

truffle init
npm init -y
npm install --save truffle-jest
```

```json
{
  "scripts": {
    "test": "jest --runInBand"
  }
}
```

```js
// jest.config.js

module.exports = {
  verbose: true,
  setupTestFrameworkScriptFile: "./jest.setup.js",
  globalSetup: "truffle-jest/lib/setup",
  globalTeardown: "truffle-jest/lib/teardown",
  testEnvironment: "truffle-jest/lib/environment"
};
```

```js
// jest.setup.js

jest.setTimeout(15000);

// Optional: Reset clean room after every test instead of every file
beforeEach(() => {
  return new Promise(resolve => {
    runner.initialize(resolve);
  });
});
```

## Motivation

At Asure, we where experimenting with truffle test execution. In particular
we wanted to execute truffle tests with the standard test runner instead of
using `truffle test` have all features of the test runner available.

Advantages that we're most interested in are

- executing only some tests instead of all
- easy IDE integration (WebStorm, etc.)
- clean room environment per test instead of hole test suite possible

The current flaws are

- does not support tests written in solidity
- no event logs on failed tests
