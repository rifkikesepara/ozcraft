import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  ImageRun,
} from 'docx';
import fileSaver from 'file-saver';

const saveAs = fileSaver?.saveAs || fileSaver;

/**
 * @file exportDocx.js
 * @description Generates a native Microsoft Word (.docx) file matching the exact selected template
 * (Modern Minimalist, Executive Classic, Creative Split, Compact Impact), accent color, and section configuration.
 */

/**
 * Sanitizes and strips '#' from hex color strings for DOCX compliance.
 * @param {string} hex
 * @param {string} [fallback='1e293b']
 * @returns {string} Clean hex color string (e.g. '2563eb')
 */
function cleanHex(hex, fallback = '1e293b') {
  if (!hex || typeof hex !== 'string') return fallback;
  const cleaned = hex.replace(/^#/, '').trim();
  if (cleaned.length === 6) return cleaned;
  if (cleaned.length === 3) {
    return cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return fallback;
}

/**
 * Parses and returns an ImageRun for the candidate avatar if valid PNG/JPEG base64 data.
 * @param {string} avatarData
 * @param {number} [size=70]
 * @returns {ImageRun|null}
 */
function getAvatarImageRun(avatarData, size = 70) {
  try {
    if (!avatarData || typeof avatarData !== 'string') return null;
    if (avatarData.includes('svg+xml')) return null; // Vector SVGs are not directly supported by Word ImageRun

    const base64Index = avatarData.indexOf(';base64,');
    if (base64Index === -1) return null;

    const base64Str = avatarData.substring(base64Index + 8);
    let bytes;
    if (typeof atob === 'function') {
      const binaryStr = atob(base64Str);
      bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
    } else if (typeof Buffer !== 'undefined') {
      bytes = Buffer.from(base64Str, 'base64');
    }

    if (!bytes || bytes.length === 0) return null;

    return new ImageRun({
      data: bytes,
      transformation: {
        width: size,
        height: size,
      },
    });
  } catch (err) {
    console.warn('Could not parse avatar for docx export:', err);
    return null;
  }
}

/**
 * Formats an experience date range.
 * @param {object} exp
 * @param {string} presentText
 * @returns {string}
 */
function formatExpDate(exp, presentText = 'Present') {
  const isPresent =
    Boolean(exp.current) || (exp.endDate && exp.endDate.trim().toLowerCase() === 'present');
  const end = isPresent ? presentText : exp.endDate || '';
  if (!exp.startDate && !end) return '';
  if (!exp.startDate) return end;
  if (!end) return exp.startDate;
  return `${exp.startDate} – ${end}`;
}

/**
 * Retrieves localized section headings based on locale and template styling.
 * @param {string} locale
 * @param {string} templateId
 * @returns {object}
 */
function getLocalizedTitles(locale, templateId) {
  const isTr = locale === 'tr';

  if (templateId === 'executive') {
    return isTr
      ? {
          summary: 'YÖNETİCİ PROFİLİ & PROFESYONEL ÖZET',
          experience: 'KARİYER GEÇMİŞİ & PROFESYONEL DENEYİM',
          education: 'AKADEMİK GEÇMİŞ & DİPLOMALAR',
          skills: 'TEMEL YETKİNLİKLER VE UZMANLIK',
          projects: 'STRATEJİK PROJELER & PORTFÖY',
          certifications: 'SERTİFİKALAR & LİSANSLAR',
          languages: 'DİL YETKİNLİKLERİ',
          references: 'YÖNETİCİ REFERANSLARI',
          present: 'Devam Ediyor',
        }
      : {
          summary: 'EXECUTIVE PROFILE & SUMMARY',
          experience: 'CAREER HISTORY & PROFESSIONAL EXPERIENCE',
          education: 'ACADEMIC BACKGROUND & CREDENTIALS',
          skills: 'CORE COMPETENCIES & EXPERTISE',
          projects: 'KEY INITIATIVES & PROJECT PORTFOLIO',
          certifications: 'CERTIFICATIONS & CREDENTIALS',
          languages: 'LANGUAGE PROFICIENCIES',
          references: 'EXECUTIVE REFERENCES',
          present: 'Present',
        };
  }

  return isTr
    ? {
        summary: 'Profesyonel Özet',
        experience: 'İş Deneyimi',
        education: 'Eğitim',
        skills: 'Yetenekler ve Uzmanlık',
        projects: 'Projeler',
        certifications: 'Sertifikalar',
        languages: 'Diller',
        references: 'Referanslar',
        present: 'Devam Ediyor',
      }
    : {
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        skills: 'Skills & Expertise',
        projects: 'Projects',
        certifications: 'Certifications',
        languages: 'Languages',
        references: 'References',
        present: 'Present',
      };
}

/**
 * ---------------------------------------------------------------------------
 * TEMPLATE 1: Modern Minimalist (.docx builder)
 * ---------------------------------------------------------------------------
 */
function buildModernDocx(data, { locale, themeColor, titles, activeSections }) {
  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    references = [],
  } = data || {};

  const children = [];
  const primaryFont = 'Calibri';

  // Optional candidate avatar
  if (personalInfo.showAvatar !== false && personalInfo.avatar) {
    const avatarRun = getAvatarImageRun(personalInfo.avatar, 64);
    if (avatarRun) {
      children.push(
        new Paragraph({
          children: [avatarRun],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        })
      );
    }
  }

  // Header: Full Name
  if (personalInfo.fullName) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personalInfo.fullName,
            bold: true,
            size: 38,
            font: primaryFont,
            color: '0f172a',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
      })
    );
  }

  // Header: Target Job Title
  if (personalInfo.jobTitle) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personalInfo.jobTitle.toUpperCase(),
            bold: true,
            size: 22,
            font: primaryFont,
            color: themeColor,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 140 },
      })
    );
  }

  // Header: Contact Details
  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.website,
    personalInfo.linkedin,
    personalInfo.github,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join('  •  '),
            size: 19,
            font: primaryFont,
            color: '64748b',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 260 },
      })
    );
  }

  const addHeading = (title) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 22,
            font: primaryFont,
            color: themeColor,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        border: {
          bottom: {
            color: themeColor,
            space: 4,
            style: BorderStyle.SINGLE,
            size: 10,
          },
        },
      })
    );
  };

  const sectionMap = {
    summary: () => {
      if (!summary || !summary.trim()) return;
      addHeading(titles.summary);
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: summary.trim(),
              size: 21,
              font: primaryFont,
              color: '334155',
            }),
          ],
          spacing: { after: 180 },
        })
      );
    },

    experience: () => {
      if (!experience || experience.length === 0) return;
      addHeading(titles.experience);
      experience.forEach((exp) => {
        const dates = formatExpDate(exp, titles.present);
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position || '',
                bold: true,
                size: 22,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: exp.company ? ` | ${exp.company}` : '',
                bold: true,
                size: 21,
                font: primaryFont,
                color: themeColor,
              }),
              new TextRun({
                text: exp.location ? ` — ${exp.location}` : '',
                size: 20,
                font: primaryFont,
                color: '64748b',
              }),
              new TextRun({
                text: dates ? `   (${dates})` : '',
                size: 20,
                bold: true,
                font: primaryFont,
                color: '475569',
              }),
            ],
            spacing: { before: 120, after: 60 },
          })
        );

        if (Array.isArray(exp.highlights)) {
          exp.highlights.forEach((hl) => {
            if (hl && hl.trim()) {
              children.push(
                new Paragraph({
                  text: hl.trim(),
                  bullet: { level: 0 },
                  spacing: { after: 50 },
                })
              );
            }
          });
        }
      });
    },

    education: () => {
      if (!education || education.length === 0) return;
      addHeading(titles.education);
      education.forEach((edu) => {
        const dates = `${edu.startDate || ''} – ${edu.endDate || ''}`.trim();
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree || '',
                bold: true,
                size: 22,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: edu.institution ? ` | ${edu.institution}` : '',
                size: 21,
                font: primaryFont,
                color: themeColor,
              }),
              new TextRun({
                text: edu.location ? ` — ${edu.location}` : '',
                size: 20,
                font: primaryFont,
                color: '64748b',
              }),
              new TextRun({
                text: dates && dates !== '–' ? `   (${dates})` : '',
                size: 20,
                font: primaryFont,
                color: '475569',
              }),
            ],
            spacing: { before: 100, after: 40 },
          })
        );
        if (edu.gpa) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `GPA: ${edu.gpa}`,
                  italics: true,
                  size: 20,
                  font: primaryFont,
                  color: '475569',
                }),
              ],
              spacing: { after: 60 },
            })
          );
        }
      });
    },

    skills: () => {
      if (!skills || skills.length === 0) return;
      addHeading(titles.skills);
      skills.forEach((sk) => {
        if (sk.items && sk.items.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${sk.category || (locale === 'tr' ? 'Yetenekler' : 'Skills')}: `,
                  bold: true,
                  size: 21,
                  font: primaryFont,
                  color: '0f172a',
                }),
                new TextRun({
                  text: sk.items.join(', '),
                  size: 21,
                  font: primaryFont,
                  color: '334155',
                }),
              ],
              spacing: { after: 70 },
            })
          );
        }
      });
    },

    projects: () => {
      if (!projects || projects.length === 0) return;
      addHeading(titles.projects);
      projects.forEach((proj) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: proj.name || '',
                bold: true,
                size: 22,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: proj.link ? ` (${proj.link})` : '',
                size: 20,
                font: primaryFont,
                color: themeColor,
              }),
            ],
            spacing: { before: 90, after: 30 },
          })
        );
        if (proj.description) {
          children.push(
            new Paragraph({
              text: proj.description,
              spacing: { after: 60 },
            })
          );
        }
      });
    },

    certifications: () => {
      if (!certifications || certifications.length === 0) return;
      addHeading(titles.certifications);
      certifications.forEach((cert) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cert.name || '',
                bold: true,
                size: 21,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: cert.issuer ? ` (${cert.issuer})` : '',
                italics: true,
                size: 20,
                font: primaryFont,
                color: themeColor,
              }),
              new TextRun({
                text: cert.date ? ` — ${cert.date}` : '',
                size: 20,
                font: primaryFont,
                color: '64748b',
              }),
            ],
            spacing: { after: 60 },
          })
        );
      });
    },

    languages: () => {
      if (!languages || languages.length === 0) return;
      addHeading(titles.languages);
      const langStr = languages.map((l) => `${l.language} (${l.proficiency})`).join('   •   ');
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: langStr,
              size: 21,
              font: primaryFont,
              color: '334155',
            }),
          ],
          spacing: { after: 120 },
        })
      );
    },

    references: () => {
      if (!references || references.length === 0) return;
      addHeading(titles.references);
      references.forEach((ref) => {
        const details = [ref.position, ref.company].filter(Boolean).join(', ');
        const contacts = [ref.email, ref.phone].filter(Boolean).join('  |  ');
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: ref.fullName || '',
                bold: true,
                size: 21,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: details ? ` — ${details}` : '',
                size: 20,
                font: primaryFont,
                color: '475569',
              }),
            ],
            spacing: { before: 80, after: contacts ? 20 : 60 },
          })
        );
        if (contacts) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: contacts,
                  size: 19,
                  font: primaryFont,
                  color: '64748b',
                }),
              ],
              spacing: { after: 60 },
            })
          );
        }
      });
    },
  };

  activeSections.forEach((key) => {
    if (sectionMap[key]) sectionMap[key]();
  });

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 850, right: 850 },
          },
        },
        children,
      },
    ],
  });
}

/**
 * ---------------------------------------------------------------------------
 * TEMPLATE 2: Executive Classic (.docx builder)
 * ---------------------------------------------------------------------------
 */
function buildExecutiveDocx(data, { locale, themeColor, titles, activeSections }) {
  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    references = [],
  } = data || {};

  const children = [];
  const primaryFont = 'Georgia';

  // Optional candidate avatar
  if (personalInfo.showAvatar !== false && personalInfo.avatar) {
    const avatarRun = getAvatarImageRun(personalInfo.avatar, 64);
    if (avatarRun) {
      children.push(
        new Paragraph({
          children: [avatarRun],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        })
      );
    }
  }

  // Header: Full Name (Formal Serif, Centered)
  if (personalInfo.fullName) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personalInfo.fullName,
            bold: true,
            size: 38,
            font: primaryFont,
            color: '0f172a',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 70 },
      })
    );
  }

  // Header: Target Job Title
  if (personalInfo.jobTitle) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personalInfo.jobTitle.toUpperCase(),
            bold: true,
            size: 21,
            font: primaryFont,
            color: '475569',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      })
    );
  }

  // Contact line with elegant vertical pipes
  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.website,
    personalInfo.linkedin,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join('   |   '),
            size: 19,
            font: primaryFont,
            color: '64748b',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        border: {
          bottom: {
            color: themeColor,
            space: 8,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
      })
    );
  }

  const addHeading = (title) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 21,
            font: primaryFont,
            color: themeColor,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 260, after: 100 },
        border: {
          bottom: {
            color: 'cbd5e1',
            space: 4,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
  };

  const sectionMap = {
    summary: () => {
      if (!summary || !summary.trim()) return;
      addHeading(titles.summary);
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: summary.trim(),
              italics: true,
              size: 21,
              font: primaryFont,
              color: '334155',
            }),
          ],
          spacing: { after: 200 },
        })
      );
    },

    experience: () => {
      if (!experience || experience.length === 0) return;
      addHeading(titles.experience);
      experience.forEach((exp) => {
        const dates = formatExpDate(exp, titles.present);
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position || '',
                bold: true,
                size: 22,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: exp.company ? `  —  ${exp.company}` : '',
                italics: true,
                size: 21,
                font: primaryFont,
                color: themeColor,
              }),
              new TextRun({
                text: exp.location ? ` (${exp.location})` : '',
                size: 20,
                font: primaryFont,
                color: '64748b',
              }),
              new TextRun({
                text: dates ? `   [${dates}]` : '',
                size: 20,
                font: primaryFont,
                color: '475569',
              }),
            ],
            spacing: { before: 120, after: 50 },
          })
        );

        if (Array.isArray(exp.highlights)) {
          exp.highlights.forEach((hl) => {
            if (hl && hl.trim()) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: hl.trim(),
                      font: primaryFont,
                      size: 21,
                    }),
                  ],
                  bullet: { level: 0 },
                  spacing: { after: 40 },
                })
              );
            }
          });
        }
      });
    },

    education: () => {
      if (!education || education.length === 0) return;
      addHeading(titles.education);
      education.forEach((edu) => {
        const dates = `${edu.startDate || ''} – ${edu.endDate || ''}`.trim();
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree || '',
                bold: true,
                size: 22,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: edu.institution ? `  —  ${edu.institution}` : '',
                italics: true,
                size: 21,
                font: primaryFont,
                color: themeColor,
              }),
              new TextRun({
                text: edu.location ? ` (${edu.location})` : '',
                size: 20,
                font: primaryFont,
                color: '64748b',
              }),
              new TextRun({
                text: dates && dates !== '–' ? `   [${dates}]` : '',
                size: 20,
                font: primaryFont,
                color: '475569',
              }),
            ],
            spacing: { before: 100, after: 40 },
          })
        );
        if (edu.gpa) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Honors / GPA: ${edu.gpa}`,
                  italics: true,
                  size: 20,
                  font: primaryFont,
                  color: '475569',
                }),
              ],
              spacing: { after: 50 },
            })
          );
        }
      });
    },

    skills: () => {
      if (!skills || skills.length === 0) return;
      addHeading(titles.skills);
      skills.forEach((sk) => {
        if (sk.items && sk.items.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${sk.category || (locale === 'tr' ? 'Uzmanlık' : 'Expertise')}: `,
                  bold: true,
                  size: 21,
                  font: primaryFont,
                  color: '0f172a',
                }),
                new TextRun({
                  text: sk.items.join('  •  '),
                  size: 21,
                  font: primaryFont,
                  color: '334155',
                }),
              ],
              spacing: { after: 60 },
            })
          );
        }
      });
    },

    projects: () => {
      if (!projects || projects.length === 0) return;
      addHeading(titles.projects);
      projects.forEach((proj) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: proj.name || '',
                bold: true,
                size: 22,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: proj.link ? ` — ${proj.link}` : '',
                size: 20,
                font: primaryFont,
                color: themeColor,
              }),
            ],
            spacing: { before: 80, after: 25 },
          })
        );
        if (proj.description) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: proj.description,
                  font: primaryFont,
                  size: 20,
                  color: '334155',
                }),
              ],
              spacing: { after: 50 },
            })
          );
        }
      });
    },

    certifications: () => {
      if (!certifications || certifications.length === 0) return;
      addHeading(titles.certifications);
      certifications.forEach((cert) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cert.name || '',
                bold: true,
                size: 21,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: cert.issuer ? ` | ${cert.issuer}` : '',
                italics: true,
                size: 20,
                font: primaryFont,
                color: themeColor,
              }),
              new TextRun({
                text: cert.date ? ` — ${cert.date}` : '',
                size: 20,
                font: primaryFont,
                color: '64748b',
              }),
            ],
            spacing: { after: 50 },
          })
        );
      });
    },

    languages: () => {
      if (!languages || languages.length === 0) return;
      addHeading(titles.languages);
      const langStr = languages.map((l) => `${l.language} (${l.proficiency})`).join('   |   ');
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: langStr,
              size: 21,
              font: primaryFont,
              color: '334155',
            }),
          ],
          spacing: { after: 100 },
        })
      );
    },

    references: () => {
      if (!references || references.length === 0) return;
      addHeading(titles.references);
      references.forEach((ref) => {
        const details = [ref.position, ref.company].filter(Boolean).join('  —  ');
        const contacts = [ref.email, ref.phone].filter(Boolean).join('   |   ');
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: ref.fullName || '',
                bold: true,
                size: 21,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: details ? ` (${details})` : '',
                italics: true,
                size: 20,
                font: primaryFont,
                color: '475569',
              }),
            ],
            spacing: { before: 70, after: contacts ? 20 : 50 },
          })
        );
        if (contacts) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: contacts,
                  size: 19,
                  font: primaryFont,
                  color: '64748b',
                }),
              ],
              spacing: { after: 50 },
            })
          );
        }
      });
    },
  };

  activeSections.forEach((key) => {
    if (sectionMap[key]) sectionMap[key]();
  });

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 900, right: 900 },
          },
        },
        children,
      },
    ],
  });
}

/**
 * ---------------------------------------------------------------------------
 * TEMPLATE 3: Creative Split (2-Column .docx builder)
 * ---------------------------------------------------------------------------
 */
function buildSidebarDocx(data, { locale, themeColor, titles, activeSections }) {
  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    references = [],
  } = data || {};

  const font = 'Calibri';
  const sidebarSections = ['skills', 'languages'];

  // --- LEFT SIDEBAR CONTENT ---
  const leftChildren = [];

  // Avatar image
  if (personalInfo.showAvatar !== false && personalInfo.avatar) {
    const avatarRun = getAvatarImageRun(personalInfo.avatar, 72);
    if (avatarRun) {
      leftChildren.push(
        new Paragraph({
          children: [avatarRun],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        })
      );
    }
  }

  // Sidebar: Contact Info
  const addSidebarHeading = (title) => {
    leftChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 20,
            font,
            color: themeColor,
          }),
        ],
        spacing: { before: 180, after: 80 },
        border: {
          bottom: {
            color: themeColor,
            space: 2,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
  };

  addSidebarHeading(locale === 'tr' ? 'İletişim' : 'Contact');

  const contactList = [
    { label: 'Email', val: personalInfo.email },
    { label: 'Phone', val: personalInfo.phone },
    { label: 'Location', val: personalInfo.location },
    { label: 'Web', val: personalInfo.website },
    { label: 'LinkedIn', val: personalInfo.linkedin },
    { label: 'GitHub', val: personalInfo.github },
  ].filter((c) => Boolean(c.val));

  contactList.forEach((c) => {
    leftChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${c.val}`,
            size: 18,
            font,
            color: '334155',
          }),
        ],
        spacing: { after: 40 },
      })
    );
  });

  // Sidebar: Skills
  if (skills && skills.length > 0 && activeSections.includes('skills')) {
    addSidebarHeading(titles.skills);
    skills.forEach((sk) => {
      if (sk.items && sk.items.length > 0) {
        leftChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: sk.category || (locale === 'tr' ? 'Yetenekler' : 'Skills'),
                bold: true,
                size: 19,
                font,
                color: '0f172a',
              }),
            ],
            spacing: { before: 60, after: 20 },
          })
        );
        sk.items.forEach((item) => {
          leftChildren.push(
            new Paragraph({
              text: item,
              bullet: { level: 0 },
              spacing: { after: 20 },
            })
          );
        });
      }
    });
  }

  // Sidebar: Languages
  if (languages && languages.length > 0 && activeSections.includes('languages')) {
    addSidebarHeading(titles.languages);
    languages.forEach((l) => {
      leftChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: l.language,
              bold: true,
              size: 19,
              font,
              color: '0f172a',
            }),
            new TextRun({
              text: ` (${l.proficiency})`,
              size: 18,
              font,
              color: '64748b',
            }),
          ],
          spacing: { after: 30 },
        })
      );
    });
  }

  // --- RIGHT MAIN CONTENT ---
  const rightChildren = [];

  // Main Header: Full Name
  if (personalInfo.fullName) {
    rightChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personalInfo.fullName,
            bold: true,
            size: 36,
            font,
            color: '0f172a',
          }),
        ],
        spacing: { after: 40 },
      })
    );
  }

  // Main Header: Job Title
  if (personalInfo.jobTitle) {
    rightChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personalInfo.jobTitle.toUpperCase(),
            bold: true,
            size: 22,
            font,
            color: themeColor,
          }),
        ],
        spacing: { after: 160 },
        border: {
          bottom: {
            color: 'e2e8f0',
            space: 4,
            style: BorderStyle.SINGLE,
            size: 8,
          },
        },
      })
    );
  }

  const addMainHeading = (title) => {
    rightChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 21,
            font,
            color: themeColor,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 90 },
        border: {
          bottom: {
            color: themeColor,
            space: 3,
            style: BorderStyle.SINGLE,
            size: 8,
          },
        },
      })
    );
  };

  const mainSectionMap = {
    summary: () => {
      if (!summary || !summary.trim()) return;
      addMainHeading(titles.summary);
      rightChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: summary.trim(),
              size: 20,
              font,
              color: '334155',
            }),
          ],
          spacing: { after: 160 },
        })
      );
    },

    experience: () => {
      if (!experience || experience.length === 0) return;
      addMainHeading(titles.experience);
      experience.forEach((exp) => {
        const dates = formatExpDate(exp, titles.present);
        rightChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position || '',
                bold: true,
                size: 21,
                font,
                color: '0f172a',
              }),
              new TextRun({
                text: exp.company ? ` | ${exp.company}` : '',
                bold: true,
                size: 20,
                font,
                color: themeColor,
              }),
              new TextRun({
                text: dates ? `  (${dates})` : '',
                size: 19,
                font,
                color: '64748b',
              }),
            ],
            spacing: { before: 100, after: 40 },
          })
        );
        if (Array.isArray(exp.highlights)) {
          exp.highlights.forEach((hl) => {
            if (hl && hl.trim()) {
              rightChildren.push(
                new Paragraph({
                  text: hl.trim(),
                  bullet: { level: 0 },
                  spacing: { after: 30 },
                })
              );
            }
          });
        }
      });
    },

    education: () => {
      if (!education || education.length === 0) return;
      addMainHeading(titles.education);
      education.forEach((edu) => {
        const dates = `${edu.startDate || ''} – ${edu.endDate || ''}`.trim();
        rightChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree || '',
                bold: true,
                size: 21,
                font,
                color: '0f172a',
              }),
              new TextRun({
                text: edu.institution ? ` | ${edu.institution}` : '',
                size: 20,
                font,
                color: themeColor,
              }),
              new TextRun({
                text: dates && dates !== '–' ? `  (${dates})` : '',
                size: 19,
                font,
                color: '64748b',
              }),
            ],
            spacing: { before: 90, after: 30 },
          })
        );
      });
    },

    projects: () => {
      if (!projects || projects.length === 0) return;
      addMainHeading(titles.projects);
      projects.forEach((proj) => {
        rightChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: proj.name || '',
                bold: true,
                size: 21,
                font,
                color: '0f172a',
              }),
              new TextRun({
                text: proj.link ? ` (${proj.link})` : '',
                size: 19,
                font,
                color: themeColor,
              }),
            ],
            spacing: { before: 80, after: 20 },
          })
        );
        if (proj.description) {
          rightChildren.push(
            new Paragraph({
              text: proj.description,
              spacing: { after: 40 },
            })
          );
        }
      });
    },

    certifications: () => {
      if (!certifications || certifications.length === 0) return;
      addMainHeading(titles.certifications);
      certifications.forEach((cert) => {
        rightChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cert.name || '',
                bold: true,
                size: 20,
                font,
                color: '0f172a',
              }),
              new TextRun({
                text: cert.issuer ? ` (${cert.issuer})` : '',
                size: 19,
                font,
                color: themeColor,
              }),
              new TextRun({
                text: cert.date ? ` — ${cert.date}` : '',
                size: 19,
                font,
                color: '64748b',
              }),
            ],
            spacing: { after: 40 },
          })
        );
      });
    },

    references: () => {
      if (!references || references.length === 0) return;
      addMainHeading(titles.references);
      references.forEach((ref) => {
        const details = [ref.position, ref.company].filter(Boolean).join(', ');
        const contacts = [ref.email, ref.phone].filter(Boolean).join('  |  ');
        rightChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: ref.fullName || '',
                bold: true,
                size: 20,
                font,
                color: '0f172a',
              }),
              new TextRun({
                text: details ? ` — ${details}` : '',
                size: 19,
                font,
                color: '475569',
              }),
            ],
            spacing: { before: 60, after: contacts ? 15 : 40 },
          })
        );
        if (contacts) {
          rightChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: contacts,
                  size: 18,
                  font,
                  color: '64748b',
                }),
              ],
              spacing: { after: 40 },
            })
          );
        }
      });
    },
  };

  // Render main sections (excluding sidebar sections)
  activeSections
    .filter((sec) => !sidebarSections.includes(sec))
    .forEach((key) => {
      if (mainSectionMap[key]) mainSectionMap[key]();
    });

  // Build the 2-column Word table
  const splitTable = new Table({
    width: { size: 9200, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    },
    rows: [
      new TableRow({
        children: [
          // Left Sidebar Cell
          new TableCell({
            width: { size: 2850, type: WidthType.DXA },
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            margins: { top: 180, bottom: 180, left: 180, right: 180 },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              right: { style: BorderStyle.SINGLE, size: 8, color: 'E2E8F0' },
            },
            children: leftChildren.length > 0 ? leftChildren : [new Paragraph({})],
          }),
          // Right Main Column Cell
          new TableCell({
            width: { size: 6350, type: WidthType.DXA },
            margins: { top: 180, bottom: 180, left: 240, right: 180 },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            },
            children: rightChildren.length > 0 ? rightChildren : [new Paragraph({})],
          }),
        ],
      }),
    ],
  });

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 500, bottom: 500, left: 500, right: 500 },
          },
        },
        children: [splitTable],
      },
    ],
  });
}

/**
 * ---------------------------------------------------------------------------
 * TEMPLATE 4: Compact Impact (.docx builder)
 * ---------------------------------------------------------------------------
 */
function buildCompactDocx(data, { locale, themeColor, titles, activeSections }) {
  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    references = [],
  } = data || {};

  const children = [];
  const primaryFont = 'Arial';

  // Compact Header: Name + Title
  const headerRuns = [];
  if (personalInfo.fullName) {
    headerRuns.push(
      new TextRun({
        text: personalInfo.fullName,
        bold: true,
        size: 30,
        font: primaryFont,
        color: '0f172a',
      })
    );
  }
  if (personalInfo.jobTitle) {
    headerRuns.push(
      new TextRun({
        text: `   •   ${personalInfo.jobTitle.toUpperCase()}`,
        bold: true,
        size: 20,
        font: primaryFont,
        color: themeColor,
      })
    );
  }

  if (headerRuns.length > 0) {
    children.push(
      new Paragraph({
        children: headerRuns,
        spacing: { after: 30 },
      })
    );
  }

  // Contact line
  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.website,
    personalInfo.linkedin,
    personalInfo.github,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join('  •  '),
            size: 18,
            font: primaryFont,
            color: '64748b',
          }),
        ],
        spacing: { after: 80 },
        border: {
          bottom: {
            color: themeColor,
            space: 2,
            style: BorderStyle.SINGLE,
            size: 8,
          },
        },
      })
    );
  }

  const addHeading = (title) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 19,
            font: primaryFont,
            color: themeColor,
          }),
        ],
        spacing: { before: 100, after: 40 },
        border: {
          bottom: {
            color: 'cbd5e1',
            space: 2,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
  };

  const sectionMap = {
    summary: () => {
      if (!summary || !summary.trim()) return;
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: summary.trim(),
              size: 19,
              italics: true,
              font: primaryFont,
              color: '334155',
            }),
          ],
          spacing: { after: 80 },
        })
      );
    },

    experience: () => {
      if (!experience || experience.length === 0) return;
      addHeading(titles.experience);
      experience.forEach((exp) => {
        const dates = formatExpDate(exp, titles.present);
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position || '',
                bold: true,
                size: 20,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: exp.company ? `  •  ${exp.company}` : '',
                size: 19,
                font: primaryFont,
                color: themeColor,
              }),
              new TextRun({
                text: dates ? `   (${dates})` : '',
                size: 18,
                font: primaryFont,
                color: '64748b',
              }),
            ],
            spacing: { before: 60, after: 20 },
          })
        );
        if (Array.isArray(exp.highlights)) {
          exp.highlights.forEach((hl) => {
            if (hl && hl.trim()) {
              children.push(
                new Paragraph({
                  text: hl.trim(),
                  bullet: { level: 0 },
                  spacing: { after: 20 },
                })
              );
            }
          });
        }
      });
    },

    education: () => {
      if (!education || education.length === 0) return;
      addHeading(titles.education);
      education.forEach((edu) => {
        const dates = `${edu.startDate || ''} – ${edu.endDate || ''}`.trim();
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree || '',
                bold: true,
                size: 19,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: edu.institution ? ` — ${edu.institution}` : '',
                size: 19,
                font: primaryFont,
                color: themeColor,
              }),
              new TextRun({
                text: dates && dates !== '–' ? `  (${dates})` : '',
                size: 18,
                font: primaryFont,
                color: '64748b',
              }),
              new TextRun({
                text: edu.gpa ? `  [GPA: ${edu.gpa}]` : '',
                size: 18,
                font: primaryFont,
                color: '475569',
              }),
            ],
            spacing: { before: 40, after: 20 },
          })
        );
      });
    },

    skills: () => {
      if (!skills || skills.length === 0) return;
      addHeading(titles.skills);
      skills.forEach((sk) => {
        if (sk.items && sk.items.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${sk.category || (locale === 'tr' ? 'Yetenekler' : 'Skills')}: `,
                  bold: true,
                  size: 19,
                  font: primaryFont,
                  color: '0f172a',
                }),
                new TextRun({
                  text: sk.items.join(', '),
                  size: 19,
                  font: primaryFont,
                  color: '334155',
                }),
              ],
              spacing: { after: 30 },
            })
          );
        }
      });
    },

    projects: () => {
      if (!projects || projects.length === 0) return;
      addHeading(titles.projects);
      projects.forEach((proj) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: proj.name || '',
                bold: true,
                size: 19,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: proj.link ? ` (${proj.link})` : '',
                size: 18,
                font: primaryFont,
                color: themeColor,
              }),
            ],
            spacing: { before: 40, after: 15 },
          })
        );
        if (proj.description) {
          children.push(
            new Paragraph({
              text: proj.description,
              spacing: { after: 30 },
            })
          );
        }
      });
    },

    certifications: () => {
      if (!certifications || certifications.length === 0) return;
      addHeading(titles.certifications);
      certifications.forEach((cert) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cert.name || '',
                bold: true,
                size: 19,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: cert.issuer ? ` (${cert.issuer})` : '',
                size: 18,
                font: primaryFont,
                color: themeColor,
              }),
              new TextRun({
                text: cert.date ? ` — ${cert.date}` : '',
                size: 18,
                font: primaryFont,
                color: '64748b',
              }),
            ],
            spacing: { after: 20 },
          })
        );
      });
    },

    languages: () => {
      if (!languages || languages.length === 0) return;
      addHeading(titles.languages);
      const langStr = languages.map((l) => `${l.language} (${l.proficiency})`).join('  •  ');
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: langStr,
              size: 19,
              font: primaryFont,
              color: '334155',
            }),
          ],
          spacing: { after: 50 },
        })
      );
    },

    references: () => {
      if (!references || references.length === 0) return;
      addHeading(titles.references);
      references.forEach((ref) => {
        const details = [ref.position, ref.company].filter(Boolean).join(', ');
        const contacts = [ref.email, ref.phone].filter(Boolean).join('  |  ');
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: ref.fullName || '',
                bold: true,
                size: 19,
                font: primaryFont,
                color: '0f172a',
              }),
              new TextRun({
                text: details ? ` — ${details}` : '',
                size: 18,
                font: primaryFont,
                color: '475569',
              }),
              new TextRun({
                text: contacts ? `  [${contacts}]` : '',
                size: 18,
                font: primaryFont,
                color: '64748b',
              }),
            ],
            spacing: { before: 30, after: 20 },
          })
        );
      });
    },
  };

  activeSections.forEach((key) => {
    if (sectionMap[key]) sectionMap[key]();
  });

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 360, bottom: 360, left: 450, right: 450 },
          },
        },
        children,
      },
    ],
  });
}

/**
 * Creates the appropriate Document instance based on data.templateId.
 * Exposed for unit testing in Node environments.
 *
 * @param {object} data - Resume data
 * @param {object} [options] - Options { locale, templateId, themeColor }
 * @returns {Document}
 */
export function generateDocxDocument(data, options = {}) {
  const locale = options.locale || 'en';
  const templateId = options.templateId || data?.templateId || 'modern';
  const themeColor = cleanHex(options.themeColor || data?.themeColor || '#1e293b');

  const titles = getLocalizedTitles(locale, templateId);

  // Filter out disabled sections and follow user section order
  const disabledSet = new Set(data?.disabledSections || []);
  const defaultOrder = [
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'languages',
    'references',
  ];
  const activeSections = (data?.sectionOrder || defaultOrder).filter((sec) => !disabledSet.has(sec));

  const ctx = {
    locale,
    themeColor,
    titles,
    activeSections,
  };

  switch (templateId) {
    case 'executive':
      return buildExecutiveDocx(data, ctx);
    case 'sidebar':
      return buildSidebarDocx(data, ctx);
    case 'compact':
      return buildCompactDocx(data, ctx);
    case 'modern':
    default:
      return buildModernDocx(data, ctx);
  }
}

/**
 * Generates and triggers download of a styled Word (.docx) document matching
 * the exact active template, theme accent color, and section configuration.
 *
 * @param {object} data - Resume data object
 * @param {object} [options] - Export options
 * @param {string} [options.locale='en'] - 'en' | 'tr'
 * @param {string} [options.templateId] - Override template id
 * @param {string} [options.themeColor] - Override theme color
 * @returns {Promise<void>}
 */
export async function exportResumeToDocx(data, options = {}) {
  const doc = generateDocxDocument(data, options);

  const safeName = (data?.personalInfo?.fullName || 'resume')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');
  const templateId = options.templateId || data?.templateId || 'modern';
  const filename = `${safeName}_${templateId}_cv.docx`;

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
