module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: env("SENDGRID_FROM_KEY"),
        defaultReplyTo: env("SENDGRID_TO_KEY"),
      },
    },
  },
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d', // Optional: Set token expiration time
      },
    },
  },
});
