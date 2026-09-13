import html2pdf from 'html2pdf.js';

/**
 * @file exportPdf.js
 * @description High-fidelity PDF generation utility using html2pdf.js.
 * Ensures proper A4 page dimensions, margins, and crisp text rendering.
 */

/**
 * Exports a target DOM element as a high-resolution PDF document.
 * @param {HTMLElement} element - The DOM node representing the resume preview
 * @param {string} candidateName - Full name of the candidate for the filename
 * @returns {Promise<void>}
 */
export async function exportResumeToPdf(element, candidateName = 'Resume') {
  if (!element) {
    throw new Error('No resume element found to export.');
  }

  const safeName = candidateName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');
  const filename = `${safeName || 'resume'}_cv.pdf`;

  // Count rendered A4 page sheets to know exact expected page count
  const sheets = element.querySelectorAll('.resume-page-sheet');
  const expectedPageCount = sheets.length || 1;

  // Temporarily hide UI headers and remove card shadows/margins for clean PDF rasterization
  const uiHeaders = element.querySelectorAll('.html2pdf__ignore');
  const originalHeaderDisplays = [];
  uiHeaders.forEach((el, i) => {
    originalHeaderDisplays[i] = el.style.display;
    el.style.display = 'none';
  });

  const wrappers = element.querySelectorAll('.resume-page-wrapper');
  const originalWrapperMargins = [];
  wrappers.forEach((w, i) => {
    originalWrapperMargins[i] = w.style.marginBottom;
    w.style.marginBottom = '0';
    w.style.paddingBottom = '0';
  });

  const originalShadows = [];
  const originalRadii = [];
  sheets.forEach((s, i) => {
    originalShadows[i] = s.style.boxShadow;
    originalRadii[i] = s.style.borderRadius;
    s.style.boxShadow = 'none';
    s.style.borderRadius = '0';
  });

  const opt = {
    margin: [0, 0, 0, 0], // Default 16mm padding is built into each page sheet
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2, // 2x resolution for crisp text and graphics
      useCORS: true,
      letterRendering: true,
      logging: false,
      backgroundColor: '#ffffff',
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: { mode: ['css', 'legacy'] },
  };

  try {
    return await html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        // Strip any trailing blank pages caused by subpixel floating point overflow
        while (pdf.internal.getNumberOfPages() > expectedPageCount) {
          pdf.deletePage(pdf.internal.getNumberOfPages());
        }
      })
      .save();
  } finally {
    // Restore UI styles for preview
    uiHeaders.forEach((el, i) => {
      el.style.display = originalHeaderDisplays[i];
    });
    wrappers.forEach((w, i) => {
      w.style.marginBottom = originalWrapperMargins[i];
    });
    sheets.forEach((s, i) => {
      s.style.boxShadow = originalShadows[i];
      s.style.borderRadius = originalRadii[i];
    });
  }
}
