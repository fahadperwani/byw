"use strict";

const {
  verifyGooglePurchaseToken,
  verifyAppleTransactionId,
} = require("../../../utils/payment.js");

module.exports = {
  async makeGooglePayment(ctx) {
    try {
      const user = ctx.state.user;

      if (user.payment) {
        return ctx.badRequest("Payment already made");
      }

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
      const expiry = parseDate(purchaseData.expiryTimeMillis);
      // @ts-ignore
      const start = parseDate(purchaseData.purchaseTimeMillis);

      const payment = await strapi.documents("api::payment.payment").create({
        status: "published",
        data: {
          user: user.documentId,
          googleToken: purchaseToken,
          type: productId,
          expiry,
          start,
          status: "active",
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

      if (user.payment) {
        return ctx.badRequest("Payment already made");
      }

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
          status: "active",
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

      let payment = user.payment;

      // Calculate the current status
      const currentStatus = strapi
        .service("api::payment.payment")
        .calculatePaymentStatus(payment);

      // Update status if it has changed or doesn't exist
      if (!payment.status || payment.status !== currentStatus) {
        payment = await strapi.documents("api::payment.payment").update({
          documentId: payment.documentId,
          data: {
            // @ts-ignore
            status: currentStatus,
          },
        });
      }

      // Update user premium status based on payment status
      const shouldBePremium = currentStatus === "active";
      if (user.isPremium !== shouldBePremium) {
        await strapi.documents("plugin::users-permissions.user").update({
          documentId: user.documentId,
          data: {
            isPremium: shouldBePremium,
          },
        });
      }

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
