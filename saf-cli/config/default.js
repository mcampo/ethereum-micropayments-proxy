module.exports = {
  saf: {
    uri: {
      protocol: process.env.API_PROTOCOL,
      hostname: process.env.API_HOSTNAME,
      port: parseInt(process.env.API_PORT),
      pathname: process.env.API_PATHNAME
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
    consumerAddress: process.env.ETHEREUM_CONSUMER_ADDRESS,
    consumerPrivateKey: process.env.ETHEREUM_CONSUMER_PRIVATE_KEY
  }
};
