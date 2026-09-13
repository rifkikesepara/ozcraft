import { Box, Typography, Avatar, Chip, Stack, Grid, alpha } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useLocale } from '../../hooks/index.js';

/**
 * @file SidebarSplitTemplate.jsx
 * @description Creative Split two-column CV template with dynamic section reordering and localization.
 * Features an accent sidebar for contact information, avatar, skills, and languages,
 * paired with a spacious main column for work experience, education, projects, and career summary.
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

  // Determine sections for sidebar vs main column
  const defaultSidebarKeys = ['skills', 'languages'];
  const activeSidebarKeys = sectionOrder.filter((k) => defaultSidebarKeys.includes(k));
  const activeMainKeys = sectionOrder.filter((k) => !defaultSidebarKeys.includes(k));

  // Sidebar section renderers
  const sidebarRenderers = {
    skills: () =>
      skills.length > 0 ? (
        <Box key="skills" className="resume-section" sx={{ mb: 2.5 }}>
          <Typography
            variant="caption"
            className="resume-section-title"
            sx={{
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: themeColor,
              display: 'block',
              mb: 1.25,
              borderBottom: `2px solid ${alpha(themeColor, 0.25)}`,
              pb: 0.5,
            }}
          >
            {t('builder.skills')}
          </Typography>
          {skills.map((cat) => (
            <Box key={cat.id} sx={{ mb: 0.85 }} className="resume-section-item">
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: '#475569',
                  display: 'block',
                  mb: 0.25,
                  fontSize: '0.72rem',
                }}
              >
                {cat.category}
              </Typography>
              <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.35 }}>
                {cat.items.map((item, idx) => (
                  <Chip
                    key={idx}
                    label={item}
                    size="small"
                    sx={{
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.67rem',
                      height: 19,
                      fontWeight: 600,
                      '& .MuiChip-label': {
                        color: '#0f172a',
                        px: 0.75,
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
        <Box key="languages" className="resume-section" sx={{ mb: 1.0 }}>
          <Typography
            variant="caption"
            className="resume-section-title"
            sx={{
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: themeColor,
              display: 'block',
              mb: 0.75,
              borderBottom: `2px solid ${alpha(themeColor, 0.25)}`,
              pb: 0.25,
            }}
          >
            {t('builder.languages')}
          </Typography>
          {languages.map((l) => (
            <Box key={l.id} sx={{ mb: 0.4 }} className="resume-section-item">
              <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#1e293b' }}>
                <strong>{l.language}</strong>{' '}
                <span style={{ color: '#64748b', fontSize: '0.72rem' }}>— {l.proficiency}</span>
              </Typography>
            </Box>
          ))}
        </Box>
      ) : null,

    certifications: () =>
      certifications.length > 0 ? (
        <Box key="certifications" className="resume-section" sx={{ mb: 2.5 }}>
          <Typography
            variant="caption"
            className="resume-section-title"
            sx={{
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: themeColor,
              display: 'block',
              mb: 1.25,
              borderBottom: `2px solid ${alpha(themeColor, 0.25)}`,
              pb: 0.5,
            }}
          >
            {t('builder.certifications')}
          </Typography>
          {certifications.map((c) => (
            <Box key={c.id} sx={{ mb: 1 }} className="resume-section-item">
              <Typography
                variant="body2"
                sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}
              >
                {c.name}
              </Typography>
              {c.issuer && (
                <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
                  {c.issuer} {c.date ? `• ${c.date}` : ''}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      ) : null,

    education: () =>
      education.length > 0 ? (
        <Box key="education" className="resume-section" sx={{ mb: 2.5 }}>
          <Typography
            variant="caption"
            className="resume-section-title"
            sx={{
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: themeColor,
              display: 'block',
              mb: 1.25,
              borderBottom: `2px solid ${alpha(themeColor, 0.25)}`,
              pb: 0.5,
            }}
          >
            {t('builder.education')}
          </Typography>
          {education.map((edu) => (
            <Box key={edu.id} sx={{ mb: 1.5 }} className="resume-section-item">
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', lineHeight: 1.3 }}
              >
                {edu.degree}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.78rem', color: '#475569' }}>
                {edu.institution}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                {edu.startDate} – {edu.endDate} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : null,
  };

  // Main column section renderers
  const mainRenderers = {
    summary: () =>
      summary ? (
        <Box sx={{ mb: 1.0 }} key="summary" className="resume-section">
          <Typography
            variant="h6"
            className="resume-section-title"
            sx={{
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 0.35,
              borderBottom: '1px solid #f1f5f9',
              pb: 0.15,
            }}
          >
            {t('builder.summary')}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#334155', lineHeight: 1.44, fontSize: '0.8rem' }}
          >
            {summary}
          </Typography>
        </Box>
      ) : null,

    experience: () =>
      experience.length > 0 ? (
        <Box sx={{ mb: 1.15 }} key="experience" className="resume-section">
          <Typography
            variant="h6"
            className="resume-section-title"
            sx={{
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 0.4,
              borderBottom: '1px solid #f1f5f9',
              pb: 0.15,
            }}
          >
            {t('builder.experience')}
          </Typography>
          {experience.map((exp) => (
            <Box key={exp.id} sx={{ mb: 0.8 }} className="resume-section-item">
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}
                >
                  {exp.position}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  {formatExpDate(exp)}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{ color: themeColor, fontWeight: 600, mb: 0.15, fontSize: '0.8rem' }}
              >
                {exp.company} {exp.location ? `• ${exp.location}` : ''}
              </Typography>
              {exp.highlights && exp.highlights.length > 0 && (
                <Box component="ul" sx={{ m: 0, pl: 2, color: '#334155', fontSize: '0.78rem' }}>
                  {exp.highlights.map((hl, idx) => (
                    <li key={idx} style={{ marginBottom: '1.5px', lineHeight: '1.32' }}>
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
        <Box sx={{ mb: 1.15 }} key="education" className="resume-section">
          <Typography
            variant="h6"
            className="resume-section-title"
            sx={{
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 0.4,
              borderBottom: '1px solid #f1f5f9',
              pb: 0.15,
            }}
          >
            {t('builder.education')}
          </Typography>
          {education.map((edu) => (
            <Box key={edu.id} sx={{ mb: 0.8 }} className="resume-section-item">
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}
                >
                  {edu.degree}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  {edu.startDate} – {edu.endDate}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{ color: themeColor, fontWeight: 600, mb: 0.15, fontSize: '0.8rem' }}
              >
                {edu.institution} {edu.location ? `• ${edu.location}` : ''}{' '}
                {edu.gpa ? `(GPA: ${edu.gpa})` : ''}
              </Typography>
              {edu.field && (
                <Typography variant="caption" sx={{ color: '#475569', display: 'block', mb: 0.15 }}>
                  {locale === 'tr' ? 'Öğrenim Alanı' : 'Field'}: {edu.field}
                </Typography>
              )}
              {edu.highlights && edu.highlights.length > 0 && (
                <Box component="ul" sx={{ m: 0, pl: 2, color: '#334155', fontSize: '0.78rem' }}>
                  {edu.highlights.map((hl, idx) => (
                    <li key={idx} style={{ marginBottom: '1.5px', lineHeight: '1.32' }}>
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
        <Box sx={{ mb: 1.15 }} key="projects" className="resume-section">
          <Typography
            variant="h6"
            className="resume-section-title"
            sx={{
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 0.4,
              borderBottom: '1px solid #f1f5f9',
              pb: 0.15,
            }}
          >
            {t('builder.projects')}
          </Typography>
          {projects.map((proj) => (
            <Box key={proj.id} sx={{ mb: 0.8 }} className="resume-section-item">
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}
              >
                {proj.name}{' '}
                {proj.link && (
                  <span style={{ fontSize: '0.76rem', fontWeight: 500, color: themeColor }}>
                    ({proj.link})
                  </span>
                )}
              </Typography>
              {proj.description && (
                <Typography variant="body2" sx={{ color: '#475569', mb: 0.15, fontSize: '0.78rem', lineHeight: 1.38 }}>
                  {proj.description}
                </Typography>
              )}
              {proj.technologies && proj.technologies.length > 0 && (
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.74rem' }}>
                  {locale === 'tr' ? 'Teknolojiler' : 'Tech'}: {proj.technologies.join(', ')}
                </Typography>
              )}
              {proj.highlights && proj.highlights.length > 0 && (
                <Box
                  component="ul"
                  sx={{ m: 0, pl: 2, mt: 0.15, color: '#334155', fontSize: '0.78rem' }}
                >
                  {proj.highlights.map((hl, idx) => (
                    <li key={idx} style={{ marginBottom: '1.5px', lineHeight: '1.32' }}>
                      {hl}
                    </li>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ) : null,

    certifications: () =>
      certifications.length > 0 ? (
        <Box sx={{ mb: 1.15 }} key="certifications" className="resume-section">
          <Typography
            variant="h6"
            className="resume-section-title"
            sx={{
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 0.4,
              borderBottom: '1px solid #f1f5f9',
              pb: 0.15,
            }}
          >
            {t('builder.certifications')}
          </Typography>
          {certifications.map((c) => (
            <Box key={c.id} sx={{ mb: 0.6 }} className="resume-section-item">
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}
                >
                  {c.name}
                </Typography>
                {c.date && (
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    {c.date}
                  </Typography>
                )}
              </Stack>
              {c.issuer && (
                <Typography
                  variant="body2"
                  sx={{ color: themeColor, fontWeight: 500, fontSize: '0.78rem' }}
                >
                  {c.issuer}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      ) : null,

    references: () =>
      references.length > 0 ? (
        <Box sx={{ mb: 0 }} key="references" className="resume-section">
          <Typography
            variant="h6"
            className="resume-section-title"
            sx={{
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: themeColor,
              mb: 0.4,
              borderBottom: '1px solid #f1f5f9',
              pb: 0.15,
            }}
          >
            {t('builder.references')}
          </Typography>
          <Grid container spacing={1}>
            {references.map((ref) => (
              <Grid size={{ xs: 12, sm: 6 }} key={ref.id} className="resume-section-item">
                <Box
                  sx={{
                    p: 0.75,
                    borderRadius: 1.5,
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}
                  >
                    {ref.fullName}
                  </Typography>
                  {(ref.position || ref.company) && (
                    <Typography
                      variant="body2"
                      sx={{ color: themeColor, fontWeight: 600, fontSize: '0.76rem' }}
                    >
                      {ref.position}
                      {ref.position && ref.company ? ' • ' : ''}
                      {ref.company}
                    </Typography>
                  )}
                  {ref.email && (
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: '#64748b', fontSize: '0.72rem' }}
                    >
                      {ref.email}
                    </Typography>
                  )}
                  {ref.phone && (
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: '#64748b', fontSize: '0.72rem' }}
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

  const hasContactInfo = Boolean(
    personalInfo.email ||
      personalInfo.phone ||
      personalInfo.location ||
      personalInfo.website ||
      personalInfo.linkedin ||
      personalInfo.github
  );

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        backgroundColor: (theme) => theme.palette.common.white,
        display: 'grid',
        gridTemplateColumns: '72mm 1fr',
        boxSizing: 'border-box',
        fontFamily: data.fontFamily || 'inherit',
      }}
    >
      {/* Left Sidebar Column */}
      <Stack
        sx={{
          backgroundColor: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          pt: '6mm',
          pb: '4mm',
          px: '5.5mm',
          gap: 1.5,
          boxSizing: 'border-box',
          minWidth: 0,
        }}
      >
        {/* Photo Avatar */}
        {personalInfo.showPhoto && personalInfo.avatar && (
          <Stack direction="row" sx={{ justifyContent: 'center', mb: 0.15 }}>
            <Avatar
              src={personalInfo.avatar}
              alt={personalInfo.fullName}
              sx={{
                width: 72,
                height: 72,
                borderRadius: getBorderRadius(),
                border: `2.5px solid ${themeColor}`,
                boxShadow: (theme) => `0 3px 10px ${alpha(theme.palette.common.black, 0.08)}`,
              }}
            />
          </Stack>
        )}

        {/* Contact Info */}
        {hasContactInfo && (
          <Box className="resume-section" sx={{ mb: 0 }}>
            <Typography
              variant="caption"
              className="resume-section-title"
              sx={{
                fontWeight: 800,
                fontSize: '0.74rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: themeColor,
                display: 'block',
                mb: 0.65,
                borderBottom: `2px solid ${alpha(themeColor, 0.25)}`,
                pb: 0.35,
              }}
            >
              {locale === 'tr' ? 'İletişim' : 'Contact'}
            </Typography>
            <Stack sx={{ gap: 0.75, fontSize: '0.73rem', color: '#475569' }}>
              {personalInfo.email && (
                <Stack
                  direction="row"
                  sx={{ alignItems: 'flex-start', gap: 1 }}
                  className="resume-section-item"
                >
                  <EmailOutlinedIcon
                    sx={{ fontSize: 14, color: themeColor, mt: 0.25, flexShrink: 0 }}
                  />
                  <span style={{ wordBreak: 'break-all', lineHeight: 1.35 }}>
                    {personalInfo.email}
                  </span>
                </Stack>
              )}
              {personalInfo.phone && (
                <Stack
                  direction="row"
                  sx={{ alignItems: 'center', gap: 1 }}
                  className="resume-section-item"
                >
                  <PhoneOutlinedIcon sx={{ fontSize: 14, color: themeColor, flexShrink: 0 }} />
                  <span>{personalInfo.phone}</span>
                </Stack>
              )}
              {personalInfo.location && (
                <Stack
                  direction="row"
                  sx={{ alignItems: 'flex-start', gap: 1 }}
                  className="resume-section-item"
                >
                  <LocationOnOutlinedIcon
                    sx={{ fontSize: 14, color: themeColor, mt: 0.25, flexShrink: 0 }}
                  />
                  <span style={{ lineHeight: 1.35 }}>{personalInfo.location}</span>
                </Stack>
              )}
              {personalInfo.website && (
                <Stack
                  direction="row"
                  sx={{ alignItems: 'flex-start', gap: 1 }}
                  className="resume-section-item"
                >
                  <LanguageOutlinedIcon
                    sx={{ fontSize: 14, color: themeColor, mt: 0.25, flexShrink: 0 }}
                  />
                  <span style={{ wordBreak: 'break-all', lineHeight: 1.35 }}>
                    {personalInfo.website}
                  </span>
                </Stack>
              )}
              {personalInfo.linkedin && (
                <Stack
                  direction="row"
                  sx={{ alignItems: 'flex-start', gap: 1 }}
                  className="resume-section-item"
                >
                  <LinkedInIcon sx={{ fontSize: 14, color: themeColor, mt: 0.25, flexShrink: 0 }} />
                  <span style={{ wordBreak: 'break-all', lineHeight: 1.35 }}>
                    {personalInfo.linkedin}
                  </span>
                </Stack>
              )}
              {personalInfo.github && (
                <Stack
                  direction="row"
                  sx={{ alignItems: 'flex-start', gap: 1 }}
                  className="resume-section-item"
                >
                  <GitHubIcon sx={{ fontSize: 14, color: themeColor, mt: 0.25, flexShrink: 0 }} />
                  <span style={{ wordBreak: 'break-all', lineHeight: 1.35 }}>
                    {personalInfo.github}
                  </span>
                </Stack>
              )}
            </Stack>
          </Box>
        )}

        {/* Dynamic Sidebar Sections */}
        {activeSidebarKeys.map((key) => sidebarRenderers[key]?.())}
      </Stack>

      {/* Right Main Column */}
      <Box
        sx={{
          pt: '6mm',
          pb: '4mm',
          pl: '7mm',
          pr: '8mm',
          boxSizing: 'border-box',
          minWidth: 0,
        }}
      >
        {/* Prominent Candidate Header in Main Column */}
        <Box sx={{ mb: 1.0 }} className="resume-section">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: themeColor,
              fontSize: '1.45rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              mb: 0.15,
            }}
          >
            {personalInfo.fullName || (locale === 'tr' ? 'Adınız Soyadınız' : 'Your Name')}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontSize: '0.76rem',
              mb: 0.65,
            }}
          >
            {personalInfo.jobTitle || (locale === 'tr' ? 'Hedef Pozisyon' : 'Target Position')}
          </Typography>
          <Box
            sx={{
              width: 40,
              height: 2.5,
              backgroundColor: themeColor,
              borderRadius: 1,
            }}
          />
        </Box>

        {/* Dynamic Main Sections */}
        {activeMainKeys.map((key) => mainRenderers[key]?.())}
      </Box>
    </Box>
  );
}

