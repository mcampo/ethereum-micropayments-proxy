const express = require("express");
const logger = require("morgan");

module.exports = function createApp({ proxyRouter, paymentValidationMiddleware }) {
  const app = express();

  app.use(logger("dev"));
  app.use(express.urlencoded({ extended: false }));
  
  app.use("/", paymentValidationMiddleware, proxyRouter);
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.end(error.message || 'Internal server error');
  });
    
  return app;
};
