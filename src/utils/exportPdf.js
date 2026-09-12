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

  const opt = {
    margin: [0, 0, 0, 0], // Margins handled by template CSS padding
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2, // 2x resolution for crisp text and graphics
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  return html2pdf().set(opt).from(element).save();
}
