const log = require("debug")("proxy:channelsService");
const Account = require("eth-lib/lib/account");
const BigNumber = require("bignumber.js");

const store = {};
const stateStore = {
  get: consumerAddress => Promise.resolve(store[consumerAddress]),
  set: (consumerAddress, state) => {
    store[consumerAddress] = state;
    return Promise.resolve();
  }
};

class ChannelsService {
  constructor({ config, web3, SubscriptionContract }) {
    this.config = config;
    this.web3 = web3;
    this.SubscriptionContract = SubscriptionContract;
  }

  getContract() {
    const contractAddress = this.config.get("ethereum.contractAddress");
    try {
      return new this.web3.eth.Contract(this.SubscriptionContract.abi, contractAddress);
    } catch (error) {
      log("Error while getting contract", error);
      throw error;
    }
  };

  async getChannel(consumerAddress) {
    const contract = this.getContract();
    const { nonce, deposit, creditPrice } = await contract.methods
      .getChannel(consumerAddress)
      .call();

    return {
      consumerAddress,
      nonce,
      deposit: new BigNumber(deposit),
      creditPrice: new BigNumber(creditPrice)
    };
  };

  isValidSignature(signature, consumerAddress, channelNonce, credits) {
    const parametersHash = this.web3.utils.soliditySha3(
      channelNonce,
      credits.toString()
    );
    const ethPrefix = this.web3.utils.toHex("\x19Ethereum Signed Message:\n32");
    const messageHash = this.web3.utils.soliditySha3(ethPrefix, parametersHash);
    const recoveredAddress = Account.recover(messageHash, signature);
    return recoveredAddress.toLowerCase() === consumerAddress.toLowerCase();
  };

  async getState(channel) {
    return await stateStore.get(channel.consumerAddress);
  };

  async saveState(channel, state) {
    return await stateStore.set(channel.consumerAddress, state);
  };
}

module.exports = ChannelsService;