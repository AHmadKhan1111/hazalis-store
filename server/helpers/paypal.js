const paypal = require("paypal-rest-sdk");
const config = require("../config/config");

paypal.configure({
  mode: config.paypal.mode,
  client_id: config.paypal.clientId,
  client_secret: config.paypal.clientSecret,
});

module.exports = paypal;
