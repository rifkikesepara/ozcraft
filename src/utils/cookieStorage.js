import Cookies from 'js-cookie';
import {
  OLLAMA_KEY_COOKIE,
  LEGACY_OLLAMA_KEY_COOKIE,
  OLLAMA_URL_COOKIE,
  LEGACY_OLLAMA_URL_COOKIE,
  DEFAULT_OLLAMA_KEY,
  DEFAULT_OLLAMA_URL,
  PROXY_OLLAMA_URL,
} from './constants.js';

/**
 * @file cookieStorage.js
 * @description Secure cookie storage utility specifically for API keys and endpoints.
 * Enforces zero-localStorage policy for sensitive credentials.
 */

/**
 * Retrieves the stored Ollama Cloud API key from browser cookies,
 * or falls back to the environment variable if configured.
 * @returns {string} The active API key or empty string if not found.
 */
export function getApiKey() {
  const cookieKey = Cookies.get(OLLAMA_KEY_COOKIE) || Cookies.get(LEGACY_OLLAMA_KEY_COOKIE);
  if (cookieKey && cookieKey.trim().length > 0) {
    return cookieKey.trim();
  }
  return (import.meta.env.VITE_OLLAMA_API_KEY || DEFAULT_OLLAMA_KEY).trim();
}

/**
 * Saves the API key securely into browser cookies.
 * @param {string} key - The API key to store
 * @param {number} [expiresDays=30] - Expiration duration in days
 */
export function setApiKey(key, expiresDays = 30) {
  if (!key) {
    removeApiKey();
    return;
  }
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  Cookies.set(OLLAMA_KEY_COOKIE, key.trim(), {
    expires: expiresDays,
    sameSite: 'Strict',
    secure: isSecure,
    path: '/',
  });
}

/**
 * Removes the stored API key cookie.
 */
export function removeApiKey() {
  Cookies.remove(OLLAMA_KEY_COOKIE, { path: '/' });
  Cookies.remove(LEGACY_OLLAMA_KEY_COOKIE, { path: '/' });
}

/**
 * Checks if an API key is currently available (in cookies or environment).
 * @returns {boolean} True if an API key is available
 */
export function hasApiKey() {
  const key = getApiKey();
  return Boolean(key && key.length > 0);
}

/**
 * Retrieves the stored Ollama API endpoint URL.
 * Automatically routes through the local Vite proxy '/api/ollama' when targeting ollama.com
 * to eliminate browser CORS errors.
 * @returns {string}
 */
export function getApiUrl() {
  const cookieUrl = Cookies.get(OLLAMA_URL_COOKIE) || Cookies.get(LEGACY_OLLAMA_URL_COOKIE);
  const rawUrl = cookieUrl && cookieUrl.trim().length > 0
    ? cookieUrl.trim()
    : (import.meta.env.VITE_OLLAMA_API_URL || DEFAULT_OLLAMA_URL).trim();

  if (rawUrl.includes('ollama.com')) {
    return PROXY_OLLAMA_URL;
  }
  return rawUrl;
}

/**
 * Returns the raw configured API URL for display in settings.
 * @returns {string}
 */
export function getDisplayApiUrl() {
  const cookieUrl = Cookies.get(OLLAMA_URL_COOKIE) || Cookies.get(LEGACY_OLLAMA_URL_COOKIE);
  if (cookieUrl && cookieUrl.trim().length > 0) {
    return cookieUrl.trim();
  }
  return (import.meta.env.VITE_OLLAMA_API_URL || DEFAULT_OLLAMA_URL).trim();
}

/**
 * Sets the Ollama API endpoint URL in cookies.
 * @param {string} url
 */
export function setApiUrl(url) {
  if (!url) {
    Cookies.remove(OLLAMA_URL_COOKIE, { path: '/' });
    return;
  }
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  Cookies.set(OLLAMA_URL_COOKIE, url.trim(), {
    expires: 30,
    sameSite: 'Strict',
    secure: isSecure,
    path: '/',
  });
}
