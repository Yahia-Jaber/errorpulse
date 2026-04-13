const axios = require('axios');

function errorPulse(options = {}) {
  const { webhookUrl, licenseKey, projectName = 'My App' } = options;

  return async function(err, req, res, next) {
    if (err.status === 500 || !err.status) {
      const payload = {
        text: `🚨 *500 Error* in *${projectName}*`,
        attachments: [{
          color: '#FF0000',
          fields: [
            { title: 'Route', value: `${req.method} ${req.path}`, short: true },
            { title: 'Error', value: err.message, short: false },
            { title: 'Time', value: new Date().toISOString(), short: true }
          ]
        }]
      };

      if (webhookUrl) {
        await axios.post(webhookUrl, payload).catch(() => {});
      }
    }
    next(err);
  };
}

module.exports = errorPulse;
