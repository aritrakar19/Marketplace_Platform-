# TalentMatch — Google / YouTube OAuth

Routes (mounted at `/auth`, same Express app as Meta OAuth):

| Method | Path | Description |
|--------|------|--------------|
| GET | `/auth/youtube` | Redirects to Google’s OAuth 2.0 consent screen |
| GET | `/auth/youtube/callback` | Exchanges `code`, calls YouTube Data API, returns `{ subscribers: number }` |

## Required npm packages

```bash
cd backend
npm install express-session connect-mongo axios
```

(`axios` is used inside the YouTube module for Google/YouTube HTTP calls.)

## Environment variables

Copy from `config/google.oauth.env.example` into **`backend/.env`** (loaded by `server.js` via `dotenv`):

- **`FRONTEND_ORIGIN`** — Defaults to `http://localhost:5173`. Comma-separated list if you have several web origins. Used by **CORS** with **`credentials: true`** so authenticated browser requests can include cookies when needed.
- **`MONGO_URI`** — Same string you use for Mongoose. Sessions (`req.session.oauthState`) are stored in MongoDB via **connect-mongo**, so restarts and multiple Node processes do not drop in-flight OAuth. Without it, **MemoryStore** is used and state is easy to lose.
- **`SESSION_SECRET`** — Strong random string for `express-session` (required in production).
- **`GOOGLE_CLIENT_ID`**, **`GOOGLE_CLIENT_SECRET`**, **`GOOGLE_REDIRECT_URI`** — Google OAuth client; redirect URI must match the console exactly.

### OAuth `state` (YouTube) — MongoDB, not cookies

YouTube OAuth **state** is stored in the **`youtube_oauth_states`** collection (short TTL). The callback validates by **looking up and deleting** that `state` in MongoDB. This avoids **“Invalid or expired OAuth state”** when:

- Different users or browsers complete the flow (no shared session cookie required).
- **`GOOGLE_REDIRECT_URI`** uses a **different port** than where the SPA pointed (session cookies are host/port sensitive; DB state is not).

**Important:** `GOOGLE_REDIRECT_URI` must still point to **this API server** (same host + port as `GET /auth/youtube`), e.g. if the app runs on `http://localhost:5001`, use `http://localhost:5001/auth/youtube/callback` in Google Cloud.

### Session middleware

`express-session` remains for future use; YouTube state no longer depends on it.

### Google Cloud setup

1. Create or select a project in [Google Cloud Console](https://console.cloud.google.com/).
2. **APIs & Services → Library** — enable **YouTube Data API v3**.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID** (Application type: **Web application**).
4. Add **Authorized redirect URIs** = your `GOOGLE_REDIRECT_URI`.
5. **OAuth consent screen** — add scope `.../auth/youtube.readonly` (or rely on dynamic request; the app requests `https://www.googleapis.com/auth/youtube.readonly`).

## Run the server

```bash
cd backend
npm install
npm run dev
```

Default port is **5000** unless `PORT` is set in `.env`.

## Try the flow

1. Open: `http://localhost:5000/auth/youtube`
2. Sign in with a Google account that **owns a YouTube channel**.
3. After redirect to `/auth/youtube/callback`, the response body is:

   ```json
   { "subscribers": 12345 }
   ```

If the channel hides subscriber counts, the API may still return a count of **0** (see logs).

## Errors

Failures return JSON such as `{ "success": false, "message": "..." }` with appropriate HTTP status codes. Server logs are prefixed with `[youtube-oauth]`.

## Dependencies

Uses **`axios`** and MongoDB (**`youtube_oauth_states`**) for one-time OAuth **state**; **`express-session`** / **`connect-mongo`** may still be loaded for other features.
