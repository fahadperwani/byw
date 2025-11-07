"use strict";

const {
  verifyGooglePurchaseToken,
  verifyAppleTransactionId,
} = require("../../../utils/payment.js");

module.exports = {
  async makeGooglePayment(ctx) {
    try {
      const user = ctx.state.user;

      const { purchaseToken, productId } = ctx.request.body;

      const purchaseData = await verifyGooglePurchaseToken(
        purchaseToken,
        productId
      );
      // let expiry = null;
      // // @ts-ignore
      // if (purchaseData.expiryTimeMillis) {
      //   // @ts-ignore
      //   console.log("Expiry time:", purchaseData.expiryTimeMillis);
      //   // @ts-ignore
      //   expiry = new Date(Number(purchaseData.expiryTimeMillis));
      // }

      // @ts-ignore
      let expiry = parseDate(purchaseData.expiryTimeMillis);
      // @ts-ignore
      const start = parseDate(purchaseData.purchaseTimeMillis);

      if (productId === "com.bridalyourway.mobile.staging.lifetime") {
        const exp = Date.now() + 18 * 30 * 24 * 60 * 60 * 1000; // 18 months
        expiry = new Date(exp).toISOString();
      }

      const payment = await strapi.documents("api::payment.payment").create({
        status: "published",
        data: {
          user: user.documentId,
          googleToken: purchaseToken,
          type: productId,
          expiry,
          start,
        },
      });

      return ctx.send({ message: "Payment made successfully", payment });
    } catch (error) {
      console.error("Error making payment:", error);
      if (error.name === "PaymentError") {
        return ctx.badRequest(error.message);
      }

      return ctx.internalServerError("Error making payment", { error });
    }
  },

  async makeApplePayment(ctx) {
    try {
      const user = ctx.state.user;

      const { purchaseToken: transactionId } = ctx.request.body;

      const purchaseData = await verifyAppleTransactionId(transactionId);
      let expiry = null;

      // @ts-ignore
      if (purchaseData.expiresDate) {
        // @ts-ignore
        expiry = new Date(Number(purchaseData.expiresDate));
      }

      const payment = await strapi.documents("api::payment.payment").create({
        status: "published",
        data: {
          user: user.documentId,
          appleId: transactionId,
          // @ts-ignore
          type: purchaseData.productId,
          expiry,
          // @ts-ignore
          start: new Date(Number(purchaseData.purchaseDate)),
        },
      });

      return ctx.send({ message: "Payment made successfully", payment });
    } catch (error) {
      return ctx.internalServerError("Error making payment", { error });
    }
  },

  async getPayment(ctx) {
    try {
      const user = ctx.state.user;

      if (!user.payment) {
        return ctx.notFound("Payment not found");
      }

      // @ts-ignore
      let expiry = new Date(user.payment.expiry);
      let payment = user.payment;
      if (expiry && expiry < new Date()) {
        if (payment.type === "com.bridalyourway.mobile.staging.lifetime") {
          return ctx.conflict("Lifetime subscription has been consumed");
        }

        const updated = await strapi
          .service("api::payment.payment")
          .verifyAndUpdatePaymentExpiry(payment);
        if (!updated) {
          if (user.isPremium)
            await strapi.documents("plugin::users-permissions.user").update({
              documentId: user.documentId,
              data: {
                isPremium: false,
              },
            });
          return ctx.gone("Payment has expired");
        }
        payment = await strapi.documents("api::payment.payment").update({
          documentId: user.payment.documentId,
          data: {
            expiry: parseDate(updated.expiry),
            start: parseDate(updated.start),
          },
        });
      }

      if (!user.isPremium)
        await strapi.documents("plugin::users-permissions.user").update({
          documentId: user.documentId,
          data: {
            isPremium: true,
          },
        });
      return ctx.send(payment);
    } catch (error) {
      console.log("Error fetching payment:", error);
      return ctx.internalServerError("Error fetching payment", { error });
    }
  },
};

const parseDate = (ms) => {
  const num = Number(ms);
  if (isNaN(num)) return null;
  const date = new Date(num);
  return isNaN(date.getTime()) ? null : date.toISOString();
};
