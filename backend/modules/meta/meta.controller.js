const { getMetaConfig } = require('./meta.config');
const { signOAuthState, verifyOAuthState } = require('./meta.state');
const {
  buildFacebookAuthorizeUrl,
  exchangeCodeForAccessToken,
  fetchInstagramProfile,
} = require('./meta.service');

/**
 * GET /auth/meta — redirect to Meta (Facebook) OAuth dialog.
 */
function startMetaOAuth(req, res, next) {
  try {
    const { appId, appSecret } = getMetaConfig();
    if (!appId || !appSecret || !getMetaConfig().redirectUri) {
      console.error('[meta-oauth] Missing META_APP_ID, META_APP_SECRET, or META_REDIRECT_URI');
      return res.status(500).json({
        success: false,
        message: 'Meta OAuth is not configured. Set META_APP_ID, META_APP_SECRET, and META_REDIRECT_URI.',
      });
    }

    const state = signOAuthState(appSecret);
    if (!state) {
      return res.status(500).json({ success: false, message: 'Could not generate OAuth state.' });
    }

    const url = buildFacebookAuthorizeUrl(state);
    console.log('[meta-oauth] Redirecting user to Facebook OAuth dialog');
    return res.redirect(302, url);
  } catch (err) {
    console.error('[meta-oauth] startMetaOAuth error:', err.message);
    return next(err);
  }
}

/**
 * GET /auth/meta/callback — exchange code, call Instagram APIs, return JSON.
 */
async function metaOAuthCallback(req, res, next) {
  try {
    const { code, error, error_description: errorDescription, state } = req.query;
    const { appSecret } = getMetaConfig();

    if (error) {
      console.warn('[meta-oauth] User denied or error from Meta:', error, errorDescription);
      return res.status(400).json({
        success: false,
        message: errorDescription || error || 'OAuth error',
      });
    }

    if (!state || !verifyOAuthState(String(state), appSecret)) {
      console.warn('[meta-oauth] Invalid or expired OAuth state');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OAuth state. Start again from GET /auth/meta.',
      });
    }

    if (!code) {
      console.warn('[meta-oauth] Missing code query parameter');
      return res.status(400).json({
        success: false,
        message: 'Missing authorization code.',
      });
    }

    console.log('[meta-oauth] Callback received code (length:', String(code).length, ')');

    const accessToken = await exchangeCodeForAccessToken(String(code));
    const profile = await fetchInstagramProfile(accessToken);

    console.log('[meta-oauth] Success — username:', profile.username, 'followers:', profile.followers);

    return res.status(200).json({
      username: profile.username,
      followers: profile.followers,
    });
  } catch (err) {
    if (err.response) {
      console.error(
        '[meta-oauth] Upstream HTTP error:',
        err.response.status,
        err.response.data || err.message,
      );
    } else {
      console.error('[meta-oauth] Callback error:', err.message, err.details || '');
    }

    const status = err.status || (err.response && err.response.status) || 500;
    const message =
      err.message ||
      (err.response && err.response.data && err.response.data.error && err.response.data.error.message) ||
      'Unexpected error during Meta OAuth callback.';

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
  startMetaOAuth,
  metaOAuthCallback,
};
