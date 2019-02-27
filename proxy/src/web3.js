const Web3 = require("web3");
const { format } = require("url");

module.exports = function createWeb3({ config }) {
  const ethereumNodeURI = format(config.get("ethereum.node.uri"));
  return new Web3(ethereumNodeURI);
};
