"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/payment/google/make",
      handler: "payment.makeGooglePayment",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/payment/apple/make",
      handler: "payment.makeApplePayment",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/payment/get",
      handler: "payment.getPayment",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
