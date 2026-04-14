const axios = require('axios');

let _licenseCache = null; // cache result for process lifetime

async function validateLicense(key) {
  if (!key) return false;
  if (_licenseCache !== null) return _licenseCache; // already checked

  try {
    const res = await axios.post('https://api.gumroad.com/v2/licenses/verify', {
      product_id: 'YOUR_PRODUCT_ID',
      license_key: key
    });
    _licenseCache = res.data.success === true;
    return _licenseCache;
  } catch {
    return false; // fail open — never crash
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

// PRO — Discord (rich embed)
if (isPro && options.discordWebhookUrl) {
  await axios.post(options.discordWebhookUrl, {
    embeds: [{
      title: `🚨 500 Error — ${projectName}`,
      color: 16711680,
      fields: [
        { name: 'Route', value: `${req.method} ${req.path}`, inline: true },
        { name: 'Error', value: err.message, inline: false },
        { name: 'Time', value: new Date().toISOString(), inline: true }
      ]
    }]
  }).catch(() => {});
}

// PRO — Microsoft Teams (MessageCard)
if (isPro && options.teamsWebhookUrl) {
  await axios.post(options.teamsWebhookUrl, {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    themeColor: 'FF0000',
    summary: `500 Error in ${projectName}`,
    sections: [{
      activityTitle: `🚨 500 Error — ${projectName}`,
      facts: [
        { name: 'Route', value: `${req.method} ${req.path}` },
        { name: 'Error', value: err.message },
        { name: 'Time', value: new Date().toISOString() }
      ]
    }]
  }).catch(() => {});
}

    }
    next(err);
  };
}

module.exports = errorPulse;
