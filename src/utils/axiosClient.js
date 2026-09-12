import axios from 'axios';
import { getApiKey, getApiUrl } from './cookieStorage.js';

/**
 * @file axiosClient.js
 * @description Centralized Axios HTTP client with automatic Bearer token injection
 * and clean error handling for AI API communication.
 */

// Determine base URL: prioritize cookie setting, then env, then fallback
const INITIAL_BASE_URL = getApiUrl();

/**
 * Pre-configured Axios instance for AI API requests.
 */
export const axiosClient = axios.create({
  baseURL: INITIAL_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Updates the base URL at runtime when user changes settings.
 * @param {string} newBaseUrl
 */
export function setClientBaseURL(newBaseUrl) {
  if (newBaseUrl) {
    axiosClient.defaults.baseURL = newBaseUrl;
  }
}

// Request Interceptor: Attach Bearer authorization header from secure cookie
axiosClient.interceptors.request.use(
  (config) => {
    const apiKey = getApiKey();
    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error messages clearly for UI toast notifications
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'API request failed';
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        message = 'Invalid or expired API Key. Please check your Ollama credentials.';
      } else if (error.response.data?.error) {
        message =
          typeof error.response.data.error === 'string'
            ? error.response.data.error
            : error.response.data.error.message || message;
      } else {
        message = `Server responded with status ${error.response.status}`;
      }
    } else if (error.request) {
      message = 'Unable to reach Ollama endpoint. Check network or CORS settings.';
    } else {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

/**
 * SWR standard fetcher utility function for GET endpoints.
 * @param {string} url - Relative or absolute endpoint URL
 * @returns {Promise<any>} The parsed response data
 */
export async function swrFetcher(url) {
  const response = await axiosClient.get(url);
  return response.data;
}
