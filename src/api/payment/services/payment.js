// @ts-nocheck
"use strict";

const { verifyGooglePurchaseToken } = require("../../../utils/payment");

module.exports = {
  async verifyAndUpdatePaymentExpiry(payment) {
    try {
      let purchaseData;
      let newExpiry = null;

      if (payment.googleToken) {
        purchaseData = await verifyGooglePurchaseToken(
          payment.googleToken,
          payment.type
        );
        newExpiry = new Date(Number(purchaseData.expiryTimeMillis));
        if (newExpiry < new Date()) return null;
        return {
          expiry: newExpiry,
          start: new Date(Number(purchaseData.purchaseTimeMillis)),
        };
      }

      if (payment.appleId) {
        purchaseData = await verifyAppleTransactionId(payment.appleId);
        newExpiry = new Date(Number(purchaseData.expiresDate));
        if (newExpiry < new Date()) return null;
        return {
          expiry: newExpiry,
          start: new Date(Number(purchaseData.purchaseDate)),
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  },
};
