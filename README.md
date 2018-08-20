# truffle-testing-addon

**DO NOT use this for any serious development**

Experimenting with truffle test execution. In particular we would
like to execute truffle tests with the standard mocha cli instead of
useing `truffle test`.

Advantages that we're most interested in are

  - executing only some tests
  - easy IDE integration
  
Current flaws

  - doss not support tests written in solidity 
  - truffle compile must be executed before test execution
  - usage kinda sucks at the moment / feels bad

## How to use

```bash
mocha
mocha --grep "^Test"
mocha --grep "^Test" --watch
```

```solidity
pragma solidity ^0.4.23;

contract Test {
  int num;

  function show() public view returns (int) {
    return num;
  }

  function increment() public returns (int) {
    num++;

    return num;
  }
}
```

```js
const assert = require("assert");
const truffleTestPromise = require("truffle-testing-addon");

let truffleTest, Test;
before(async function() {
  this.timeout(10000);
  truffleTest = await truffleTestPromise;
  Test = truffleTest.artifacts.require("Test");
});

describe("Test", () => {
  before(function(done) {
    truffleTest.addHooks(this, done);
  });

  it("show should return 0", async () => {
    const instance = await Test.deployed();
    const result = await instance.show.call();

    assert.strictEqual(result.toNumber(), 0);
  });

  it("Test 2", async () => {
    const instance = await Test.deployed();

    await instance.increment();
    await instance.increment();

    const result = await instance.show.call();

    assert.strictEqual(result.toNumber(), 2);
  });
});
```
