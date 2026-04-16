/**
 * Google OAuth / YouTube Data API configuration.
 */

const REQUIRED = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'];

const YOUTUBE_READONLY_SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';

function getGoogleOAuthConfig() {
  const missing = REQUIRED.filter((key) => !process.env[key] || String(process.env[key]).trim() === '');
  if (missing.length) {
    console.warn(
      '[youtube-oauth] Missing env:',
      missing.join(', '),
      '— /auth/youtube routes may fail until set.',
    );
  }

  return {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || '',
    scope: YOUTUBE_READONLY_SCOPE,
  };
}

module.exports = { getGoogleOAuthConfig, REQUIRED, YOUTUBE_READONLY_SCOPE };
