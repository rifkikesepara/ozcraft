import React from 'react';
import { Box, Stack, Typography, Divider, Avatar, alpha } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useLocale } from '../../hooks/useLocale.js';

/**
 * @file ExecutiveTemplate.jsx
 * @description Executive Classic CV template with dynamic section reordering and localization.
 * Elegant serif typography, distinguished borders, tailored for senior and leadership profiles.
 *
 * @param {object} props
 * @param {object} props.data - Structured resume data
 * @param {string} [props.themeColor='#0f172a'] - Active accent color
 */
export function ExecutiveTemplate({ data, themeColor = '#0f172a' }) {
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
      'skills',
      'education',
      'projects',
      'certifications',
      'languages',
    ],
  } = data || {};

  const getBorderRadius = () => {
    if (personalInfo.avatarShape === 'square') return '0px';
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
        <Box sx={{ mb: 3 }} key="summary">
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: themeColor,
              mb: 1,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {locale === 'tr'
              ? 'Yönetici Profili & Profesyonel Özet'
              : 'Executive Profile & Summary'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.88rem',
              lineHeight: 1.75,
              color: '#334155',
              fontStyle: 'italic',
            }}
          >
            {summary}
          </Typography>
        </Box>
      ) : null,

    experience: () =>
      experience.length > 0 ? (
        <Box sx={{ mb: 3.5 }} key="experience">
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: themeColor,
              mb: 1.5,
              fontFamily: '"Inter", sans-serif',
              borderBottom: '1px solid #e2e8f0',
              pb: 0.5,
            }}
          >
            {locale === 'tr'
              ? 'Kariyer Geçmişi & Profesyonel Deneyim'
              : 'Career History & Professional Experience'}
          </Typography>
          {experience.map((exp) => (
            <Box key={exp.id} sx={{ mb: 2.5 }}>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                  {exp.position}
                </Typography>
                <Typography
                  sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748b' }}
                >
                  {formatExpDate(exp)}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.75 }}>
                <Typography sx={{ fontSize: '0.88rem', color: themeColor, fontStyle: 'italic' }}>
                  {exp.company} {exp.location ? `, ${exp.location}` : ''}
                </Typography>
              </Stack>
              {exp.highlights && exp.highlights.length > 0 && (
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    pl: 2.5,
                    color: '#334155',
                    fontSize: '0.85rem',
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {exp.highlights.map((hl, idx) => (
                    <li key={idx} style={{ marginBottom: '5px', lineHeight: '1.55' }}>
                      {hl}
                    </li>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ) : null,

    skills: () =>
      skills.length > 0 ? (
        <Box sx={{ mb: 3 }} key="skills">
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: themeColor,
              mb: 1.5,
              fontFamily: '"Inter", sans-serif',
              borderBottom: '1px solid #e2e8f0',
              pb: 0.5,
            }}
          >
            {locale === 'tr'
              ? 'Temel Yetkinlikler & Liderlik Becerileri'
              : 'Core Competencies & Capabilities'}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
            {skills.map((cat) => (
              <Box key={cat.id}>
                <Typography
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#334155',
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {cat.category}:{' '}
                  <span style={{ fontWeight: 400, color: '#64748b' }}>{cat.items.join(', ')}</span>
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ) : null,

    education: () =>
      education.length > 0 ? (
        <Box sx={{ mb: 3 }} key="education">
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: themeColor,
              mb: 1.5,
              fontFamily: '"Inter", sans-serif',
              borderBottom: '1px solid #e2e8f0',
              pb: 0.5,
            }}
          >
            {locale === 'tr' ? 'Akademik Geçmiş & Eğitim' : 'Academic Credentials'}
          </Typography>
          {education.map((edu) => (
            <Stack direction="row" key={edu.id} sx={{ mb: 1.5, justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                  {edu.degree} {edu.field ? `${locale === 'tr' ? '—' : 'in'} ${edu.field}` : ''}
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#475569', fontStyle: 'italic' }}>
                  {edu.institution} {edu.location ? `— ${edu.location}` : ''}
                </Typography>
              </Box>
              <Typography
                sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748b' }}
              >
                {edu.startDate} – {edu.endDate}
              </Typography>
            </Stack>
          ))}
        </Box>
      ) : null,

    projects: () =>
      projects.length > 0 ? (
        <Box sx={{ mb: 3 }} key="projects">
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: themeColor,
              mb: 1.5,
              fontFamily: '"Inter", sans-serif',
              borderBottom: '1px solid #e2e8f0',
              pb: 0.5,
            }}
          >
            {locale === 'tr'
              ? 'Önemli Projeler & Stratejik İnisiyatifler'
              : 'Key Projects & Initiatives'}
          </Typography>
          {projects.map((proj) => (
            <Box key={proj.id} sx={{ mb: 1.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                {proj.name} {proj.link ? `(${proj.link})` : ''}
              </Typography>
              {proj.description && (
                <Typography
                  sx={{ fontSize: '0.84rem', color: '#475569', fontFamily: '"Inter", sans-serif' }}
                >
                  {proj.description}
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
            sx={{
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: themeColor,
              mb: 1,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {locale === 'tr' ? 'Sertifikalar & Akreditasyonlar' : 'Certifications & Accreditations'}
          </Typography>
          {certifications.map((c) => (
            <Typography
              key={c.id}
              sx={{
                fontSize: '0.82rem',
                color: '#334155',
                fontFamily: '"Inter", sans-serif',
                mb: 0.5,
              }}
            >
              • {c.name} {c.issuer ? `(${c.issuer})` : ''} {c.date ? `— ${c.date}` : ''}
            </Typography>
          ))}
        </Box>
      ) : null,

    languages: () =>
      languages.length > 0 ? (
        <Box sx={{ mb: 2.5 }} key="languages">
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: themeColor,
              mb: 1,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {locale === 'tr' ? 'Yabancı Diller & Yetkinlikler' : 'Languages & Communication'}
          </Typography>
          <Typography
            sx={{ fontSize: '0.85rem', color: '#334155', fontFamily: '"Inter", sans-serif' }}
          >
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
        p: { xs: 3, sm: 5, md: 6 },
        boxSizing: 'border-box',
        fontFamily: data.fontFamily || '"Merriweather", Georgia, serif',
      }}
    >
      {/* Top Header */}
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', pb: 2, mb: 3 }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: '2rem',
              color: themeColor,
              letterSpacing: '-0.01em',
              mb: 0.5,
            }}
          >
            {personalInfo.fullName || (locale === 'tr' ? 'Adınız Soyadınız' : 'Executive Name')}
          </Typography>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#475569',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: '"Inter", sans-serif',
              mb: 1.5,
            }}
          >
            {personalInfo.jobTitle ||
              (locale === 'tr' ? 'Kıdemli Yönetici & Danışman' : 'Senior Executive Leader')}
          </Typography>

          {/* Contact Bar */}
          <Stack
            direction="row"
            sx={{
              flexWrap: 'wrap',
              gap: 2.5,
              fontSize: '0.82rem',
              color: '#64748b',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {personalInfo.email && (
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <EmailOutlinedIcon sx={{ fontSize: 15, color: themeColor }} />
                <span>{personalInfo.email}</span>
              </Stack>
            )}
            {personalInfo.phone && (
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <PhoneOutlinedIcon sx={{ fontSize: 15, color: themeColor }} />
                <span>{personalInfo.phone}</span>
              </Stack>
            )}
            {personalInfo.location && (
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 15, color: themeColor }} />
                <span>{personalInfo.location}</span>
              </Stack>
            )}
            {personalInfo.website && (
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <LanguageOutlinedIcon sx={{ fontSize: 15, color: themeColor }} />
                <span>{personalInfo.website}</span>
              </Stack>
            )}
            {personalInfo.linkedin && (
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <LinkedInIcon sx={{ fontSize: 15, color: themeColor }} />
                <span>{personalInfo.linkedin}</span>
              </Stack>
            )}
            {personalInfo.github && (
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <GitHubIcon sx={{ fontSize: 15, color: themeColor }} />
                <span>{personalInfo.github}</span>
              </Stack>
            )}
          </Stack>
        </Box>

        {/* Executive Portrait Photo */}
        {personalInfo.showPhoto && personalInfo.avatar && (
          <Avatar
            src={personalInfo.avatar}
            alt={personalInfo.fullName}
            sx={{
              width: 104,
              height: 104,
              borderRadius: getBorderRadius(),
              border: `2px solid ${themeColor}`,
              boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
              ml: 3,
            }}
          />
        )}
      </Stack>

      <Divider sx={{ mb: 3.5, borderColor: themeColor, borderWidth: 1 }} />

      {/* Dynamic Sections ordered by data.sectionOrder */}
      {sectionOrder.map((sectionKey) => sectionRenderers[sectionKey]?.())}
    </Box>
  );
}
