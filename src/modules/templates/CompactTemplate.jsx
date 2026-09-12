import React from 'react';
import { Box, Stack, Typography, Divider, Avatar } from '@mui/material';
import { useLocale } from '../../hooks/useLocale.js';

/**
 * @file CompactTemplate.jsx
 * @description Single-Page High-Density CV template with dynamic section reordering and localization.
 * Maximizes information density with a crisp 1-page layout, tight line heights, and compact headers.
 *
 * @param {object} props
 * @param {object} props.data - Structured resume data including sectionOrder
 * @param {string} [props.themeColor='#1e293b'] - Active accent color
 */
export function CompactTemplate({ data, themeColor = '#1e293b' }) {
  const { t, locale } = useLocale();

  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    sectionOrder = [
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'languages',
    ],
  } = data || {};

  const getBorderRadius = () => {
    if (personalInfo.avatarShape === 'square') return '3px';
    if (personalInfo.avatarShape === 'rounded') return '8px';
    return '50%';
  };

  const formatExpDate = (exp) => {
    const isPresent =
      Boolean(exp.current) || (exp.endDate && exp.endDate.trim().toLowerCase() === 'present');
    const endText = isPresent ? t('common.present') : exp.endDate || '';
    if (!exp.startDate && !endText) return '';
    if (!exp.startDate) return endText;
    if (!endText) return exp.startDate;
    return `${exp.startDate} – ${endText}`;
  };

  const sectionRenderers = {
    summary: () =>
      summary ? (
        <Box sx={{ mb: 2 }} key="summary">
          <Typography
            variant="body2"
            sx={{ fontSize: '0.82rem', color: '#334155', fontStyle: 'italic', lineHeight: 1.45 }}
          >
            {summary}
          </Typography>
        </Box>
      ) : null,

    experience: () =>
      experience.length > 0 ? (
        <Box sx={{ mb: 2 }} key="experience">
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: themeColor,
              borderBottom: '1px solid #e2e8f0',
              pb: 0.25,
              mb: 1,
            }}
          >
            {t('builder.experience')}
          </Typography>
          {experience.map((exp) => (
            <Box key={exp.id} sx={{ mb: 1.5 }}>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
                  {exp.position}{' '}
                  <span style={{ fontWeight: 400, color: themeColor }}>• {exp.company}</span>
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  {formatExpDate(exp)}
                </Typography>
              </Stack>
              {exp.highlights && exp.highlights.length > 0 && (
                <Box component="ul" sx={{ m: 0, pl: 2, color: '#334155', fontSize: '0.78rem' }}>
                  {exp.highlights.map((hl, idx) => (
                    <li key={idx} style={{ marginBottom: '2px', lineHeight: '1.35' }}>
                      {hl}
                    </li>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ) : null,

    education: () =>
      education.length > 0 ? (
        <Box sx={{ mb: 2 }} key="education">
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: themeColor,
              borderBottom: '1px solid #e2e8f0',
              pb: 0.25,
              mb: 1,
            }}
          >
            {t('builder.education')}
          </Typography>
          {education.map((edu) => (
            <Box key={edu.id} sx={{ mb: 1 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>
                  {edu.degree} {edu.field ? `${locale === 'tr' ? '—' : 'in'} ${edu.field}` : ''}
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {edu.startDate} – {edu.endDate}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: '0.76rem', color: '#475569' }}>
                {edu.institution} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : null,

    skills: () =>
      skills.length > 0 ? (
        <Box sx={{ mb: 2 }} key="skills">
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: themeColor,
              borderBottom: '1px solid #e2e8f0',
              pb: 0.25,
              mb: 0.75,
            }}
          >
            {t('builder.skills')}
          </Typography>
          <Stack sx={{ gap: 0.5 }}>
            {skills.map((cat) => (
              <Typography key={cat.id} sx={{ fontSize: '0.78rem', color: '#334155' }}>
                <strong>{cat.category}:</strong> {cat.items.join(', ')}
              </Typography>
            ))}
          </Stack>
        </Box>
      ) : null,

    projects: () =>
      projects.length > 0 ? (
        <Box sx={{ mb: 2 }} key="projects">
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: themeColor,
              borderBottom: '1px solid #e2e8f0',
              pb: 0.25,
              mb: 0.75,
            }}
          >
            {t('builder.projects')}
          </Typography>
          {projects.map((proj) => (
            <Box key={proj.id} sx={{ mb: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>
                {proj.name} {proj.link ? `(${proj.link})` : ''}
              </Typography>
              {proj.description && (
                <Typography sx={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.35 }}>
                  {proj.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      ) : null,

    certifications: () =>
      certifications.length > 0 ? (
        <Box sx={{ mb: 1.5 }} key="certifications">
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: themeColor,
              borderBottom: '1px solid #e2e8f0',
              pb: 0.25,
              mb: 0.5,
            }}
          >
            {t('builder.certifications')}
          </Typography>
          {certifications.map((c) => (
            <Typography key={c.id} sx={{ fontSize: '0.76rem', color: '#334155' }}>
              • {c.name} {c.issuer ? `(${c.issuer})` : ''} {c.date ? `— ${c.date}` : ''}
            </Typography>
          ))}
        </Box>
      ) : null,

    languages: () =>
      languages.length > 0 ? (
        <Box sx={{ mb: 1.5 }} key="languages">
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: themeColor,
              borderBottom: '1px solid #e2e8f0',
              pb: 0.25,
              mb: 0.5,
            }}
          >
            {t('builder.languages')}
          </Typography>
          <Typography sx={{ fontSize: '0.76rem', color: '#334155' }}>
            {languages.map((l) => `${l.language} (${l.proficiency})`).join('  •  ')}
          </Typography>
        </Box>
      ) : null,
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '297mm',
        backgroundColor: (theme) => theme.palette.common.white,
        color: '#0f172a',
        p: { xs: 2.5, sm: 4 },
        boxSizing: 'border-box',
        fontFamily: data.fontFamily || 'inherit',
      }}
    >
      {/* Ultra Compact Header */}
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: themeColor, lineHeight: 1.1 }}>
            {personalInfo.fullName || (locale === 'tr' ? 'Adınız Soyadınız' : 'Candidate Name')}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              mt: 0.25,
            }}
          >
            {personalInfo.jobTitle || (locale === 'tr' ? 'Hedef Pozisyon' : 'Target Position')}
          </Typography>

          {/* Inline Contact Info */}
          <Stack
            direction="row"
            sx={{ flexWrap: 'wrap', gap: 1.5, fontSize: '0.75rem', color: '#475569', mt: 0.5 }}
          >
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.website && <span>• {personalInfo.website}</span>}
            {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
            {personalInfo.github && <span>• {personalInfo.github}</span>}
          </Stack>
        </Box>

        {personalInfo.showPhoto && personalInfo.avatar && (
          <Avatar
            src={personalInfo.avatar}
            alt={personalInfo.fullName}
            sx={{
              width: 72,
              height: 72,
              borderRadius: getBorderRadius(),
              border: `2px solid ${themeColor}`,
              ml: 2,
            }}
          />
        )}
      </Stack>

      <Divider sx={{ mb: 2, borderColor: themeColor }} />

      {/* Dynamic Sections ordered by data.sectionOrder */}
      {sectionOrder.map((sectionKey) => sectionRenderers[sectionKey]?.())}
    </Box>
  );
}
