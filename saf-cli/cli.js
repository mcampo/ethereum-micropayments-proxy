#!/usr/bin/env node

const config = require("config");
const log = require("debug")("saf:cli");
const stateStore = require("./stateStore");
const PaymentGenerator = require("./paymentGenerator");
const SAFClient = require("./client");

async function run() {
  const apiURI = config.get("saf.uri");
  const consumerPrivateKey = config.get("ethereum.consumerPrivateKey");
  const state = await stateStore.loadState();
  const channel = {
    consumerAddress: config.get("ethereum.consumerAddress"),
    state,
  };
  log("loaded state", state);

  const paymentGenerator = new PaymentGenerator({
    channel,
    consumerPrivateKey
  });
  const client = new SAFClient({ apiURI, paymentGenerator });

  const scores = await client.getScores();
  // log(scores);
  console.log(
    scores.map(
      matchResult =>
        `${matchResult.equipos[0].abreviacion} ${
          matchResult.equipos[0].score
        } - ${matchResult.equipos[1].score} ${
          matchResult.equipos[1].abreviacion
        }`
    )
  );

  await stateStore.saveState(state);
}

(async () => {
  try {
    await run();
  } catch (error) {
    log(error);
    console.log(error.message || error);
    process.exit(1);
  }
})();
