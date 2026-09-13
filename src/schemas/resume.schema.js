import { z } from 'zod';
import { DEFAULT_SECTION_ORDER } from '../utils/constants.js';

export { DEFAULT_SECTION_ORDER };

/**
 * Personal contact information schema.
 */
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  jobTitle: z.string().min(1, 'Target job title is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional().default(''),
  location: z.string().optional().default(''),
  website: z.string().optional().default(''),
  linkedin: z.string().optional().default(''),
  github: z.string().optional().default(''),
  avatar: z.string().optional().default(''),
  showPhoto: z.boolean().default(true),
  avatarShape: z.enum(['circle', 'rounded', 'square']).default('circle'),
});

/**
 * Single work experience entry schema.
 */
export const experienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  current: z.boolean().default(false),
  highlights: z.array(z.string()).default([]),
});

/**
 * Single education entry schema.
 */
export const educationItemSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().optional().default(''),
  location: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  gpa: z.string().optional().default(''),
  highlights: z.array(z.string()).default([]),
});

/**
 * Skill category schema containing a list of skills.
 */
export const skillCategorySchema = z.object({
  id: z.string(),
  category: z.string().min(1, 'Category name is required'),
  items: z.array(z.string()).default([]),
});

/**
 * Portfolio project entry schema.
 */
export const projectItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional().default(''),
  link: z.string().optional().default(''),
  technologies: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
});

/**
 * Certification schema.
 */
export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().optional().default(''),
  date: z.string().optional().default(''),
  url: z.string().optional().default(''),
});

/**
 * Reference entry schema.
 */
export const referenceItemSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1, 'Reference name is required'),
  company: z.string().optional().default(''),
  position: z.string().optional().default(''),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
});

/**
 * Language proficiency schema.
 */
export const languageItemSchema = z.object({
  id: z.string(),
  language: z.string().min(1, 'Language name is required'),
  proficiency: z.string().optional().default('Native / Fluent'),
});

/**
 * Custom section item schema for custom headings.
 */
export const customSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Section title is required'),
  items: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().default(''),
        subtitle: z.string().optional().default(''),
        date: z.string().optional().default(''),
        description: z.string().optional().default(''),
      })
    )
    .default([]),
});

/**
 * Comprehensive Resume Schema defining the full CV document.
 */
export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string().optional().default(''),
  experience: z.array(experienceItemSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  skills: z.array(skillCategorySchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  certifications: z.array(certificationItemSchema).default([]),
  languages: z.array(languageItemSchema).default([]),
  references: z.array(referenceItemSchema).default([]),
  customSections: z.array(customSectionSchema).default([]),
  sectionOrder: z.array(z.string()).default(DEFAULT_SECTION_ORDER),
  disabledSections: z.array(z.string()).default([]),
  templateId: z.string().default('modern'),
  themeColor: z.string().default('#0f172a'),
  fontFamily: z.string().default('Inter'),
});

/**
 * Validates any object against the resume schema.
 * @param {unknown} data - Raw data to validate
 * @returns {{ success: boolean, data?: object, error?: string }} Result object
 */
export function validateResume(data) {
  const result = resumeSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const formattedError = result.error.errors
    .map((err) => `${err.path.join('.')}: ${err.message}`)
    .join(', ');
  return { success: false, error: formattedError };
}
