const axios = require('axios');
async function validateLicense(key) {
  if (!key) return false;

  try {
    const res = await axios.post('https://api.gumroad.com/v2/licenses/verify', {
      product_id: 'YOUR_PRODUCT_ID',
      license_key: key
    });

    return res.data.success;
  } catch {
    return false;
  }
}
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

const isPro = await validateLicense(licenseKey);

if (webhookUrl) {
  await axios.post(webhookUrl, payload).catch(() => {});
}

// PRO feature example (Discord)
if (isPro && options.discordWebhookUrl) {
  await axios.post(options.discordWebhookUrl, {
    content: `🚨 ${projectName}: ${err.message}`
  }).catch(() => {});
}
    }
    next(err);
  };
}

module.exports = errorPulse;
