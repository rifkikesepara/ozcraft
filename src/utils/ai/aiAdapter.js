/**
 * @file aiAdapter.js
 * @description Base interface and standardized prompt templates for AI integrations.
 * Any new AI provider (OpenAI, Gemini, Anthropic) implements this contract.
 */

/**
 * Generates an explicit language requirement string for prompt templates.
 * @param {string} [locale='en'] - 'en' | 'tr'
 * @returns {string} Language instruction
 */
export const getLanguageInstruction = (locale = 'en') => {
  if (locale === 'tr') {
    return 'CRITICAL LANGUAGE REQUIREMENT: The entire output MUST be written in fluent, natural, professional Turkish (Türkçe). Use standard Turkish resume terminology (e.g., "geliştirdi", "yönetti", "tasarladı", "optimize etti", "artırdı"). Do NOT generate in English or mix English sentences.';
  }
  return 'CRITICAL LANGUAGE REQUIREMENT: The entire output MUST be written in polished, professional English standard for an international CV or resume. Do NOT use non-English words.';
};

/**
 * Common prompt strategies for resume generation and enhancement.
 */
export const AI_PROMPTS = {
  /**
   * Rewrites an experience bullet point using action verbs and measurable metrics (STAR method).
   * @param {string} text - Raw bullet point text
   * @param {string} [style='action'] - Enhancement style: 'action' | 'concise' | 'executive'
   * @param {string} [locale='en'] - Output language code ('en' | 'tr')
   * @returns {string} Prompt string
   */
  enhanceBullet: (text, style = 'action', locale = 'en') => {
    const styleInstructions = {
      action:
        locale === 'tr'
          ? 'Güçlü eylem fiilleri, problem çözme, ölçülebilir metrikler ve iş sonuçlarına (STAR yöntemi) odaklanın.'
          : 'Focus on strong action verbs, problem-solving, quantifiable metrics, and business outcome (STAR method).',
      concise:
        locale === 'tr'
          ? 'Gereksiz dolgu kelimeleri çıkararak son derece net, özlü ve vurucu hale getirin, ana başarıları koruyun.'
          : 'Make it ultra-concise, punchy, and remove filler words while preserving key achievements.',
      executive:
        locale === 'tr'
          ? 'Kıdemli, yönetici veya liderlik profiline uygun üst düzey stratejik ve profesyonel bir dil kullanın.'
          : 'Use high-level strategic language suitable for a senior, staff, or executive leadership profile.',
    };

    const langInstruction = getLanguageInstruction(locale);

    return `You are an expert resume writer and executive career coach.
Please rewrite the following resume bullet point to make it compelling, professional, and ATS-optimized.
${langInstruction}
Guideline: ${styleInstructions[style] || styleInstructions.action}
Important: Return ONLY the rewritten bullet point text itself in the requested language. Do NOT include markdown bullet symbols, quotation marks, explanations, or conversational pleasantries.

Original bullet point:
${text}`;
  },

  /**
   * Generates a professional summary based on job title, skills, and experience highlights.
   * @param {string} jobTitle - Target position
   * @param {string} [skills=''] - Key skills comma separated
   * @param {string} [experienceSummary=''] - Brief highlights
   * @param {string} [locale='en'] - Output language code ('en' | 'tr')
   * @returns {string} Prompt string
   */
  generateSummary: (jobTitle, skills = '', experienceSummary = '', locale = 'en') => {
    const langInstruction = getLanguageInstruction(locale);

    return `You are an elite career coach.
Craft a 3-4 sentence high-impact professional summary for a resume.
${langInstruction}
Target Job Title: ${jobTitle}
Core Skills: ${skills}
Background Highlights: ${experienceSummary}

Guidelines:
- Emphasize value delivered, technical competencies, and leadership capability.
- Use confident, third-person or implied-first-person voice without conversational filler.
- Return ONLY the summary paragraph in the requested language without headings, quotes, or conversational filler.`;
  },

  /**
   * Recommends relevant technical and soft skills for a given role.
   * @param {string} jobTitle - Target position
   * @param {string} [locale='en'] - Output language code ('en' | 'tr')
   * @returns {string} Prompt string
   */
  suggestSkills: (jobTitle, locale = 'en') => {
    const langInstruction = getLanguageInstruction(locale);

    return `You are a technical recruiter.
Suggest the top 8-12 most in-demand technical and domain skills for a "${jobTitle}" resume in 2026.
${langInstruction}
Return ONLY a comma-separated list of skill names (e.g. React, TypeScript, Docker, Sistem Tasarımı, CI/CD).
Do not include numbering, bullets, or extra explanatory text.`;
  },
};

/**
 * Base abstract class/contract defining the interface every AI adapter must implement.
 */
export class BaseAIAdapter {
  /**
   * @param {string} id - Provider identifier
   * @param {string} name - Display name
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  /**
   * Generates or rewrites text given a prompt.
   * @param {object} params
   * @param {string} params.prompt - Input prompt
   * @param {string} [params.model] - Model name
   * @param {string} [params.systemPrompt] - Optional system instructions
   * @returns {Promise<string>} Generated text
   */
  async generateText({ prompt: _prompt, model: _model, systemPrompt: _systemPrompt } = {}) {
    throw new Error('generateText() must be implemented by concrete adapter');
  }

  /**
   * Lists available models for this provider.
   * @returns {Promise<Array<{ id: string, name: string }>>}
   */
  async listModels() {
    throw new Error('listModels() must be implemented by concrete adapter');
  }

  /**
   * Tests connection to the provider API.
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async testConnection() {
    throw new Error('testConnection() must be implemented by concrete adapter');
  }
}
