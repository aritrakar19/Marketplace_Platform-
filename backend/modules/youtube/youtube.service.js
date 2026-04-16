const axios = require('axios');
const { getGoogleOAuthConfig } = require('./youtube.config');

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const YOUTUBE_CHANNELS_URL = 'https://www.googleapis.com/youtube/v3/channels';

/**
 * Build Google OAuth 2.0 authorization URL (YouTube readonly scope).
 */
function buildGoogleAuthorizeUrl(state) {
  const { clientId, redirectUri, scope } = getGoogleOAuthConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    access_type: 'offline',
    scope,
    state: state || '',
  });
  const url = `${GOOGLE_AUTH_URL}?${params.toString()}`;
  console.log('[youtube-oauth] Built Google authorize URL (client_id set:', Boolean(clientId), ')');
  return url;
}

/**
 * Exchange authorization code for tokens.
 * @see https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code
 */
async function exchangeCodeForTokens(code) {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  console.log('[youtube-oauth] POST', GOOGLE_TOKEN_URL, '(exchange code)');

  const { data, status } = await axios.post(GOOGLE_TOKEN_URL, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 30000,
    validateStatus: () => true,
  });

  console.log('[youtube-oauth] Token endpoint HTTP status:', status);

  if (data.error) {
    console.error('[youtube-oauth] Token error:', data.error, data.error_description || '');
    const err = new Error(data.error_description || data.error || 'Token exchange failed');
    err.status = 400;
    err.details = data;
    throw err;
  }

  if (!data.access_token) {
    console.error('[youtube-oauth] No access_token in response');
    const err = new Error('Invalid token response from Google');
    err.status = 502;
    throw err;
  }

  console.log('[youtube-oauth] access_token received (expires_in:', data.expires_in, ')');
  return data.access_token;
}

/**
 * Fetch authenticated user's channel statistics (subscriber count).
 * @see https://developers.google.com/youtube/v3/docs/channels/list
 */
async function fetchMyChannelSubscriberCount(accessToken) {
  console.log('[youtube-oauth] GET', YOUTUBE_CHANNELS_URL, 'mine=true, part=statistics');

  const { data, status } = await axios.get(YOUTUBE_CHANNELS_URL, {
    params: {
      part: 'statistics',
      mine: 'true',
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: 30000,
    validateStatus: () => true,
  });

  console.log('[youtube-oauth] YouTube channels HTTP status:', status);

  if (data.error) {
    console.error('[youtube-oauth] YouTube API error:', data.error.message || data.error);
    const err = new Error(data.error.message || 'YouTube API error');
    err.status = data.error.code === 403 ? 403 : 502;
    err.details = data.error;
    throw err;
  }

  const items = data.items || [];
  if (!items.length) {
    console.warn('[youtube-oauth] No channel returned for this Google account (mine=true)');
    const err = new Error(
      'No YouTube channel found for this Google account. Use a Google account that owns a YouTube channel.',
    );
    err.status = 404;
    throw err;
  }

  const stats = items[0].statistics || {};
  const raw = stats.subscriberCount;
  const subscribers = raw != null ? parseInt(String(raw), 10) : 0;

  if (Number.isNaN(subscribers)) {
    console.warn('[youtube-oauth] Could not parse subscriberCount:', raw);
    return { subscribers: 0 };
  }

  if (stats.hiddenSubscriberCount === true) {
    console.log('[youtube-oauth] Channel hides subscriber count; returning 0');
    return { subscribers: 0 };
  }

  console.log('[youtube-oauth] subscriberCount:', subscribers);
  return { subscribers };
}

module.exports = {
  buildGoogleAuthorizeUrl,
  exchangeCodeForTokens,
  fetchMyChannelSubscriberCount,
};
