module.exports = {
  ethereum: {
    node: {
      uri: {
        protocol: process.env.ETHEREUM_NODE_PROTOCOL,
        hostname: process.env.ETHEREUM_NODE_HOSTNAME,
        port: parseInt(process.env.ETHEREUM_NODE_PORT),
        pathname: process.env.ETHEREUM_NODE_PATHNAME
      }
    },
    contractAddress: process.env.ETHEREUM_CONTRACT_ADDRESS,
    consumerAddress: process.env.ETHEREUM_CONSUMER_ADDRESS,
    consumerPrivateKey: process.env.ETHEREUM_CONSUMER_PRIVATE_KEY,
    providerAddress: process.env.ETHEREUM_PROVIDER_ADDRESS,
    providerPrivateKey: process.env.ETHEREUM_PROVIDER_PRIVATE_KEY
  }
};
