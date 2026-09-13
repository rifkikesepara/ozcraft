import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';

/**
 * @file exportDocx.js
 * @description Generates a native Microsoft Word (.docx) file respecting dynamic section ordering and localization.
 */

/**
 * Generates and triggers download of a styled Word (.docx) document.
 * @param {object} data - Resume data object
 * @param {object} [options] - Export options
 * @param {string} [options.locale='en'] - 'en' | 'tr'
 * @returns {Promise<void>}
 */
export async function exportResumeToDocx(data, { locale = 'en' } = {}) {
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
    sectionOrder = [
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'languages',
      'references',
    ],
  } = data || {};

  const titles =
    locale === 'tr'
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

  const children = [];

  // 1. Header: Candidate Name
  if (personalInfo.fullName) {
    children.push(
      new Paragraph({
        text: personalInfo.fullName,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      })
    );
  }

  // Target Job Title
  if (personalInfo.jobTitle) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personalInfo.jobTitle.toUpperCase(),
            bold: true,
            size: 22,
            color: '475569',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
      })
    );
  }

  // Contact Information Line
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
            text: contactParts.join('  •  '),
            size: 19,
            color: '64748b',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 280 },
      })
    );
  }

  // Helper: Section Heading with bottom divider border
  const addSectionHeading = (title) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24,
            color: '1e293b',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 140 },
        border: {
          bottom: {
            color: 'cbd5e1',
            space: 4,
            style: BorderStyle.SINGLE,
            size: 8,
          },
        },
      })
    );
  };

  // Section Generators dictionary
  const sectionGenerators = {
    summary: () => {
      if (summary && summary.trim().length > 0) {
        addSectionHeading(titles.summary);
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: summary,
                size: 21,
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }
    },

    experience: () => {
      if (experience && experience.length > 0) {
        addSectionHeading(titles.experience);
        experience.forEach((exp) => {
          const isPresent =
            Boolean(exp.current) || (exp.endDate && exp.endDate.trim().toLowerCase() === 'present');
          const dates = isPresent
            ? `${exp.startDate || ''} – ${titles.present}`
            : `${exp.startDate || ''} – ${exp.endDate || ''}`;

          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.position || '',
                  bold: true,
                  size: 22,
                }),
                new TextRun({
                  text: exp.company ? ` | ${exp.company}` : '',
                  italics: true,
                  size: 21,
                }),
                new TextRun({
                  text: exp.location ? ` — ${exp.location}` : '',
                  color: '64748b',
                  size: 20,
                }),
                new TextRun({
                  text: dates.trim() ? `   (${dates})` : '',
                  bold: true,
                  color: '475569',
                  size: 20,
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
                    spacing: { after: 60 },
                  })
                );
              }
            });
          }
        });
      }
    },

    education: () => {
      if (education && education.length > 0) {
        addSectionHeading(titles.education);
        education.forEach((edu) => {
          const dates = `${edu.startDate || ''} – ${edu.endDate || ''}`;
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree || '',
                  bold: true,
                  size: 22,
                }),
                new TextRun({
                  text: edu.institution ? ` | ${edu.institution}` : '',
                  italics: true,
                  size: 21,
                }),
                new TextRun({
                  text: edu.location ? ` — ${edu.location}` : '',
                  color: '64748b',
                  size: 20,
                }),
                new TextRun({
                  text: dates.trim() !== '–' ? `   (${dates})` : '',
                  color: '475569',
                  size: 20,
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
                    color: '475569',
                    size: 20,
                  }),
                ],
                spacing: { after: 40 },
              })
            );
          }
        });
      }
    },

    skills: () => {
      if (skills && skills.length > 0) {
        addSectionHeading(titles.skills);
        skills.forEach((sk) => {
          if (sk.items && sk.items.length > 0) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${sk.category || (locale === 'tr' ? 'Yetenekler' : 'Skills')}: `,
                    bold: true,
                    size: 21,
                  }),
                  new TextRun({
                    text: sk.items.join(', '),
                    size: 21,
                  }),
                ],
                spacing: { after: 80 },
              })
            );
          }
        });
      }
    },

    projects: () => {
      if (projects && projects.length > 0) {
        addSectionHeading(titles.projects);
        projects.forEach((proj) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: proj.name || '',
                  bold: true,
                  size: 22,
                }),
                new TextRun({
                  text: proj.link ? ` (${proj.link})` : '',
                  color: '2563eb',
                  size: 20,
                }),
              ],
              spacing: { before: 100, after: 40 },
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
      }
    },

    certifications: () => {
      if (certifications && certifications.length > 0) {
        addSectionHeading(titles.certifications);
        certifications.forEach((cert) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: cert.name || '',
                  bold: true,
                  size: 21,
                }),
                new TextRun({
                  text: cert.issuer ? ` (${cert.issuer})` : '',
                  italics: true,
                  size: 20,
                }),
                new TextRun({
                  text: cert.date ? ` — ${cert.date}` : '',
                  color: '64748b',
                  size: 20,
                }),
              ],
              spacing: { after: 60 },
            })
          );
        });
      }
    },

    languages: () => {
      if (languages && languages.length > 0) {
        addSectionHeading(titles.languages);
        const langStr = languages.map((l) => `${l.language} (${l.proficiency})`).join('   •   ');
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: langStr,
                size: 21,
              }),
            ],
            spacing: { after: 120 },
          })
        );
      }
    },

    references: () => {
      if (references && references.length > 0) {
        addSectionHeading(titles.references);
        references.forEach((ref) => {
          const detailParts = [];
          if (ref.position) detailParts.push(ref.position);
          if (ref.company) detailParts.push(ref.company);
          const contactParts = [];
          if (ref.email) contactParts.push(ref.email);
          if (ref.phone) contactParts.push(ref.phone);

          const titleRuns = [
            new TextRun({
              text: ref.fullName || '',
              bold: true,
              size: 21,
            }),
          ];
          if (detailParts.length > 0) {
            titleRuns.push(
              new TextRun({
                text: ` — ${detailParts.join(', ')}`,
                size: 20,
                color: '475569',
              })
            );
          }

          children.push(
            new Paragraph({
              children: titleRuns,
              spacing: { before: 80, after: contactParts.length > 0 ? 30 : 80 },
            })
          );

          if (contactParts.length > 0) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: contactParts.join('  |  '),
                    size: 19,
                    color: '64748b',
                  }),
                ],
                spacing: { after: 80 },
              })
            );
          }
        });
      }
    },
  };

  // Build document according to user-customized sectionOrder
  sectionOrder.forEach((sectionKey) => {
    if (sectionGenerators[sectionKey]) {
      sectionGenerators[sectionKey]();
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              bottom: 720,
              left: 900,
              right: 900,
            },
          },
        },
        children,
      },
    ],
  });

  const safeName = (personalInfo.fullName || 'resume')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');
  const filename = `${safeName}_cv.docx`;

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
