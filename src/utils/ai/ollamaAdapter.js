import { axiosClient } from '../axiosClient.js';
import { BaseAIAdapter } from './aiAdapter.js';
import { DEFAULT_OLLAMA_MODELS } from '../constants.js';

export { DEFAULT_OLLAMA_MODELS };

export class OllamaAdapter extends BaseAIAdapter {
  constructor() {
    super('ollama', 'Ollama Cloud');
  }

  /**
   * Generates or enhances text via the Ollama generate endpoint.
   * @param {object} params
   * @param {string} params.prompt - Formatted instruction
   * @param {string} [params.model='gemma4:latest'] - Model name
   * @param {string} [params.systemPrompt] - System prompt instructions
   * @returns {Promise<string>} Clean generated text
   */
  async generateText({
    prompt,
    model = import.meta.env.VITE_OLLAMA_MODEL || 'gemma4:latest',
    systemPrompt = '',
  }) {
    const payload = {
      model,
      prompt,
      stream: false,
      options: {
        temperature: 0.6,
        top_p: 0.9,
      },
    };

    if (systemPrompt) {
      payload.system = systemPrompt;
    }

    const response = await axiosClient.post('/generate', payload);
    if (response.data && typeof response.data.response === 'string') {
      return response.data.response.trim();
    }
    throw new Error('Unexpected response format from Ollama API');
  }

  /**
   * Queries Ollama /tags endpoint to discover installed or available models.
   * Falls back to standard curated models if offline or list is empty.
   * @returns {Promise<Array<{ id: string, name: string }>>}
   */
  async listModels() {
    try {
      const response = await axiosClient.get('/tags', { timeout: 8000 });
      if (response.data && Array.isArray(response.data.models) && response.data.models.length > 0) {
        return response.data.models.map((m) => ({
          id: m.name,
          name: m.name,
          size: m.size,
        }));
      }
    } catch {
      // Fallback gracefully to default list if tags endpoint is inaccessible or restricted
    }
    return DEFAULT_OLLAMA_MODELS;
  }

  /**
   * Tests connection and API key validity against Ollama service.
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async testConnection() {
    try {
      const response = await axiosClient.get('/tags', { timeout: 8000 });
      if (response.status >= 200 && response.status < 300) {
        const modelCount = response.data?.models?.length || 0;
        return {
          success: true,
          message: `Connected to Ollama Cloud successfully! (${modelCount} models detected)`,
        };
      }
      return { success: false, message: 'Server returned non-200 status' };
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Failed to connect to Ollama endpoint',
      };
    }
  }
}
