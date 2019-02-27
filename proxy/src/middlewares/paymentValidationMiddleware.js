const errors = require("http-errors");
const BigNumber = require("bignumber.js");
const log = require("debug")("proxy:paymentValidationMiddleware");

module.exports = function createPaymentValidationMiddleware({
  channelsService
}) {
  return async function paymentValidationMiddleware(req, res, next) {
    try {
      await validateRequest(req);
    } catch (error) {
      log(error);
      next(error);
      return;
    }
    next();
  };

  async function validateRequest(req) {
    log("validating request");

    // check request headers
    const consumerAddress = req.get("x-ethp-consumer-address");
    const credits = new BigNumber(req.get("x-ethp-credits"));
    const signature = req.get("x-ethp-signature");
    log("header data", { consumerAddress, credits, signature });

    if (!consumerAddress || credits.isNaN() || !signature) {
      throw new errors.BadRequest("Missing x-ethp headers");
    }

    // check for an open channel
    const channel = await channelsService.getChannel(consumerAddress);
    log("channel", channel);
    if (channel.deposit.isZero()) {
      throw new errors.PaymentRequired("No open channel");
    }

    // check if signature is valid
    const isValidSignature = channelsService.isValidSignature(
      signature,
      consumerAddress,
      channel.nonce,
      credits
    );
    if (!isValidSignature) {
      throw new errors.BadRequest("Invalid signature");
    }

    // check last signed state for channel
    const lastState = await channelsService.getState(channel);
    log("lastState", lastState);
    if (lastState && credits.isLessThanOrEqualTo(lastState.credits)) {
      throw new errors.BadRequest(
        `Credits value must be greater than previous request (${
          lastState.credits
        })`
      );
    }

    // check if credits <= channel balance
    const maxCreditsAvailable = channel.deposit.dividedToIntegerBy(
      channel.creditPrice
    );
    log("maxCreditsAvailable", maxCreditsAvailable);
    if (credits.isGreaterThan(maxCreditsAvailable)) {
      throw new errors.PaymentRequired("Exceeded available credits");
    }

    // save signature as last signature for channel
    await channelsService.saveState(channel, { credits });
  }
};
