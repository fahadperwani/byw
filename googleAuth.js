const { GoogleAuth } = require("google-auth-library");

const auth = new GoogleAuth({
  keyFile: process.env.GOOGLE_KEY_PATH,
  scopes: ["https://www.googleapis.com/auth/androidpublisher"],
});

module.exports = auth;
