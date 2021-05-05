const Wallet = artifacts.require("Wallet");

module.exports = async function (deployer, _net, accts) {
  await deployer.deploy(Wallet, [accts[0], accts[1], accts[2]], 2);
  const wallet = await Wallet.deployed();
  await web3.eth.sendTransaction({ from: accts[0], to: wallet.address, value: 1000000000000000000 });
};

