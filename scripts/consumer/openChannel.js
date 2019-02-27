const config = require("config");
const Web3 = require("web3");
const { format } = require("url");
const SubscriptionsContract = require("../../contracts/build/contracts/Subscriptions");
const stateStore = require("../../saf-cli/stateStore");
const BN = Web3.utils.BN;

const ethereumNodeURI = format(config.get("ethereum.node.uri"));
const web3 = new Web3(ethereumNodeURI);

const GAS_LIMIT = 6721975;
const consumerAddress = config.get("ethereum.consumerAddress");
const contractAddress = config.get("ethereum.contractAddress");
const consumerPrivateKey = config.get("ethereum.consumerPrivateKey");

const creditPrice = "1";
const creditsToPurchase = "10";

(async () => {
  try {
    const contract = new web3.eth.Contract(
      SubscriptionsContract.abi,
      contractAddress
    );
    const transactionData = contract.methods.openChannel().encodeABI()
    const transaction = {
      to: contractAddress,
      from: consumerAddress,
      data: transactionData,
      value: new BN(creditPrice).mul(new BN(creditsToPurchase)),
      gas: GAS_LIMIT
    };
    
    const transactionSignature = await web3.eth.accounts.signTransaction(
      transaction,
      consumerPrivateKey
    );

    console.log("awaiting transaction");
    const receipt = await web3.eth.sendSignedTransaction(
      transactionSignature.rawTransaction
    );
    console.log("receipt", receipt);

    const channel = await contract.methods.getChannel(consumerAddress).call();
    console.log("channel", channel);

    stateStore.saveState({
      nonce: channel.nonce,
      consumedCredits: "0"
    });
  } catch (error) {
    console.log("error", error);
  }
})();
