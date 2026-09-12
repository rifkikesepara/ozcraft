import { OllamaAdapter } from './ollamaAdapter.js';
import { AI_PROMPTS } from './aiAdapter.js';
import { SUPPORTED_AI_PROVIDERS, DEFAULT_OLLAMA_MODELS } from '../constants.js';

/**
 * @file index.js
 * @description Central AI registry exporting available adapters and prompt strategies.
 * Facilitates adding future AI providers (e.g., OpenAI, Gemini, Claude) with zero UI refactoring.
 */

export const aiAdapters = {
  ollama: new OllamaAdapter(),
};

/**
 * Returns the active AI adapter instance.
 * @param {string} [providerId='ollama'] - Key in aiAdapters registry
 * @returns {import('./aiAdapter').BaseAIAdapter}
 */
export function getAIAdapter(providerId = 'ollama') {
  return aiAdapters[providerId] || aiAdapters.ollama;
}

export { AI_PROMPTS, DEFAULT_OLLAMA_MODELS, SUPPORTED_AI_PROVIDERS };
