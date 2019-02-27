module.exports = {
  target: {
    uri: {
      protocol: process.env.TARGET_PROTOCOL,
      hostname: process.env.TARGET_HOSTNAME,
      port: parseInt(process.env.TARGET_PORT),
      pathname: process.env.TARGET_PATHNAME
    }
  },
  ethereum: {
    node: {
      uri: {
        protocol: process.env.ETHEREUM_NODE_PROTOCOL,
        hostname: process.env.ETHEREUM_NODE_HOSTNAME,
        port: parseInt(process.env.ETHEREUM_NODE_PORT),
        pathname: process.env.ETHEREUM_NODE_PATHNAME
      }
    },
    contractAddress: process.env.ETHEREUM_CONTRACT_ADDRESS
  }
};
