import React from 'react';
import { ModernTemplate } from './ModernTemplate.jsx';
import { ExecutiveTemplate } from './ExecutiveTemplate.jsx';
import { SidebarSplitTemplate } from './SidebarSplitTemplate.jsx';
import { CompactTemplate } from './CompactTemplate.jsx';

/**
 * @file templateRegistry.js
 * @description Centralized, pluggable template registry.
 * Defines the uniform template contract ({ data, themeColor, customizations })
 * and enables adding future templates with a single registry entry.
 */

export const TEMPLATE_REGISTRY = {
  modern: {
    id: 'modern',
    name: 'Modern Minimalist',
    nameKey: 'templates.items.modern.name',
    description:
      'Clean single-column layout with high hierarchy, pill skill badges, and ATS optimization.',
    descriptionKey: 'templates.items.modern.description',
    category: 'tech',
    tags: ['ATS-Friendly', 'Single Column', 'Tech & Engineering'],
    tagKeys: [
      'templates.tags.atsFriendly',
      'templates.tags.singleColumn',
      'templates.tags.techEngineering',
    ],
    component: ModernTemplate,
  },
  executive: {
    id: 'executive',
    name: 'Executive Classic',
    nameKey: 'templates.items.executive.name',
    description:
      'Traditional corporate layout featuring serif headings, horizontal dividers, and formal chronology.',
    descriptionKey: 'templates.items.executive.description',
    category: 'corporate',
    tags: ['Leadership', 'Corporate', 'Finance & Law'],
    tagKeys: ['templates.tags.leadership', 'templates.tags.corporate', 'templates.tags.financeLaw'],
    component: ExecutiveTemplate,
  },
  sidebar: {
    id: 'sidebar',
    name: 'Creative Split',
    nameKey: 'templates.items.sidebar.name',
    description:
      'Two-column design with a distinct accent sidebar for personal details, skills, and languages.',
    descriptionKey: 'templates.items.sidebar.description',
    category: 'creative',
    tags: ['Two Columns', 'Sidebar', 'Design & Product'],
    tagKeys: [
      'templates.tags.twoColumns',
      'templates.tags.sidebar',
      'templates.tags.designProduct',
    ],
    component: SidebarSplitTemplate,
  },
  compact: {
    id: 'compact',
    name: 'Compact Impact',
    nameKey: 'templates.items.compact.name',
    description:
      'Space-optimized, dense layout engineered to fit rich career experiences onto one clean page.',
    descriptionKey: 'templates.items.compact.description',
    category: 'compact',
    tags: ['High Density', '1-Page', 'Academic & New Grad'],
    tagKeys: [
      'templates.tags.highDensity',
      'templates.tags.onePage',
      'templates.tags.academicNewGrad',
    ],
    component: CompactTemplate,
  },
};

/**
 * Returns an array of all registered templates for display in galleries and selectors.
 * If translation function `t` is provided, template name, description, and tags are localized.
 * @param {(key: string) => string} [t] - Optional translation function from useLocale
 * @returns {Array<typeof TEMPLATE_REGISTRY[keyof typeof TEMPLATE_REGISTRY]>}
 */
export function getTemplateList(t) {
  return Object.values(TEMPLATE_REGISTRY).map((tpl) => {
    if (!t) return tpl;
    const name = tpl.nameKey && t(tpl.nameKey) !== tpl.nameKey ? t(tpl.nameKey) : tpl.name;
    const description =
      tpl.descriptionKey && t(tpl.descriptionKey) !== tpl.descriptionKey
        ? t(tpl.descriptionKey)
        : tpl.description;
    const tags = tpl.tagKeys
      ? tpl.tagKeys.map((k, i) => (t(k) !== k ? t(k) : tpl.tags[i]))
      : tpl.tags;
    return {
      ...tpl,
      name,
      description,
      tags,
    };
  });
}

/**
 * Retrieves a template component by its identifier, falling back to ModernTemplate.
 * @param {string} templateId - e.g. 'modern', 'executive', 'sidebar', 'compact'
 * @returns {React.ComponentType<{ data: object, themeColor?: string, customizations?: object }>}
 */
export function getTemplateComponent(templateId) {
  const registered = TEMPLATE_REGISTRY[templateId];
  return registered ? registered.component : ModernTemplate;
}
