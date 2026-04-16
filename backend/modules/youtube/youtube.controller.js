const crypto = require('crypto');
const { getGoogleOAuthConfig } = require('./youtube.config');
const {
  buildGoogleAuthorizeUrl,
  exchangeCodeForTokens,
  fetchMyChannelSubscriberCount,
} = require('./youtube.service');
const { saveOAuthState, consumeOAuthState } = require('./youtube.oauthStateStore');

/**
 * GET /auth/youtube — persist CSRF state in MongoDB, redirect to Google OAuth.
 * State is not stored only in session cookies so different browsers/users and
 * port-matched redirects still validate (see youtube.oauthStateStore.js).
 */
async function startYouTubeOAuth(req, res, next) {
  try {
    const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();
    if (!clientId || !clientSecret || !redirectUri) {
      console.error('[youtube-oauth] Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI');
      return res.status(500).json({
        success: false,
        message: 'Google OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.',
      });
    }

    const state = crypto.randomBytes(32).toString('hex');

    console.log('[youtube-oauth] --- start OAuth ---');
    console.log('[youtube-oauth] New state:', state);
    console.log('[youtube-oauth] Session ID (informational):', req.sessionID || '(none)');

    await saveOAuthState(state);
    console.log('[youtube-oauth] State saved to MongoDB; redirecting to Google');

    const url = buildGoogleAuthorizeUrl(state);
    return res.redirect(302, url);
  } catch (err) {
    console.error('[youtube-oauth] startYouTubeOAuth:', err.message);
    if (err.message && err.message.includes('not connected')) {
      return res.status(503).json({
        success: false,
        message: 'Database not ready. Ensure MONGO_URI is set and MongoDB is running.',
      });
    }
    return next(err);
  }
}

/**
 * GET /auth/youtube/callback — verify state via MongoDB, exchange code, return { subscribers }.
 */
async function youtubeOAuthCallback(req, res) {
  try {
    const { code, error, error_description: errorDescription, state: stateQuery } = req.query;

    console.log('[youtube-oauth] --- callback ---');
    console.log('[youtube-oauth] Session ID (informational):', req.sessionID || '(none)');

    if (error) {
      console.warn('[youtube-oauth] Google returned error:', error, errorDescription || '');
      return res.status(400).json({
        success: false,
        message: errorDescription || error || 'OAuth error',
      });
    }

    const returnedState = stateQuery != null ? String(stateQuery) : '';
    console.log('[youtube-oauth] Returned state (query):', returnedState || '(empty)');

    const stateValid = await consumeOAuthState(returnedState);
    console.log('[youtube-oauth] State consumed from MongoDB (valid):', stateValid);

    if (!returnedState || !stateValid) {
      console.warn(
        '[youtube-oauth] Invalid or unknown state — possible causes: expired (>10m), replay, wrong DB, or typo in GOOGLE_REDIRECT_URI. Ensure redirect URI host:port matches the server that handled /auth/youtube.',
      );
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OAuth state',
      });
    }

    if (!code) {
      console.warn('[youtube-oauth] Missing code');
      return res.status(400).json({ success: false, message: 'Missing authorization code.' });
    }

    console.log('[youtube-oauth] State OK; exchanging code (length', String(code).length, ')');

    const accessToken = await exchangeCodeForTokens(String(code));
    const { subscribers } = await fetchMyChannelSubscriberCount(accessToken);

    console.log('[youtube-oauth] Success — subscribers:', subscribers);

    return res.status(200).json({ subscribers });
  } catch (err) {
    if (err.response) {
      console.error(
        '[youtube-oauth] Upstream HTTP:',
        err.response.status,
        err.response.data || err.message,
      );
    } else {
      console.error('[youtube-oauth] Callback error:', err.message, err.details || '');
    }

    const status = err.status || (err.response && err.response.status) || 500;
    const message =
      err.message ||
      (err.response &&
        err.response.data &&
        err.response.data.error &&
        err.response.data.error.message) ||
      'Unexpected error during YouTube OAuth.';

    if (status >= 400 && status < 500) {
      return res.status(status).json({
        success: false,
        message,
        ...(err.details ? { details: err.details } : {}),
      });
    }

    return res.status(status >= 400 && status < 600 ? status : 500).json({
      success: false,
      message,
    });
  }
}

module.exports = {
  startYouTubeOAuth,
  youtubeOAuthCallback,
};
