/**
 * @file smartFallback.js
 * @description Intelligent built-in AI enhancement engine used as graceful fallback
 * when local or remote Ollama endpoints are unreachable or offline.
 * Supports both English and Turkish localization based on active app language.
 */

import { ACTION_VERBS_EN, METRICS_EN, ACTION_VERBS_TR, METRICS_TR } from '../constants.js';

export { ACTION_VERBS_EN, METRICS_EN, ACTION_VERBS_TR, METRICS_TR };

/**
 * Enhances a bullet point with STAR methodology or specified style.
 * @param {string} text - Raw bullet text
 * @param {string} [style='action'] - 'action' | 'concise' | 'executive'
 * @param {string} [locale='en'] - 'en' | 'tr'
 * @returns {string} High-impact enhanced bullet
 */
export function enhanceBulletFallback(text = '', style = 'action', locale = 'en') {
  const isTurkish = locale === 'tr';
  const clean = text.replace(/^[•\-*]\s*/, '').trim();

  if (!clean) {
    return isTurkish
      ? 'Ölçeklenebilir mikroservis mimarileri ve sağlam CI/CD otomasyonları tasarlayarak %99.9 sistem erişilebilirliğini sağlarken özellik teslimatını %40 hızlandırdı.'
      : 'Architected scalable microservices and robust CI/CD automation, accelerating feature delivery by 40% while ensuring 99.9% system availability.';
  }

  if (isTurkish) {
    const randomVerb = ACTION_VERBS_TR[Math.floor(Math.random() * ACTION_VERBS_TR.length)];
    const randomMetric = METRICS_TR[Math.floor(Math.random() * METRICS_TR.length)];

    const stripped = clean
      .replace(/^(çalıştı|sorumluydu|yaptı|görev aldı|yardımcı oldu)\s+/i, '')
      .trim();

    if (style === 'concise') {
      return `${stripped} süreçlerini optimize ederek ${randomMetric.split(' ').slice(0, 4).join(' ')}.`;
    }
    if (style === 'executive') {
      return `${stripped} inisiyatifinin stratejik yürütülmesine liderlik etti; paydaş hedeflerini uyumlaştırarak ${randomMetric}.`;
    }
    return `${randomVerb} ${stripped} süreçlerini modernize ederek ${randomMetric}.`;
  }

  const randomVerb = ACTION_VERBS_EN[Math.floor(Math.random() * ACTION_VERBS_EN.length)];
  const randomMetric = METRICS_EN[Math.floor(Math.random() * METRICS_EN.length)];

  const stripped = clean
    .replace(/^(worked on|responsible for|helped with|managed to|did|assisted in)\s+/i, '')
    .trim();

  const capitalized = stripped.charAt(0).toLowerCase() + stripped.slice(1);

  if (style === 'concise') {
    return `${randomVerb} ${capitalized}, ${randomMetric.split(' ')[0]} ${randomMetric.split(' ').slice(1, 4).join(' ')}.`;
  }

  if (style === 'executive') {
    return `Spearheaded strategic execution of ${capitalized}, aligning cross-functional stakeholder initiatives and ${randomMetric}.`;
  }

  return `${randomVerb} ${capitalized}, ${randomMetric}.`;
}

/**
 * Generates a professional summary paragraph based on role and skills.
 * @param {string} role
 * @param {string} [skills='']
 * @param {string} [locale='en']
 * @returns {string} Professional summary
 */
export function generateSummaryFallback(
  role = 'Senior Software Engineer',
  skills = '',
  locale = 'en'
) {
  const isTurkish = locale === 'tr';

  if (isTurkish) {
    const skillList = skills
      ? `${skills} alanlarında derin teknik uzmanlığa sahip`
      : 'ölçeklenebilir sistem tasarımı ve modern yazılım mimarilerinde derin uzmanlığa sahip';
    return `Sonuç odaklı ${role || 'Profesyonel'}, ${skillList}. Yüksek performanslı mühendislik takımlarına liderlik etme, dayanıklı dijital çözümler tasarlama ve üretim süreçlerini optimize etme konusunda kanıtlanmış başarı geçmişi. Teknik vizyonu somut iş değeriyle birleştirerek yenilikçi ve yüksek etkili ürünleri zamanında teslim eder.`;
  }

  const skillList = skills
    ? `with core expertise across ${skills}`
    : 'with deep technical expertise in scalable system design and modern web architecture';
  return `Results-driven ${role || 'Professional'} ${skillList}. Proven track record of architecting resilient digital solutions, leading high-velocity engineering teams, and optimizing production workflows. Adept at bridging technical vision with business value to deliver high-impact products on time and at scale.`;
}

/**
 * Generates a list of recommended skills for a given job title.
 * @param {string} role
 * @param {string} [locale='en']
 * @returns {string} Comma-separated skills
 */
export function suggestSkillsFallback(role = '', locale = 'en') {
  const normalized = role.toLowerCase();
  const isTurkish = locale === 'tr';

  if (normalized.includes('front') || normalized.includes('react') || normalized.includes('ui')) {
    return isTurkish
      ? 'React 19, TypeScript, Next.js, Tailwind CSS, Durum Yönetimi (Zustand/Redux), Vite, Web Performansı, Erişilebilirlik (a11y), GraphQL, Jest/Vitest'
      : 'React 19, TypeScript, Next.js, Tailwind CSS, State Management (Zustand/Redux), Vite, Web Performance, Accessibility (a11y), GraphQL, Jest/Vitest';
  }
  if (normalized.includes('back') || normalized.includes('node') || normalized.includes('api')) {
    return isTurkish
      ? 'Node.js, TypeScript, PostgreSQL, Redis, Docker, Kubernetes, Mikroservis Mimarisi, REST & gRPC, CI/CD, AWS/GCP, Kafka'
      : 'Node.js, TypeScript, PostgreSQL, Redis, Docker, Kubernetes, Microservices Architecture, REST & gRPC, CI/CD, AWS/GCP, Kafka';
  }
  if (
    normalized.includes('data') ||
    normalized.includes('ai') ||
    normalized.includes('machine') ||
    normalized.includes('veri') ||
    normalized.includes('yapay zeka')
  ) {
    return isTurkish
      ? 'Python, PyTorch, SQL, Apache Spark, Büyük Dil Modelleri (LLM), LangChain, Vektör Veritabanları, Veri Boru Hatları, Docker, MLOps'
      : 'Python, PyTorch, SQL, Apache Spark, Large Language Models (LLMs), LangChain, Vector Databases, Data Pipelines, Docker, AWS SageMaker';
  }
  if (
    normalized.includes('product') ||
    normalized.includes('manager') ||
    normalized.includes('ürün')
  ) {
    return isTurkish
      ? 'Ürün Stratejisi, Yol Haritası Planlama, Çevik / Scrum, Kullanıcı Deneyimi Araştırması, Veri Analitiği, A/B Testleri, Paydaş Yönetimi, JIRA, OKR'
      : 'Product Strategy, Roadmap Planning, Agile/Scrum, User Research, Data Analytics, A/B Testing, Stakeholder Management, JIRA, OKRs, Go-to-Market';
  }

  return isTurkish
    ? 'TypeScript, React, Node.js, Bulut Mimarisi (AWS/GCP), CI/CD Otomasyonu, RESTful API, Docker, Sistem Tasarımı, Çevik Liderlik, Problem Çözme'
    : 'TypeScript, React, Node.js, Cloud Architecture (AWS/GCP), CI/CD Automation, RESTful APIs, Docker, System Design, Agile Leadership, Problem Solving';
}

/**
 * Universal fallback dispatcher that inspects prompt content and language instruction.
 * @param {string} prompt
 * @param {string} [locale='en']
 * @returns {string} Generated response
 */
export function getSmartFallback(prompt = '', locale = 'en') {
  // Infer locale if explicitly present in prompt
  const detectedLocale =
    prompt.includes('Turkish (Türkçe)') || prompt.includes('Türkçe') || locale === 'tr'
      ? 'tr'
      : 'en';

  if (
    prompt.includes('bullet point:') ||
    prompt.includes('resume bullet point') ||
    prompt.includes('madde')
  ) {
    const originalMatch = prompt.split('Original bullet point:')[1];
    const text = originalMatch ? originalMatch.trim() : prompt;
    let style = 'action';
    if (prompt.includes('ultra-concise') || prompt.includes('özlü ve vurucu')) style = 'concise';
    if (prompt.includes('strategic language') || prompt.includes('stratejik ve profesyonel'))
      style = 'executive';
    return enhanceBulletFallback(text, style, detectedLocale);
  }

  if (
    prompt.includes('professional summary') ||
    prompt.includes('Target Job Title:') ||
    prompt.includes('profesyonel özet')
  ) {
    const jobMatch = prompt.match(/Target Job Title:\s*(.*)/i);
    const skillsMatch = prompt.match(/Core Skills:\s*(.*)/i);
    const role = jobMatch
      ? jobMatch[1].trim()
      : detectedLocale === 'tr'
        ? 'Kıdemli Yazılım Mühendisi'
        : 'Senior Software Engineer';
    const skills = skillsMatch ? skillsMatch[1].trim() : '';
    return generateSummaryFallback(role, skills, detectedLocale);
  }

  if (
    prompt.includes('Suggest the top') ||
    prompt.includes('technical recruiter') ||
    prompt.includes('yetenek')
  ) {
    const roleMatch = prompt.match(/for a "(.*?)" resume/i);
    const role = roleMatch ? roleMatch[1] : '';
    return suggestSkillsFallback(role, detectedLocale);
  }

  return detectedLocale === 'tr'
    ? 'Teknik teslimatları başarıyla optimize etti, operasyonel güvenilirliği %35 artırdı ve takım içi işbirliğini verimli hale getirdi.'
    : 'Enhanced and optimized technical deliverables, improving operational reliability by 35% and streamlining team collaboration.';
}
