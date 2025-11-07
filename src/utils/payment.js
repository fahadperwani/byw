const PaymentError = require("./paymentError.js");

const client = require("../../appleClient.js");

const { google } = require("googleapis");
const auth = require("../../googleAuth.js");
const jwt = require("jsonwebtoken");

// Your app's package name, subscription ID, and purchase token
const packageName = process.env.PACKAGE_NAME;
const monthlyPackage = process.env.MONTHLY_PACKAGE;
const lifetimePackage = process.env.LIFETIME_PACKAGE;

// Function to verify the purchase token
async function verifyGooglePurchaseToken(purchaseToken, productId) {
  // Create an instance of the Android Publisher API
  const androidPublisher = google.androidpublisher({
    version: "v3",
    auth: auth,
  });

  if (![monthlyPackage, lifetimePackage].includes(productId)) {
    throw new Error("Invalid product ID");
  }

  let response;
  let purchaseData;
  console.log("Verifying product ID:", productId);

  if (productId === monthlyPackage) {
    console.log("Verifying subscription purchase");
    response = await androidPublisher.purchases.subscriptions.get({
      packageName: packageName,
      subscriptionId: productId,
      token: purchaseToken,
    });

    purchaseData = response.data;

    console.log("Purchase Data:", purchaseData);

    // Check if the purchase is valid
    if (purchaseData.paymentState !== 1) {
      throw new PaymentError(
        "Purchase is not valid or payment is pending/canceled."
      );
    }
  } else {
    // Ensure auth is a valid Google Auth client and parameters are correct
    response = await androidPublisher.purchases.products.get({
      packageName: packageName,
      productId: productId,
      token: purchaseToken,
    });

    purchaseData = response.data;
    console.log("Purchase Data:", purchaseData);

    if (purchaseData.purchaseState !== 0) {
      throw new PaymentError(
        "Purchase not completed. It may be pending or canceled."
      );
    }
  }

  return purchaseData;
}

async function verifyAppleTransactionId(transactionId) {
  try {
    const response = await client.getTransactionInfo(transactionId);

    const decoded = jwt.decode(response.signedTransactionInfo, {
      complete: true,
    });

    return decoded.payload;
  } catch (error) {
    console.error("Error verifying transaction:", error);
  }
}

module.exports = { verifyGooglePurchaseToken, verifyAppleTransactionId };
