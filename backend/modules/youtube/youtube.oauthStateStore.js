/**
 * Persists OAuth `state` in MongoDB with a TTL so the callback can be validated
 * without relying on session cookies. Session cookies often fail when:
 * - GOOGLE_REDIRECT_URI uses a different port than the URL that started OAuth
 * - Strict browser / privacy settings
 * - Users completing the flow in another browser profile
 *
 * Each `state` is single-use (deleted on successful callback).
 */

const mongoose = require('mongoose');

const COLLECTION = 'youtube_oauth_states';
const STATE_TTL_MS = 10 * 60 * 1000;

let indexesEnsured = false;

function getCollection() {
  if (!mongoose.connection.db) {
    throw new Error('MongoDB is not connected yet');
  }
  return mongoose.connection.db.collection(COLLECTION);
}

async function ensureIndexes() {
  if (indexesEnsured) return;
  const col = getCollection();
  await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  indexesEnsured = true;
  console.log('[youtube-oauth] MongoDB OAuth state TTL index ready on', COLLECTION);
}

/**
 * @param {string} state
 */
async function saveOAuthState(state) {
  await ensureIndexes();
  const col = getCollection();
  const now = new Date();
  await col.insertOne({
    _id: state,
    createdAt: now,
    expiresAt: new Date(now.getTime() + STATE_TTL_MS),
  });
}

/**
 * Validates and consumes state (one-time).
 * @param {string} state
 * @returns {Promise<boolean>} true if state existed and was removed
 */
async function consumeOAuthState(state) {
  if (!state) return false;
  await ensureIndexes();
  const col = getCollection();
  const result = await col.findOneAndDelete({ _id: state });
  return result != null;
}

module.exports = {
  saveOAuthState,
  consumeOAuthState,
};
