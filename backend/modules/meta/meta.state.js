/**
 * Signed OAuth `state` to mitigate CSRF (production-ready, no extra deps).
 */

const crypto = require('crypto');

const TTL_MS = 10 * 60 * 1000; // 10 minutes

function signOAuthState(appSecret) {
  if (!appSecret) return null;
  const payload = JSON.stringify({
    n: crypto.randomBytes(16).toString('hex'),
    exp: Date.now() + TTL_MS,
  });
  const sig = crypto.createHmac('sha256', appSecret).update(payload).digest('hex');
  return `${Buffer.from(payload, 'utf8').toString('base64url')}.${sig}`;
}

function verifyOAuthState(state, appSecret) {
  if (!state || !appSecret || typeof state !== 'string') return false;
  const dot = state.lastIndexOf('.');
  if (dot === -1) return false;
  const b64 = state.slice(0, dot);
  const sig = state.slice(dot + 1);
  let payload;
  try {
    payload = Buffer.from(b64, 'base64url').toString('utf8');
  } catch {
    return false;
  }
  const expected = crypto.createHmac('sha256', appSecret).update(payload).digest('hex');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) {
      return false;
    }
  } catch {
    return false;
  }
  let data;
  try {
    data = JSON.parse(payload);
  } catch {
    return false;
  }
  if (typeof data.exp !== 'number' || Date.now() > data.exp) return false;
  return true;
}

module.exports = { signOAuthState, verifyOAuthState };
