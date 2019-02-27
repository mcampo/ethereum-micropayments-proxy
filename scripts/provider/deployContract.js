const config = require("config");
const Web3 = require('web3');
const { format } = require('url');
const SubscriptionsContract = require("../../contracts/build/contracts/Subscriptions");

const GAS_LIMIT = 6721975;

const ethereumNodeURI = format(config.get("ethereum.node.uri"));
const web3 = new Web3(ethereumNodeURI);

const providerAddress = config.get("ethereum.providerAddress");
const providerPrivateKey = config.get("ethereum.providerPrivateKey");

const initialCreditPrice = "1";

(async () => {
  try {
    const contract = new web3.eth.Contract(SubscriptionsContract.abi);
    const transactionData = contract
      .deploy({
        data: SubscriptionsContract.bytecode,
        arguments: [providerAddress, initialCreditPrice]
      })
      .encodeABI();

    const transactionSignature = await web3.eth.accounts.signTransaction(
      {
        from: providerAddress,
        data: transactionData,
        gas: GAS_LIMIT
      },
      providerPrivateKey
    );

    console.log("awaiting transaction");
    const receipt = await web3.eth.sendSignedTransaction(
      transactionSignature.rawTransaction
    );
    console.log(receipt);
  } catch (error) {
    console.log("error", error);
  }
})();
