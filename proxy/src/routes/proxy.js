const { format } = require("url");
const express = require("express");
const httpProxy = require("http-proxy");
const log = require("debug")("proxy:routes:proxy");

module.exports = function createProxyRouter({ config }) {
  const router = express.Router();
  const proxy = httpProxy.createProxyServer({});
  const targetURI = format(config.get("target.uri"));

  router.get("/*", async (req, res) => {
    proxy.web(req, res, {
      changeOrigin: true,
      target: targetURI
    });
  });

  return router;
};
