const Test = artifacts.require("Test");

describe("Test2", () => {
  test("show should return 0", async () => {
    const instance = await Test.deployed();
    const result = await instance.show.call();

    expect(result.toNumber()).toEqual(0);
  });

  test("should increment", async () => {
    const instance = await Test.deployed();

    await instance.increment();
    await instance.increment();

    const result = await instance.show.call();

    expect(result.toNumber()).toEqual(2);
  });


  test("should increment 3", async () => {
    const instance = await Test.deployed();

    await instance.increment();
    await instance.increment();
    await instance.increment();

    const result = await instance.show.call();

    expect(result.toNumber()).toEqual(3);
  });
});
