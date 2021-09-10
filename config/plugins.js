module.exports = ({ env }) => ({
  email: {
    provider: 'sendgrid',
    providerOptions: {
      apiKey: env('SENDGRID_API_KEY'),
    },
    settings: {
      defaultFrom: 'admin@studytogether.com',
      defaultReplyTo: 'admin@studytogether.com',
      testAddress: 'yuyaebean@gmail.com',
    },
  },
});
