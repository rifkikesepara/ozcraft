import React from 'react';
import { Box, Typography, Avatar, Chip, Stack, alpha } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useLocale } from '../../hooks/useLocale.js';

/**
 * @file SidebarSplitTemplate.jsx
 * @description Creative Split two-column CV template with dynamic section reordering and localization.
 * Features an accent sidebar for contact information, avatar, skills, and languages,
 * paired with a spacious main column for work experience, projects, and career summary.
 *
 * @param {object} props
 * @param {object} props.data - Structured resume data including sectionOrder
 * @param {string} [props.themeColor='#1e293b'] - Active accent color
 */
export function SidebarSplitTemplate({ data, themeColor = '#1e293b' }) {
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
    if (personalInfo.avatarShape === 'square') return '6px';
    if (personalInfo.avatarShape === 'rounded') return '16px';
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

  // Sidebar section renderers
  const sidebarRenderers = {
    education: () =>
      education.length > 0 ? (
        <Box key="education">
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: themeColor,
              display: 'block',
              mb: 1.5,
              borderBottom: `2px solid ${themeColor}`,
              pb: 0.5,
            }}
          >
            {t('builder.education')}
          </Typography>
          {education.map((edu) => (
            <Box key={edu.id} sx={{ mb: 1.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}
              >
                {edu.degree}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#475569' }}>
                {edu.institution}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                {edu.startDate} – {edu.endDate} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : null,

    skills: () =>
      skills.length > 0 ? (
        <Box key="skills">
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: themeColor,
              display: 'block',
              mb: 1.5,
              borderBottom: `2px solid ${themeColor}`,
              pb: 0.5,
            }}
          >
            {t('builder.skills')}
          </Typography>
          {skills.map((cat) => (
            <Box key={cat.id} sx={{ mb: 1.5 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}
              >
                {cat.category}
              </Typography>
              <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                {cat.items.map((item, idx) => (
                  <Chip
                    key={idx}
                    label={item}
                    size="small"
                    sx={{
                      backgroundColor: (theme) => theme.palette.common.white,
                      color: '#0f172a',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.72rem',
                      height: 22,
                      fontWeight: 600,
                      '& .MuiChip-label': {
                        color: '#0f172a',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </Box>
      ) : null,

    languages: () =>
      languages.length > 0 ? (
        <Box key="languages">
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: themeColor,
              display: 'block',
              mb: 1,
              borderBottom: `2px solid ${themeColor}`,
              pb: 0.5,
            }}
          >
            {t('builder.languages')}
          </Typography>
          {languages.map((l) => (
            <Typography
              key={l.id}
              variant="body2"
              sx={{ fontSize: '0.8rem', color: '#475569', mb: 0.5 }}
            >
              <strong>{l.language}</strong> — {l.proficiency}
            </Typography>
          ))}
        </Box>
      ) : null,
  };

  // Main column section renderers
  const mainRenderers = {
    summary: () =>
      summary ? (
        <Box sx={{ mb: 3.5 }} key="summary">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 1,
              borderBottom: '1px solid #f1f5f9',
              pb: 0.5,
            }}
          >
            {t('builder.summary')}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#334155', lineHeight: 1.65, fontSize: '0.85rem' }}
          >
            {summary}
          </Typography>
        </Box>
      ) : null,

    experience: () =>
      experience.length > 0 ? (
        <Box sx={{ mb: 3.5 }} key="experience">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 1.5,
              borderBottom: '1px solid #f1f5f9',
              pb: 0.5,
            }}
          >
            {t('builder.experience')}
          </Typography>
          {experience.map((exp) => (
            <Box key={exp.id} sx={{ mb: 2.5 }}>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}
                >
                  {exp.position}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  {formatExpDate(exp)}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{ color: themeColor, fontWeight: 600, mb: 0.75, fontSize: '0.85rem' }}
              >
                {exp.company} {exp.location ? `• ${exp.location}` : ''}
              </Typography>
              {exp.highlights && exp.highlights.length > 0 && (
                <Box component="ul" sx={{ m: 0, pl: 2, color: '#334155', fontSize: '0.82rem' }}>
                  {exp.highlights.map((hl, idx) => (
                    <li key={idx} style={{ marginBottom: '4px', lineHeight: '1.5' }}>
                      {hl}
                    </li>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ) : null,

    projects: () =>
      projects.length > 0 ? (
        <Box sx={{ mb: 3 }} key="projects">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 1.5,
              borderBottom: '1px solid #f1f5f9',
              pb: 0.5,
            }}
          >
            {t('builder.projects')}
          </Typography>
          {projects.map((proj) => (
            <Box key={proj.id} sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}
              >
                {proj.name}{' '}
                {proj.link && (
                  <span style={{ fontSize: '0.78rem', fontWeight: 500, color: themeColor }}>
                    ({proj.link})
                  </span>
                )}
              </Typography>
              {proj.description && (
                <Typography variant="body2" sx={{ color: '#475569', mb: 0.5, fontSize: '0.82rem' }}>
                  {proj.description}
                </Typography>
              )}
              {proj.technologies && proj.technologies.length > 0 && (
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  {locale === 'tr' ? 'Teknolojiler' : 'Tech'}: {proj.technologies.join(', ')}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      ) : null,

    certifications: () =>
      certifications.length > 0 ? (
        <Box sx={{ mb: 2.5 }} key="certifications">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 1,
              borderBottom: '1px solid #f1f5f9',
              pb: 0.5,
            }}
          >
            {t('builder.certifications')}
          </Typography>
          {certifications.map((c) => (
            <Typography
              key={c.id}
              variant="body2"
              sx={{ fontSize: '0.82rem', color: '#334155', mb: 0.5 }}
            >
              • <strong>{c.name}</strong> {c.issuer ? `(${c.issuer})` : ''}{' '}
              {c.date ? `— ${c.date}` : ''}
            </Typography>
          ))}
        </Box>
      ) : null,
  };

  // Determine which sections belong in sidebar vs main
  const sidebarSectionKeys = ['skills', 'education', 'languages'];
  const activeSidebarKeys = sectionOrder.filter((k) => sidebarSectionKeys.includes(k));
  const activeMainKeys = sectionOrder.filter((k) => !sidebarSectionKeys.includes(k));

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '297mm',
        backgroundColor: (theme) => theme.palette.common.white,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '260px 1fr' },
        boxSizing: 'border-box',
        fontFamily: data.fontFamily || 'inherit',
      }}
    >
      {/* Left Sidebar Column */}
      <Stack
        sx={{
          backgroundColor: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          p: 3.5,
          gap: 3,
        }}
      >
        {/* Photo Avatar */}
        {personalInfo.showPhoto && personalInfo.avatar && (
          <Stack direction="row" sx={{ justifyContent: 'center', mb: 1 }}>
            <Avatar
              src={personalInfo.avatar}
              alt={personalInfo.fullName}
              sx={{
                width: 120,
                height: 120,
                borderRadius: getBorderRadius(),
                border: `3px solid ${themeColor}`,
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
              }}
            />
          </Stack>
        )}

        {/* Candidate Title info in sidebar */}
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            {personalInfo.fullName || (locale === 'tr' ? 'Adınız Soyadınız' : 'Your Name')}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: themeColor, display: 'block', mt: 0.5 }}
          >
            {personalInfo.jobTitle || (locale === 'tr' ? 'Hedef Pozisyon' : 'Target Position')}
          </Typography>
        </Box>

        {/* Contact Info */}
        <Stack sx={{ gap: 1.5, fontSize: '0.8rem', color: '#475569' }}>
          {personalInfo.email && (
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <EmailOutlinedIcon sx={{ fontSize: 16, color: themeColor }} />
              <span style={{ wordBreak: 'break-all' }}>{personalInfo.email}</span>
            </Stack>
          )}
          {personalInfo.phone && (
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <PhoneOutlinedIcon sx={{ fontSize: 16, color: themeColor }} />
              <span>{personalInfo.phone}</span>
            </Stack>
          )}
          {personalInfo.location && (
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 16, color: themeColor }} />
              <span>{personalInfo.location}</span>
            </Stack>
          )}
          {personalInfo.website && (
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <LanguageOutlinedIcon sx={{ fontSize: 16, color: themeColor }} />
              <span style={{ wordBreak: 'break-all' }}>{personalInfo.website}</span>
            </Stack>
          )}
          {personalInfo.linkedin && (
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <LinkedInIcon sx={{ fontSize: 16, color: themeColor }} />
              <span style={{ wordBreak: 'break-all' }}>{personalInfo.linkedin}</span>
            </Stack>
          )}
          {personalInfo.github && (
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <GitHubIcon sx={{ fontSize: 16, color: themeColor }} />
              <span style={{ wordBreak: 'break-all' }}>{personalInfo.github}</span>
            </Stack>
          )}
        </Stack>

        {/* Dynamic Sidebar Sections */}
        {activeSidebarKeys.map((key) => sidebarRenderers[key]?.())}
      </Stack>

      {/* Right Main Column */}
      <Box sx={{ p: { xs: 3, md: 4.5 } }}>
        {/* Dynamic Main Sections */}
        {activeMainKeys.map((key) => mainRenderers[key]?.())}
      </Box>
    </Box>
  );
}
