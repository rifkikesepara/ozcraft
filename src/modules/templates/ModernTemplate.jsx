import { Box, Stack, Typography, Chip, Divider, Avatar, Grid, alpha } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useLocale } from '../../hooks/index.js';

/**
 * @file ModernTemplate.jsx
 * @description Modern Minimalist CV template with dynamic section reordering and localization.
 * High-readability single-column layout optimized for ATS scanning, engineering, and tech roles.
 *
 * @param {object} props
 * @param {object} props.data - Structured resume data including sectionOrder
 * @param {string} [props.themeColor='#1e293b'] - Active accent color
 */
export function ModernTemplate({ data, themeColor = '#1e293b' }) {
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

  const getBorderRadius = () => {
    if (personalInfo.avatarShape === 'square') return '4px';
    if (personalInfo.avatarShape === 'rounded') return '14px';
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
        <Box sx={{ mb: 3.5 }} key="summary" className="resume-section">
          <Typography
            variant="h6"
            className="resume-section-title"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 1,
            }}
          >
            {t('builder.summary')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.65 }}>
            {summary}
          </Typography>
        </Box>
      ) : null,

    experience: () =>
      experience.length > 0 ? (
        <Box sx={{ mb: 3.5 }} key="experience" className="resume-section">
          <Typography
            variant="h6"
            className="resume-section-title"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 1.5,
            }}
          >
            {t('builder.experience')}
          </Typography>
          {experience.map((exp) => (
            <Box key={exp.id} sx={{ mb: 2.5 }} className="resume-section-item">
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: 0.25 }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}
                >
                  {exp.position}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  {formatExpDate(exp)}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.75 }}>
                <Typography variant="body2" sx={{ color: themeColor, fontWeight: 600 }}>
                  {exp.company}
                </Typography>
                {exp.location && (
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    {exp.location}
                  </Typography>
                )}
              </Stack>
              {exp.highlights && exp.highlights.length > 0 && (
                <Box component="ul" sx={{ m: 0, pl: 2.5, color: '#334155', fontSize: '0.85rem' }}>
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

    education: () =>
      education.length > 0 ? (
        <Box sx={{ mb: 3.5 }} key="education" className="resume-section">
          <Typography
            variant="h6"
            className="resume-section-title"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 1.5,
            }}
          >
            {t('builder.education')}
          </Typography>
          {education.map((edu) => (
            <Box key={edu.id} sx={{ mb: 2 }} className="resume-section-item">
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {edu.degree} {edu.field ? `${locale === 'tr' ? '—' : 'in'} ${edu.field}` : ''}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  {edu.startDate} – {edu.endDate}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                  {edu.institution} {edu.location ? `• ${edu.location}` : ''}
                </Typography>
                {edu.gpa && (
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    GPA: {edu.gpa}
                  </Typography>
                )}
              </Stack>
            </Box>
          ))}
        </Box>
      ) : null,

    skills: () =>
      skills.length > 0 ? (
        <Box sx={{ mb: 3.5 }} key="skills" className="resume-section">
          <Typography
            variant="h6"
            className="resume-section-title"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 1.5,
            }}
          >
            {t('builder.skills')}
          </Typography>
          {skills.map((cat) => (
            <Box key={cat.id} sx={{ mb: 1.5 }} className="resume-section-item">
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                {cat.category}
              </Typography>
              <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                {cat.items.map((item, idx) => (
                  <Chip
                    key={idx}
                    label={item}
                    size="small"
                    sx={{
                      backgroundColor: '#f1f5f9',
                      color: '#1e293b',
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      '& .MuiChip-label': {
                        color: '#1e293b',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </Box>
      ) : null,

    projects: () =>
      projects.length > 0 ? (
        <Box sx={{ mb: 3 }} key="projects" className="resume-section">
          <Typography
            variant="h6"
            className="resume-section-title"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 1.5,
            }}
          >
            {t('builder.projects')}
          </Typography>
          {projects.map((proj) => (
            <Box key={proj.id} sx={{ mb: 2 }} className="resume-section-item">
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                {proj.name}{' '}
                {proj.link && (
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: themeColor }}>
                    ({proj.link})
                  </span>
                )}
              </Typography>
              {proj.description && (
                <Typography variant="body2" sx={{ color: '#475569', mb: 0.5 }}>
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
        <Box sx={{ mb: 2.5 }} key="certifications" className="resume-section">
          <Typography
            variant="h6"
            className="resume-section-title"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 1,
            }}
          >
            {t('builder.certifications')}
          </Typography>
          {certifications.map((c) => (
            <Typography
              key={c.id}
              variant="body2"
              className="resume-section-item"
              sx={{ fontSize: '0.85rem', color: '#334155', mb: 0.5 }}
            >
              • <strong>{c.name}</strong> {c.issuer ? `(${c.issuer})` : ''}{' '}
              {c.date ? `— ${c.date}` : ''}
            </Typography>
          ))}
        </Box>
      ) : null,

    languages: () =>
      languages.length > 0 ? (
        <Box sx={{ mb: 2.5 }} key="languages" className="resume-section">
          <Typography
            variant="h6"
            className="resume-section-title"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 1,
            }}
          >
            {t('builder.languages')}
          </Typography>
          <Typography
            variant="body2"
            className="resume-section-item"
            sx={{ fontSize: '0.85rem', color: '#334155' }}
          >
            {languages.map((l) => `${l.language} (${l.proficiency})`).join('  •  ')}
          </Typography>
        </Box>
      ) : null,

    references: () =>
      references.length > 0 ? (
        <Box sx={{ mb: 3 }} key="references" className="resume-section">
          <Typography
            variant="h6"
            className="resume-section-title"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 1.5,
            }}
          >
            {t('builder.references')}
          </Typography>
          <Grid container spacing={2}>
            {references.map((ref) => (
              <Grid size={{ xs: 12, sm: 6 }} key={ref.id} className="resume-section-item">
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    {ref.fullName}
                  </Typography>
                  {(ref.position || ref.company) && (
                    <Typography
                      variant="body2"
                      sx={{ color: themeColor, fontWeight: 600, fontSize: '0.82rem' }}
                    >
                      {ref.position}
                      {ref.position && ref.company ? ' • ' : ''}
                      {ref.company}
                    </Typography>
                  )}
                  {ref.email && (
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: '#64748b', fontSize: '0.78rem' }}
                    >
                      {ref.email}
                    </Typography>
                  )}
                  {ref.phone && (
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: '#64748b', fontSize: '0.78rem' }}
                    >
                      {ref.phone}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : null,
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        backgroundColor: (theme) => theme.palette.common.white,
        color: '#1e293b',
        p: 0,
        boxSizing: 'border-box',
        fontFamily: data.fontFamily || 'inherit',
      }}
    >
      {/* Header Section */}
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: themeColor, letterSpacing: '-0.02em', mb: 0.5 }}
          >
            {personalInfo.fullName || (locale === 'tr' ? 'Adınız Soyadınız' : 'Your Name')}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1.5,
            }}
          >
            {personalInfo.jobTitle || (locale === 'tr' ? 'Hedef Pozisyon' : 'Target Position')}
          </Typography>

          {/* Contact Details */}
          <Stack
            direction="row"
            sx={{ flexWrap: 'wrap', gap: 2, color: '#475569', fontSize: '0.875rem' }}
          >
            {personalInfo.email && (
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <EmailOutlinedIcon sx={{ fontSize: 16, color: themeColor }} />
                <span>{personalInfo.email}</span>
              </Stack>
            )}
            {personalInfo.phone && (
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <PhoneOutlinedIcon sx={{ fontSize: 16, color: themeColor }} />
                <span>{personalInfo.phone}</span>
              </Stack>
            )}
            {personalInfo.location && (
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 16, color: themeColor }} />
                <span>{personalInfo.location}</span>
              </Stack>
            )}
            {personalInfo.website && (
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <LanguageOutlinedIcon sx={{ fontSize: 16, color: themeColor }} />
                <span>{personalInfo.website}</span>
              </Stack>
            )}
            {personalInfo.linkedin && (
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <LinkedInIcon sx={{ fontSize: 16, color: themeColor }} />
                <span>{personalInfo.linkedin}</span>
              </Stack>
            )}
            {personalInfo.github && (
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <GitHubIcon sx={{ fontSize: 16, color: themeColor }} />
                <span>{personalInfo.github}</span>
              </Stack>
            )}
          </Stack>
        </Box>

        {/* Profile Avatar */}
        {personalInfo.showPhoto && personalInfo.avatar && (
          <Avatar
            src={personalInfo.avatar}
            alt={personalInfo.fullName}
            sx={{
              width: 96,
              height: 96,
              borderRadius: getBorderRadius(),
              border: `3px solid ${themeColor}`,
              boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
              ml: 3,
            }}
          />
        )}
      </Stack>

      <Divider sx={{ mb: 3, borderColor: 'divider' }} />

      {/* Dynamic Sections ordered by data.sectionOrder */}
      {sectionOrder.map((sectionKey) => sectionRenderers[sectionKey]?.())}
    </Box>
  );
}
