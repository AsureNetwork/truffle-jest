pragma solidity ^0.4.23;

contract Test {
  int num;

  function show() public view returns (int) {
    //revert();
    return num;
  }

  function increment() public returns (int) {
    num++;

    return num;
  }
}
