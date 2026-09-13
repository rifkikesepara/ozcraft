import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  getApiKey,
  setApiKey,
  removeApiKey,
  hasApiKey,
  getApiUrl,
  setApiUrl,
} from '../utils/cookieStorage.js';
import { getAIAdapter, DEFAULT_OLLAMA_MODELS, SUPPORTED_AI_PROVIDERS } from '../utils/ai/index.js';
import { getSmartFallback } from '../utils/ai/smartFallback.js';
import { setClientBaseURL } from '../utils/axiosClient.js';
import { useLocale } from '../hooks/useLocale.js';

/**
 * @file AIProvider.jsx
 * @description Centralized AI context managing active provider, model selections,
 * configurable Ollama endpoint, on-demand cookie API keys, locale-aware prompt formatting,
 * and intelligent offline fallback.
 */

const AIContext = createContext(null);

/**
 * Custom hook to access AI actions and status.
 */
export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}

/**
 * AIProvider component.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function AIProvider({ children }) {
  const { locale } = useLocale();

  const [providerId, setProviderId] = useState('ollama');
  const [model, setModel] = useState(import.meta.env.VITE_OLLAMA_MODEL || 'gemma4:latest');
  const [apiUrl, setApiUrlState] = useState(() => getApiUrl());
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [keyModalResolver, setKeyModalResolver] = useState(null);

  // Enhancement dialog state
  const [enhanceModalState, setEnhanceModalState] = useState({
    isOpen: false,
    originalText: '',
    enhancedText: '',
    isLoading: false,
    error: '',
    title: 'AI Enhancer',
    promptType: 'bullet', // 'bullet' | 'summary' | 'skills'
    metadata: null,
    onApply: null,
    isFallbackMode: false,
  });

  const activeAdapter = useMemo(() => getAIAdapter(providerId), [providerId]);

  /**
   * Updates the Ollama API URL in cookie storage and Axios client.
   * @param {string} url
   */
  const updateApiUrl = useCallback((url) => {
    setApiUrl(url);
    const resolvedUrl = getApiUrl();
    setApiUrlState(resolvedUrl);
    setClientBaseURL(resolvedUrl);
  }, []);

  /**
   * Ensures an API key is available. If missing from cookies and env,
   * pops up the API Key modal on demand and waits for user input.
   * @returns {Promise<string>} Active API key
   */
  const ensureApiKey = useCallback(() => {
    return new Promise((resolve) => {
      const existingKey = getApiKey();
      if (existingKey) {
        resolve(existingKey);
        return;
      }
      // Open modal and store resolver
      setKeyModalResolver(() => resolve);
      setIsKeyModalOpen(true);
    });
  }, []);

  /**
   * Called when user submits an API key from the modal.
   * Saves into cookies and resolves pending promise.
   * @param {string} key
   */
  const handleSaveApiKey = useCallback(
    (key) => {
      setApiKey(key);
      setIsKeyModalOpen(false);
      if (keyModalResolver) {
        keyModalResolver(key);
        setKeyModalResolver(null);
      }
    },
    [keyModalResolver]
  );

  /**
   * Cancels the API key modal.
   */
  const handleCloseKeyModal = useCallback(() => {
    setIsKeyModalOpen(false);
    if (keyModalResolver) {
      keyModalResolver(null);
      setKeyModalResolver(null);
    }
  }, [keyModalResolver]);

  /**
   * Clears the stored API key cookie.
   */
  const handleClearApiKey = useCallback(() => {
    removeApiKey();
  }, []);

  /**
   * Builds a strict system prompt tailored to the active locale.
   */
  const getSystemPromptForLocale = useCallback(() => {
    if (locale === 'tr') {
      return 'You are an elite career coach and resume writer. CRITICAL: You must write all output strictly in natural, professional Turkish (Türkçe). Do NOT use English words or explanations. Output only the requested text.';
    }
    return 'You are an elite career coach and resume writer. CRITICAL: You must write all output strictly in polished, professional English. Output only the requested text without markdown bullet symbols or pleasantries.';
  }, [locale]);

  /**
   * Core generation method using active adapter with automatic smart fallback
   * when Ollama endpoint is offline or unreachable.
   * @param {string} prompt - The formatted instruction
   * @param {string} [systemPrompt] - Optional system guidance
   * @returns {Promise<string>}
   */
  const generate = useCallback(
    async (prompt, systemPrompt = '') => {
      const activeSystemPrompt = systemPrompt || getSystemPromptForLocale();
      try {
        const key = await ensureApiKey();
        if (!key) {
          throw new Error('API key is required to use AI features.');
        }
        return await activeAdapter.generateText({
          prompt,
          model,
          systemPrompt: activeSystemPrompt,
        });
      } catch (err) {
        // If Ollama endpoint is unreachable, smoothly return high-quality smart fallback
        if (
          err.message &&
          (err.message.includes('Unable to reach Ollama') ||
            err.message.includes('Network Error') ||
            err.message.includes('ECONNREFUSED') ||
            err.message.includes('CORS'))
        ) {
          console.warn(
            'Ollama endpoint offline/unreachable. Utilizing localized smart fallback AI generator.'
          );
          return getSmartFallback(prompt, locale);
        }
        throw err;
      }
    },
    [activeAdapter, model, ensureApiKey, getSystemPromptForLocale, locale]
  );

  /**
   * Opens the AI enhancement modal to refine or generate text with instant live diff & apply.
   * @param {object} options
   * @param {string} options.originalText - Text to refine
   * @param {string} options.prompt - The instruction prompt
   * @param {string} [options.title] - Modal title
   * @param {string} [options.promptType='bullet'] - 'bullet' | 'summary' | 'skills'
   * @param {object} [options.metadata] - Extra context for regeneration (e.g. jobTitle, skills)
   * @param {(enhancedText: string) => void} options.onApply - Callback when applied
   */
  const openEnhanceModal = useCallback(
    async ({
      originalText,
      prompt,
      title = 'AI Writing Assistant',
      promptType = 'bullet',
      metadata = null,
      onApply,
    }) => {
      setEnhanceModalState({
        isOpen: true,
        originalText,
        enhancedText: '',
        isLoading: true,
        error: '',
        title,
        promptType,
        metadata,
        onApply,
        isFallbackMode: false,
      });

      try {
        const key = await ensureApiKey();
        if (!key) {
          setEnhanceModalState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
          return;
        }

        const activeSystemPrompt = getSystemPromptForLocale();
        const result = await activeAdapter.generateText({
          prompt,
          model,
          systemPrompt: activeSystemPrompt,
        });
        setEnhanceModalState((prev) => ({
          ...prev,
          enhancedText: result,
          isLoading: false,
          isFallbackMode: false,
        }));
      } catch (err) {
        const isOffline =
          err.message &&
          (err.message.includes('Unable to reach Ollama') ||
            err.message.includes('Network Error') ||
            err.message.includes('CORS'));

        if (isOffline) {
          // Provide instant localized smart fallback so user is never blocked
          const fallbackText = getSmartFallback(prompt, locale);
          setEnhanceModalState((prev) => ({
            ...prev,
            enhancedText: fallbackText,
            isLoading: false,
            isFallbackMode: true,
            error: '',
          }));
        } else {
          setEnhanceModalState((prev) => ({
            ...prev,
            isLoading: false,
            error: err.message || 'Failed to generate response.',
          }));
        }
      }
    },
    [activeAdapter, model, ensureApiKey, getSystemPromptForLocale, locale]
  );

  /**
   * Closes the enhancement modal.
   */
  const closeEnhanceModal = useCallback(() => {
    setEnhanceModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  /**
   * Applies the enhanced text to the target resume field and closes the modal.
   */
  const applyEnhanceModal = useCallback(() => {
    if (enhanceModalState.onApply && enhanceModalState.enhancedText) {
      enhanceModalState.onApply(enhanceModalState.enhancedText);
    }
    closeEnhanceModal();
  }, [enhanceModalState, closeEnhanceModal]);

  /**
   * Discovers available models from the active AI provider adapter.
   * @returns {Promise<Array<{ id: string, name: string }>>}
   */
  const listModels = useCallback(async () => {
    return await activeAdapter.listModels();
  }, [activeAdapter]);

  const value = {
    providerId,
    setProviderId,
    model,
    setModel,
    apiUrl,
    updateApiUrl,
    supportedProviders: SUPPORTED_AI_PROVIDERS,
    defaultModels: DEFAULT_OLLAMA_MODELS,
    listModels,
    hasApiKey: hasApiKey(),
    cookieKey: getApiKey(),
    updateApiKey: handleSaveApiKey,
    ensureApiKey,
    clearApiKey: handleClearApiKey,
    saveApiKey: handleSaveApiKey,
    generate,
    isKeyModalOpen,
    closeKeyModal: handleCloseKeyModal,
    enhanceModalState,
    openEnhanceModal,
    closeEnhanceModal,
    applyEnhanceModal,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}
