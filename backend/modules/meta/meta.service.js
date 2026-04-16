const axios = require('axios');
const { getMetaConfig } = require('./meta.config');

const FB_OAUTH_BASE = 'https://www.facebook.com';
const GRAPH_FB = 'https://graph.facebook.com';

/**
 * Build Facebook Login URL (Meta OAuth).
 */
function buildFacebookAuthorizeUrl(state) {
  const { appId, redirectUri, graphVersion, oauthScopes } = getMetaConfig();
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: oauthScopes,
    response_type: 'code',
    state: state || '',
  });
  const url = `${FB_OAUTH_BASE}/${graphVersion}/dialog/oauth?${params.toString()}`;
  console.log('[meta-oauth] Built authorize URL (client_id present:', Boolean(appId), ')');
  return url;
}

/**
 * Exchange authorization code for a user access token.
 * @see https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow#confirm
 */
async function exchangeCodeForAccessToken(code) {
  const { appId, appSecret, redirectUri, graphVersion } = getMetaConfig();
  const url = `${GRAPH_FB}/${graphVersion}/oauth/access_token`;
  console.log('[meta-oauth] Exchanging code for access_token at', url);

  const response = await axios.get(url, {
    params: {
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: redirectUri,
      code,
    },
    timeout: 30000,
    validateStatus: () => true,
  });

  const { data, status } = response;
  console.log('[meta-oauth] Token HTTP status:', status);

  if (data.error) {
    console.error('[meta-oauth] Token exchange error:', data.error);
    const err = new Error(data.error.message || 'Failed to exchange authorization code');
    err.status = 400;
    err.details = data.error;
    throw err;
  }

  if (!data.access_token) {
    console.error('[meta-oauth] Token exchange: no access_token in response', data);
    const err = new Error('Invalid token response from Meta');
    err.status = 502;
    throw err;
  }

  console.log('[meta-oauth] Received access_token (expires_in:', data.expires_in, ')');
  return data.access_token;
}

/**
 * Try Instagram endpoint as specified (works with some token types; may fail for pure Facebook user tokens).
 */
async function fetchInstagramMe(accessToken) {
  const url = 'https://graph.instagram.com/me';
  console.log('[meta-oauth] Trying graph.instagram.com/me …');
  const { data, status } = await axios.get(url, {
    params: {
      fields: 'id,username,followers_count',
      access_token: accessToken,
    },
    timeout: 30000,
    validateStatus: () => true,
  });

  if (status >= 200 && status < 300 && data && !data.error && data.username != null) {
    const followers = Number(data.followers_count);
    console.log('[meta-oauth] graph.instagram.com/me OK:', data.username, 'followers:', followers);
    return {
      username: String(data.username),
      followers: Number.isFinite(followers) ? followers : 0,
    };
  }

  if (data && data.error) {
    console.log('[meta-oauth] graph.instagram.com/me error (will try Facebook Graph fallback):', data.error.message || data.error);
  }
  return null;
}

/**
 * Instagram Business/Creator via linked Facebook Page (Graph API).
 */
async function fetchInstagramViaFacebookGraph(accessToken, graphVersion) {
  console.log('[meta-oauth] Fetching /me/accounts for Instagram Business Account…');
  const accountsUrl = `${GRAPH_FB}/${graphVersion}/me/accounts`;
  const { data: pagesRes, status: pagesStatus } = await axios.get(accountsUrl, {
    params: {
      access_token: accessToken,
      fields: 'name,instagram_business_account',
    },
    timeout: 30000,
    validateStatus: () => true,
  });

  if (pagesStatus < 200 || pagesStatus >= 300 || !pagesRes || pagesRes.error) {
    console.error('[meta-oauth] me/accounts failed:', pagesRes && pagesRes.error);
    return null;
  }

  const pages = pagesRes.data || [];
  const withIg = pages.find((p) => p.instagram_business_account && p.instagram_business_account.id);
  if (!withIg) {
    console.warn('[meta-oauth] No Facebook Page with instagram_business_account found for this user.');
    return null;
  }

  const igUserId = withIg.instagram_business_account.id;
  console.log('[meta-oauth] Found Instagram Business Account id:', igUserId);

  const igUrl = `${GRAPH_FB}/${graphVersion}/${igUserId}`;
  const { data: igRes, status: igStatus } = await axios.get(igUrl, {
    params: {
      access_token: accessToken,
      fields: 'username,followers_count',
    },
    timeout: 30000,
    validateStatus: () => true,
  });

  if (igStatus < 200 || igStatus >= 300 || !igRes || igRes.error) {
    console.error('[meta-oauth] IG user fetch failed:', igRes && igRes.error);
    return null;
  }

  const followers = Number(igRes.followers_count);
  console.log('[meta-oauth] Facebook Graph IG user OK:', igRes.username, 'followers:', followers);
  return {
    username: String(igRes.username || ''),
    followers: Number.isFinite(followers) ? followers : 0,
  };
}

/**
 * Resolve Instagram username and follower count using the user access token from Facebook Login.
 */
async function fetchInstagramProfile(accessToken) {
  const { graphVersion } = getMetaConfig();

  const direct = await fetchInstagramMe(accessToken);
  if (direct) return direct;

  const viaFb = await fetchInstagramViaFacebookGraph(accessToken, graphVersion);
  if (viaFb && viaFb.username) return viaFb;

  const err = new Error(
    'Could not load Instagram profile. Ensure the Instagram account is a Business/Creator account linked to a Facebook Page, and that the granted permissions include the requested scopes.',
  );
  err.status = 424;
  throw err;
}

module.exports = {
  buildFacebookAuthorizeUrl,
  exchangeCodeForAccessToken,
  fetchInstagramProfile,
};
