import { saveAs } from 'file-saver';
import { resumeSchema } from '../schemas/resume.schema.js';

/**
 * @file jsonResume.js
 * @description Export and import utilities for resume data in JSON format.
 * Includes schema validation and graceful fallback handling.
 */

/**
 * Exports the active resume data as a downloadable .json file.
 * @param {object} resumeData - The current resume state
 * @param {string} [filename] - Optional custom filename
 */
export function exportResumeToJson(resumeData, filename) {
  const candidateName = resumeData?.personalInfo?.fullName
    ? resumeData.personalInfo.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_')
    : 'resume';
  const name = filename || `${candidateName}_ozcraft_export.json`;

  const payload = {
    app: 'OzCraft',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    data: resumeData,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  saveAs(blob, name);
}

/**
 * Parses and validates an uploaded JSON string or file content against the Zod schema.
 * @param {string} jsonString - The raw JSON string
 * @returns {{ success: boolean, data?: object, error?: string }}
 */
export function parseAndValidateResumeJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    // If the file was exported by OzCraft / Resumio, look inside parsed.data, otherwise check root
    const resumeCandidate = parsed.data || parsed;

    const validation = resumeSchema.safeParse(resumeCandidate);
    if (!validation.success) {
      const errorMsg = validation.error.errors
        .slice(0, 3)
        .map((e) => `${e.path.join('.') || 'field'}: ${e.message}`)
        .join('; ');
      return {
        success: false,
        error: `Schema validation failed: ${errorMsg}`,
      };
    }

    return {
      success: true,
      data: validation.data,
    };
  } catch (err) {
    return {
      success: false,
      error: `Invalid JSON file syntax: ${err.message}`,
    };
  }
}
