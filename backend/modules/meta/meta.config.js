/**
 * Meta (Facebook / Instagram) OAuth configuration.
 * Validates required env vars when the module loads.
 */

const required = ['META_APP_ID', 'META_APP_SECRET', 'META_REDIRECT_URI'];

function getMetaConfig() {
  const missing = required.filter((key) => !process.env[key] || String(process.env[key]).trim() === '');
  if (missing.length) {
    console.warn(
      '[meta-oauth] Missing environment variables:',
      missing.join(', '),
      '— /auth/meta routes may fail until these are set.',
    );
  }

  return {
    appId: process.env.META_APP_ID || '',
    appSecret: process.env.META_APP_SECRET || '',
    redirectUri: process.env.META_REDIRECT_URI || '',
    graphVersion: process.env.META_GRAPH_VERSION || 'v18.0',
    oauthScopes: [
      'instagram_basic',
      'instagram_manage_insights',
      'pages_show_list',
      'pages_read_engagement',
    ].join(','),
  };
}

module.exports = { getMetaConfig, required };
