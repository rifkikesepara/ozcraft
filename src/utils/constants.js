/**
 * @file constants.js
 * @description Centralized constant definitions across the OzCraft application.
 * Includes storage keys, cookie keys, defaults, theme palettes, section orders, and AI presets.
 */

// --- LocalStorage & Cookie Keys ---
export const RESUME_STORAGE_KEY = 'ozcraft_resume_draft';
export const LEGACY_RESUME_STORAGE_KEY = 'resumio_resume_draft';

export const LOCALE_STORAGE_KEY = 'ozcraft_locale';
export const LEGACY_LOCALE_STORAGE_KEY = 'resumio_locale';

export const THEME_MODE_STORAGE_KEY = 'ozcraft_theme_mode';
export const LEGACY_THEME_MODE_STORAGE_KEY = 'resumio_theme_mode';

export const THEME_PALETTE_STORAGE_KEY = 'ozcraft_theme_palette';
export const LEGACY_THEME_PALETTE_STORAGE_KEY = 'resumio_theme_palette';

export const OLLAMA_KEY_COOKIE = 'ozcraft_ollama_key';
export const LEGACY_OLLAMA_KEY_COOKIE = 'resumio_ollama_key';

export const OLLAMA_URL_COOKIE = 'ozcraft_ollama_url';
export const LEGACY_OLLAMA_URL_COOKIE = 'resumio_ollama_url';

export const DEFAULT_OLLAMA_KEY = '';
export const DEFAULT_OLLAMA_URL = 'https://ollama.com/api';
export const PROXY_OLLAMA_URL = '/api/ollama';

// --- Theme Palettes ---
export const COLOR_PALETTES = [
  { id: 'slate', name: 'Modern Slate', primary: '#1e293b', secondary: '#475569' },
  { id: 'indigo', name: 'Deep Indigo', primary: '#4338ca', secondary: '#6366f1' },
  { id: 'emerald', name: 'Emerald Green', primary: '#047857', secondary: '#10b981' },
  { id: 'rose', name: 'Royal Rose', primary: '#be123c', secondary: '#f43f5e' },
  { id: 'amber', name: 'Warm Amber', primary: '#b45309', secondary: '#f59e0b' },
  { id: 'monochrome', name: 'Pure Monochrome', primary: '#09090b', secondary: '#71717a' },
];

// --- Section Orders & Structure ---
export const DEFAULT_SECTION_ORDER = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
];

export const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><rect width="120" height="120" fill="%231e293b"/><circle cx="60" cy="45" r="22" fill="%2394a3b8"/><path d="M25 105 c0 -22 18 -35 35 -35 s35 13 35 35 Z" fill="%2394a3b8"/></svg>`;

// --- Save & Persistence Statuses ---
export const SAVING_STATUS = {
  SAVED: 'saved',
  SAVING: 'saving',
  UNSAVED: 'unsaved',
};
export const SAVE_STATUS = SAVING_STATUS;

// --- AI Providers & Models ---
export const SUPPORTED_AI_PROVIDERS = [
  { id: 'ollama', name: 'Ollama Cloud', enabled: true },
  { id: 'openai', name: 'OpenAI (GPT-4o)', enabled: false, badge: 'Coming Soon' },
  { id: 'gemini', name: 'Google Gemini', enabled: false, badge: 'Coming Soon' },
  { id: 'anthropic', name: 'Anthropic Claude', enabled: false, badge: 'Coming Soon' },
];

export const DEFAULT_OLLAMA_MODELS = [
  { id: 'gemma4:latest', name: 'Gemma 4 (Latest)' },
  { id: 'llama3:latest', name: 'Llama 3 (8B)' },
  { id: 'llama3.1:latest', name: 'Llama 3.1 (8B)' },
  { id: 'mistral:latest', name: 'Mistral (7B)' },
  { id: 'gemma2:latest', name: 'Gemma 2 (9B)' },
  { id: 'phi3:latest', name: 'Phi-3 Mini' },
  { id: 'qwen2.5:latest', name: 'Qwen 2.5' },
];

// --- AI Smart Fallback Constants ---
export const ACTION_VERBS_EN = [
  'Architected and implemented',
  'Spearheaded the design of',
  'Engineered high-performance',
  'Streamlined cross-functional',
  'Pioneered scalable solutions for',
  'Orchestrated end-to-end delivery of',
  'Optimized throughput and reliability of',
  'Modernized mission-critical',
  'Delivered production-grade',
  'Formulated automated strategies for',
];

export const METRICS_EN = [
  'resulting in a 35% reduction in latency',
  'driving a 40% increase in operational velocity',
  'cutting deployment cycle times by 50%',
  'achieving 99.99% system availability',
  'generating an estimated $250K in annual operational savings',
  'accelerating feature delivery cycles by 3x',
  'reducing critical bug resolution turnaround by 65%',
];

export const ACTION_VERBS_TR = [
  'Tasarladı ve hayata geçirdi:',
  'Liderlik ederek yeniden yapılandırdı:',
  'Yüksek performanslı mimari geliştirdi:',
  'Uçtan uca teslimatını koordine etti:',
  'Ölçeklenebilir çözümler öncülüğünü yaptı:',
  'Sistem güvenilirliğini ve verimini optimize etti:',
  'Süreçleri modernize ederek otomatikleştirdi:',
  'Üretim standartlarında dağıtımını sağladı:',
];

export const METRICS_TR = [
  'gecikme süresini %35 oranında düşürdü.',
  'operasyonel teslim hızında %40 artış sağladı.',
  'dağıtım döngülerini %50 kısaltarak verimliliği katladı.',
  '%99.99 sistem çalışma süresi (uptime) elde etti.',
  'hata çözüm sürelerini %65 oranında hızlandırdı.',
  'özellik sunum periyotlarını 3 kat hızlandırdı.',
];
