import useSWR from 'swr';
import { swrFetcher } from '../utils/axiosClient.js';
import { DEFAULT_OLLAMA_MODELS } from '../utils/ai/index.js';

/**
 * @file useOllamaModels.js
 * @description SWR hook to reactively fetch, cache, and revalidate models from Ollama Cloud.
 * Falls back to curated model defaults if connection is pending or unavailable.
 */

/**
 * Hook to retrieve available Ollama models with SWR caching.
 * @returns {{
 *   models: Array<{ id: string, name: string }>,
 *   isLoading: boolean,
 *   isError: boolean,
 *   mutate: () => Promise<any>
 * }}
 */
export function useOllamaModels() {
  const { data, error, isLoading, mutate } = useSWR('/tags', swrFetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 60000,
  });

  const models =
    data && Array.isArray(data.models) && data.models.length > 0
      ? data.models.map((m) => ({ id: m.name, name: m.name }))
      : DEFAULT_OLLAMA_MODELS;

  return {
    models,
    isLoading,
    isError: Boolean(error),
    mutate,
  };
}
