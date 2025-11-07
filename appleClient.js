const fs = require("fs");
const {
  AppStoreServerAPIClient,
  Environment,
} = require("@apple/app-store-server-library");
const jwt = require("jsonwebtoken");

const issuerId = process.env.APPLE_ISSUER_ID;
const keyId = process.env.APPLE_KEY_ID;
const bundleId = process.env.PACKAGE_NAME;
const privateKeyPath = process.env.APPLE_KEY_PATH;
const environment = process.env.ENVIRONMENT || "prod";

// Read the private key
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

// Initialize the AppStoreServerAPIClient
const client = new AppStoreServerAPIClient(
  privateKey,
  keyId,
  issuerId,
  bundleId,
  environment === "prod" ? Environment.PRODUCTION : Environment.SANDBOX
);

module.exports = client;
