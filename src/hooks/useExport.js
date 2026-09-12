import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { exportResumeToPdf } from '../utils/exportPdf.js';
import { exportResumeToDocx } from '../utils/exportDocx.js';
import { exportResumeToJson } from '../utils/jsonResume.js';
import { useLocale } from './useLocale.js';

/**
 * @file useExport.js
 * @description Hook managing PDF, DOCX, and JSON exports with loading indicators,
 * locale propagation, and notistack toast notifications.
 */

/**
 * Custom hook providing export actions.
 * @param {object} resumeData - Current resume data
 * @param {React.RefObject<HTMLElement>} previewRef - Reference to the preview DOM container
 */
export function useExport(resumeData, previewRef) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState(null); // 'pdf' | 'docx' | 'json'
  const { enqueueSnackbar } = useSnackbar();
  const { t, locale } = useLocale();

  const candidateName = resumeData?.personalInfo?.fullName || 'Resume';

  /**
   * Triggers high-fidelity PDF export.
   */
  const handleExportPdf = useCallback(async () => {
    if (!previewRef || !previewRef.current) {
      enqueueSnackbar('Preview element not available for export', { variant: 'warning' });
      return;
    }

    try {
      setIsExporting(true);
      setExportType('pdf');
      enqueueSnackbar(t('export.generating'), { variant: 'info', autoHideDuration: 2500 });
      await exportResumeToPdf(previewRef.current, candidateName);
      enqueueSnackbar(t('export.success'), { variant: 'success' });
    } catch (err) {
      console.error('PDF Export Error:', err);
      enqueueSnackbar(`PDF export failed: ${err.message}`, { variant: 'error' });
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  }, [previewRef, candidateName, enqueueSnackbar, t]);

  /**
   * Triggers native Microsoft Word (.docx) export with active locale.
   */
  const handleExportDocx = useCallback(async () => {
    try {
      setIsExporting(true);
      setExportType('docx');
      enqueueSnackbar(t('export.generating'), { variant: 'info', autoHideDuration: 2500 });
      await exportResumeToDocx(resumeData, { locale });
      enqueueSnackbar(t('export.success'), { variant: 'success' });
    } catch (err) {
      console.error('Word Export Error:', err);
      enqueueSnackbar(`Word export failed: ${err.message}`, { variant: 'error' });
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  }, [resumeData, enqueueSnackbar, t, locale]);

  /**
   * Triggers JSON backup export.
   */
  const handleExportJson = useCallback(() => {
    try {
      exportResumeToJson(resumeData);
      enqueueSnackbar(t('export.success'), { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(`JSON export failed: ${err.message}`, { variant: 'error' });
    }
  }, [resumeData, enqueueSnackbar, t]);

  return {
    exportPdf: handleExportPdf,
    exportDocx: handleExportDocx,
    exportJson: handleExportJson,
    isExporting,
    exportType,
  };
}
