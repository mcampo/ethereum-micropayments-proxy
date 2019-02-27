const fetch = require("node-fetch");
const { format } = require("url");

class SAFClient {
  constructor({ apiURI, paymentGenerator }) {
    this.apiURI = apiURI;
    this.paymentGenerator = paymentGenerator;
  }

  async getScores() {
    const uri = format({
      ...this.apiURI,
      pathname: `${this.apiURI.pathname}rest/fechas/8`
    });
    const headers = this.paymentGenerator.generatePaymentHeaders();
    const response = await fetch(uri, { headers });
    if (response.status !== 200) {
      const errorMessage = (await response.text()) || response.statusText;
      throw new Error(errorMessage);
    }

    return response.json();
  }
}

module.exports = SAFClient;