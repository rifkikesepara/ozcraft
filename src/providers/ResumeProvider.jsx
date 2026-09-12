import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_RESUME_DATA } from '../utils/initialData.js';
import { validateResume } from '../schemas/resume.schema.js';
import {
  RESUME_STORAGE_KEY,
  LEGACY_RESUME_STORAGE_KEY,
  DEFAULT_SECTION_ORDER,
  SAVING_STATUS,
  SAVE_STATUS,
} from '../utils/constants.js';

/**
 * @file ResumeProvider.jsx
 * @description Context provider managing the entire resume data state.
 * Implements debounced auto-saving to localStorage, dynamic drag-and-drop section reordering,
 * schema validation, draft restoration, and seamless updates across all forms and live preview.
 */

const ResumeContext = createContext(null);

/**
 * Custom hook to access and mutate resume data.
 */
export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

/**
 * ResumeProvider component.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function ResumeProvider({ children }) {
  // All state & refs at the top of the component
  const [saveStatus, setSaveStatus] = useState(SAVING_STATUS.SAVED);
  const debounceTimerRef = useRef(null);
  const isFirstRender = useRef(true);
  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved =
        localStorage.getItem(RESUME_STORAGE_KEY) || localStorage.getItem(LEGACY_RESUME_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const validated = validateResume(parsed);
        if (validated.success) {
          return {
            ...validated.data,
            sectionOrder: validated.data.sectionOrder || DEFAULT_SECTION_ORDER,
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load draft from localStorage:', e);
    }
    return INITIAL_RESUME_DATA;
  });

  // Debounced auto-save effect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus(SAVING_STATUS.UNSAVED);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setSaveStatus(SAVING_STATUS.SAVING);
      try {
        localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resumeData));
        setTimeout(() => setSaveStatus(SAVING_STATUS.SAVED), 350);
      } catch (err) {
        console.error('LocalStorage save error:', err);
        setSaveStatus(SAVING_STATUS.UNSAVED);
      }
    }, 600);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [resumeData]);

  /**
   * Updates a top-level section of the resume (e.g. personalInfo, experience, etc.)
   */
  const updateSection = useCallback((sectionKey, value) => {
    setResumeData((prev) => ({
      ...prev,
      [sectionKey]: typeof value === 'function' ? value(prev[sectionKey]) : value,
    }));
  }, []);

  /**
   * Updates the render order of sections (driven by drag and drop).
   * @param {string[]} sectionOrder - Array of section keys in new order
   */
  const setSectionOrder = useCallback((sectionOrder) => {
    setResumeData((prev) => ({ ...prev, sectionOrder }));
  }, []);

  /**
   * Sets the active CV template.
   * @param {string} templateId - e.g. 'modern', 'executive', 'creative', 'compact'
   */
  const setTemplateId = useCallback((templateId) => {
    setResumeData((prev) => ({ ...prev, templateId }));
  }, []);

  /**
   * Sets the resume theme accent color.
   * @param {string} color - Hex color code
   */
  const setThemeColor = useCallback((themeColor) => {
    setResumeData((prev) => ({ ...prev, themeColor }));
  }, []);

  /**
   * Sets the preview font family.
   * @param {string} fontFamily - Font family name
   */
  const setFontFamily = useCallback((fontFamily) => {
    setResumeData((prev) => ({ ...prev, fontFamily }));
  }, []);

  /**
   * Replaces current resume state with an imported or validated payload.
   * @param {object} newData
   */
  const loadResumeData = useCallback((newData) => {
    const validation = validateResume(newData);
    if (validation.success) {
      const dataWithOrder = {
        ...validation.data,
        sectionOrder: validation.data.sectionOrder || DEFAULT_SECTION_ORDER,
      };
      setResumeData(dataWithOrder);
      try {
        localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(dataWithOrder));
        setSaveStatus(SAVE_STATUS.SAVED);
      } catch {}
    } else {
      throw new Error(validation.error || 'Invalid resume structure');
    }
  }, []);

  /**
   * Resets resume data back to default sample template.
   */
  const resetToDefault = useCallback(() => {
    setResumeData(INITIAL_RESUME_DATA);
    try {
      localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(INITIAL_RESUME_DATA));
      setSaveStatus(SAVE_STATUS.SAVED);
    } catch {}
  }, []);

  /**
   * Clears all resume fields to empty strings/arrays for a blank slate.
   */
  const clearAll = useCallback(() => {
    const emptyState = {
      templateId: 'modern',
      themeColor: '#0f172a',
      fontFamily: 'Inter',
      sectionOrder: DEFAULT_SECTION_ORDER,
      personalInfo: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
        avatar: '',
        showPhoto: false,
        avatarShape: 'circle',
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      customSections: [],
    };
    setResumeData(emptyState);
    try {
      localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(emptyState));
      setSaveStatus(SAVE_STATUS.SAVED);
    } catch {}
  }, []);

  /**
   * Manually triggers immediate save to LocalStorage.
   */
  const manualSave = useCallback(() => {
    try {
      setSaveStatus(SAVING_STATUS.SAVING);
      localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resumeData));
      setTimeout(() => setSaveStatus(SAVING_STATUS.SAVED), 200);
      return true;
    } catch {
      setSaveStatus(SAVING_STATUS.UNSAVED);
      return false;
    }
  }, [resumeData]);

  const value = {
    resumeData,
    setResumeData,
    updateSection,
    sectionOrder: resumeData?.sectionOrder || DEFAULT_SECTION_ORDER,
    setSectionOrder,
    setTemplateId,
    setThemeColor,
    setFontFamily,
    loadResumeData,
    resetToDefault,
    clearAll,
    manualSave,
    saveStatus,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}
