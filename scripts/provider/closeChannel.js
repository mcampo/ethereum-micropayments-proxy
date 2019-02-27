const config = require("config");
const Web3 = require("web3");
const { format } = require("url");
const SubscriptionsContract = require("../../contracts/build/contracts/Subscriptions");

const GAS_LIMIT = 6721975;

const ethereumNodeURI = format(config.get("ethereum.node.uri"));
const web3 = new Web3(ethereumNodeURI);

const providerAddress = config.get("ethereum.providerAddress");
const providerPrivateKey = config.get("ethereum.providerPrivateKey");
const contractAddress = config.get("ethereum.contractAddress");

const consumerAddress = process.argv[2];
const signedCredits = process.argv[3];
const signature = process.argv[4];

if (!consumerAddress || !signedCredits || !signature) {
  console.log('Usage: node closeChannel.js <consumerAddress> <signedCredits> <signature>');
  process.exit(1);
}

(async () => {
  try {
    const contract = new web3.eth.Contract(
      SubscriptionsContract.abi,
      contractAddress
    );
    const transactionData = contract.methods
      .closeChannel(consumerAddress, signedCredits, signature)
      .encodeABI();

    const transactionSignature = await web3.eth.accounts.signTransaction(
      {
        to: contractAddress,
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
