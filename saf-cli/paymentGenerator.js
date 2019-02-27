const log = require("debug")("saf:PaymentGenerator");
const Account = require("eth-lib/lib/account");
const Web3 = require("web3");

class PaymentGenerator {
  constructor({ channel, consumerPrivateKey }) {
    this.channel = channel;
    this.consumerPrivateKey = consumerPrivateKey;
  }

  generatePaymentHeaders() {
    this.updateState();
    return this.getHeaders();
  }

  updateState() {
    const { state } = this.channel;
    state.consumedCredits = state.consumedCredits.plus(1);
  }

  getHeaders() {
    const {
      consumerAddress,
      state: { nonce, consumedCredits: credits }
    } = this.channel;
    const parametersHash = Web3.utils.soliditySha3(nonce, credits.toString());
    const ethPrefix = Web3.utils.toHex("\x19Ethereum Signed Message:\n32");
    const messageHash = Web3.utils.soliditySha3(ethPrefix, parametersHash);
    const signature = Account.sign(messageHash, this.consumerPrivateKey);
    log(`Generated signature for`, { nonce, credits: credits.toString() }, signature);

    return {
      "x-ethp-consumer-address": consumerAddress,
      "x-ethp-credits": credits.toString(),
      "x-ethp-signature": signature
    };
  }
}

module.exports = PaymentGenerator;
