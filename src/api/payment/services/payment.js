// @ts-nocheck
"use strict";

const {
  verifyGooglePurchaseToken,
  verifyAppleTransactionId,
} = require("../../../utils/payment");

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

  /**
   * Calculate the current status of a payment based on plan type and expiry
   * @param {Object} payment - The payment object
   * @returns {string} - The calculated status: 'active', 'expired', or 'consumed'
   */
  calculatePaymentStatus(payment) {
    const now = new Date();
    const isMonthlyPlan = payment.type && payment.type.includes("monthly");
    const isLifetimePlan = payment.type && payment.type.includes("lifetime");

    // If the current status is already consumed, keep it consumed
    if (payment.status === "consumed") {
      return "consumed";
    }

    // For monthly plans: check expiry date
    if (isMonthlyPlan) {
      if (payment.expiry) {
        const expiryDate = new Date(payment.expiry);
        if (now > expiryDate) {
          return "expired";
        }
      }
      return "active";
    }

    // For lifetime plans: status is determined by usage or external consumed flag
    if (isLifetimePlan) {
      // If marked as consumed, return consumed
      if (payment.status === "consumed") {
        return "consumed";
      }
      // Otherwise, lifetime plans remain active
      return "active";
    }

    // Default to active if no specific conditions met
    return "active";
  },
};
