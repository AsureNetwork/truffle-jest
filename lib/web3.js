const Web3 = require("web3");

function createWeb3(provider) {
  const web3 = new Web3();
  web3.setProvider(provider);

  return web3;
}

function getAccounts(web3) {
  return new Promise(function(accept, reject) {
    web3.eth.getAccounts(function(err, accs) {
      if (err) return reject(err);
      accept(accs);
    });
  });
}

module.exports = {
  createWeb3,
  getAccounts
};
