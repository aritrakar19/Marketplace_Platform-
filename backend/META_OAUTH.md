# TalentMatch — Meta (Facebook / Instagram) OAuth

Backend routes (no `/api` prefix):

| Method | Path | Description |
|--------|------|-------------|
| GET | `/auth/meta` | Redirects the browser to Facebook’s OAuth dialog |
| GET | `/auth/meta/callback` | Handles the redirect, exchanges the code, returns `{ username, followers }` |

## Setup

1. Create a [Meta app](https://developers.facebook.com/apps/) and add **Facebook Login** (and link **Instagram** products as required by Meta for your use case).

2. In the app dashboard, set **Valid OAuth Redirect URIs** to your callback URL, for example:
   `http://localhost:5000/auth/meta/callback`

3. Copy `config/meta.oauth.env.example` variables into your project root `.env` (same folder as `server.js`):
   - `META_APP_ID`
   - `META_APP_SECRET`
   - `META_REDIRECT_URI` (must match the redirect URI configured in Meta **exactly**)

4. Install dependencies (includes `axios`):

   ```bash
   cd backend
   npm install
   ```

## Run the server

```bash
cd backend
npm run dev
```

Default port is **5000** (`PORT` in `.env` overrides).

## Try the flow

1. Open in a browser: `http://localhost:5000/auth/meta`
2. Complete Facebook login and grant permissions.
3. Meta redirects to `/auth/meta/callback?code=...&state=...`
4. The server responds with JSON, for example:

   ```json
   { "username": "your_ig_username", "followers": 12345 }
   ```

## Notes

- `graph.instagram.com/me` is attempted first; if the token does not support it, the server falls back to **Facebook Graph API** (`/me/accounts` → Instagram Business Account → `username` and `followers_count`). This matches typical **Business/Creator** Instagram accounts linked to a **Facebook Page**.
- Ensure the test user’s Instagram is connected correctly in Meta’s app roles / linked page settings, or production checks may fail with permission errors.
