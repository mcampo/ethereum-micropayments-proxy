const os = require("os");
const fs = require("fs");
const util = require("util");
const path = require("path");
const BigNumber = require("bignumber.js");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const STORED_STATE_PATH = path.join(os.homedir(), ".saf-cli");

async function loadState() {
  try {
    const storedState = JSON.parse(await readFile(STORED_STATE_PATH));
    return {
      ...storedState,
      consumedCredits: new BigNumber(storedState.consumedCredits)
    };
  } catch (error) {
    log(error);
    throw error;
  }
}

async function saveState(state) {
  try {
    await writeFile(STORED_STATE_PATH, JSON.stringify(state, null, 2) + "\n");
  } catch (error) {
    log(error);
  }
}

module.exports = {
  loadState,
  saveState
};
