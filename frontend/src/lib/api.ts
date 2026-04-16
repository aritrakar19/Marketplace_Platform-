function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}

const fromEnv = import.meta.env.VITE_API_URL as string | undefined;

/** e.g. http://localhost:5000/api */
export const API_BASE_URL = stripTrailingSlash(
  fromEnv ?? 'http://localhost:5000/api',
);

const socketFromEnv = import.meta.env.VITE_SOCKET_URL as string | undefined;

/** Same host as the API (no /api path), e.g. http://localhost:5000 */
export function serverOrigin(): string {
  return socketFromEnv
    ? stripTrailingSlash(socketFromEnv)
    : new URL(API_BASE_URL).origin;
}

/** Socket server origin, e.g. http://localhost:5000 */
export const SOCKET_URL = serverOrigin();

/** Build a full API URL. Pass paths like `/users/me` or `users/me`. */
export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${p}`;
}

/** Meta (Facebook) OAuth start — not under /api */
export function metaOAuthUrl(): string {
  return `${serverOrigin()}/auth/meta`;
}
