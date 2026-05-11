const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const appRoutes = require('./routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

/**
 * CORS with credentials so the browser may send the session cookie on cross-origin
 * requests (e.g. fetch from the Vite app) when needed. Top-level OAuth redirects
 * (window.location to /auth/youtube) do not rely on CORS, but API calls do.
 *
 * FRONTEND_ORIGIN: comma-separated list, defaults to http://localhost:5173
 */
const frontendOrigins = Array.from(new Set([
  ...(process.env.FRONTEND_ORIGIN 
    || 'http://localhost:5173').split(','),
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].map((s) => s.trim()).filter(Boolean)));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (frontendOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn('[cors] Blocked origin:', origin);
      return callback(null, false);
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV === 'production') {
  console.error('FATAL: SESSION_SECRET must be set in production');
  process.exit(1);
}

const sessionTtlSeconds = 30 * 60;
const isProduction = process.env.NODE_ENV === 'production';

const sessionMiddleware = session({
  name: 'talentmatch.sid',
  secret: sessionSecret || 'talentmatch-dev-session-secret-change-me',
  resave: false,
  // Only create a session when something is stored (e.g. oauthState). Avoids empty
  // sessions for every anonymous hit and pairs well with OAuth: first touch on /auth/youtube.
  saveUninitialized: false,
  store: process.env.MONGO_URI
    ? MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: sessionTtlSeconds,
        collectionName: 'sessions',
      })
    : undefined,
  cookie: {
    httpOnly: true,
    maxAge: sessionTtlSeconds * 1000,
    path: '/',
    /**
     * sameSite: 'lax' — On the OAuth return trip, Google redirects the browser to your
     * site with a top-level GET. 'lax' allows the session cookie to be sent on that
     * navigation (unlike 'strict', which can drop cookies on some cross-site redirects).
     * 'none' would require secure: true and is for embedded flows we don't need here.
     */
    sameSite: 'lax',
    // Dev: false so cookies work on http://localhost. Production: true when using HTTPS.
    secure: isProduction,
  },
});

if (process.env.MONGO_URI) {
  console.log('[session] Using MongoDB session store (connect-mongo) for OAuth state');
} else {
  console.warn(
    '[session] MONGO_URI not set — MemoryStore in use. YouTube OAuth state is lost on server restart; set MONGO_URI.',
  );
}

app.use(sessionMiddleware);
if (!sessionSecret && !isProduction) {
  console.warn('[session] SESSION_SECRET not set; using dev fallback (set SESSION_SECRET for production)');
}

app.use('/api', appRoutes);
app.use('/auth', require('./modules/meta/meta.routes'));
app.use('/auth', require('./modules/youtube/youtube.routes'));
app.get('/', (req, res) => res.json({ message: 'Marketplace API running' }));

app.use(errorHandler);
module.exports = app;
