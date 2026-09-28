import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import 'dayjs/locale/en';

/**
 * Formats a YYYY-MM date string into a localized format like "Eki 2023" or "Oct 2023"
 * @param {string} dateString - The date string (e.g., "2023-10")
 * @param {string} locale - The locale code ('en' or 'tr')
 * @returns {string} The formatted date string
 */
export const formatDisplayDate = (dateString, locale) => {
  if (!dateString) return '';
  // Check if it's "present", etc.
  if (dateString.toLowerCase() === 'present') return dateString; // Translation is handled elsewhere
  
  const parsed = dayjs(dateString);
  if (!parsed.isValid()) return dateString;

  return parsed.locale(locale).format('MMM YYYY');
};
