import { Box, Stack, Container, Typography, Button, Grid, Chip, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';

import { useLocale, useResume } from '../hooks/index.js';
import { PageTransition, ResumeModel } from '../components/index.js';
import { getTemplateList } from '../modules/index.js';

export function HomePage() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const { setTemplateId } = useResume();

  const templates = getTemplateList(t);

  const features = [
    {
      title: t('home.feature1Title'),
      desc: t('home.feature1Desc'),
      number: '01',
    },
    {
      title: t('home.feature2Title'),
      desc: t('home.feature2Desc'),
      number: '02',
    },
    {
      title: t('home.feature3Title'),
      desc: t('home.feature3Desc'),
      number: '03',
    },
    {
      title: t('home.feature4Title'),
      desc: t('home.feature4Desc'),
      number: '04',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <PageTransition>
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        {/* Hero Section */}
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          sx={{
            pt: { xs: 8, md: 16 },
            pb: { xs: 8, md: 12 },
            px: { xs: 3, md: 6 },
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Container maxWidth="lg" disableGutters>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '3rem', sm: '4.5rem', md: '5.5rem' },
                      lineHeight: 1,
                      fontWeight: 700,
                      letterSpacing: '-0.04em',
                      mb: 4,
                      textTransform: 'uppercase',
                    }}
                  >
                    {t('home.heroTitle')}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '1.25rem',
                      lineHeight: 1.5,
                      mb: 4,
                      fontWeight: 400,
                    }}
                  >
                    {t('home.heroSubtitle')}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => navigate('/editor')}
                      sx={{
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        flex: 1,
                      }}
                    >
                      {t('home.ctaStart')}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/templates')}
                      sx={{
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                      }}
                    >
                      {t('home.ctaTemplates')}
                    </Button>
                  </Stack>
                </motion.div>
              </Grid>
              <Grid
                size={{ xs: 12, md: 6 }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <motion.div
                  variants={itemVariants}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <ResumeModel />
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
          <Container maxWidth="lg" disableGutters>
            <Grid container>
              {features.map((feat, idx) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 3 }}
                  key={idx}
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  sx={{
                    borderRight: (theme) => ({
                      xs: 'none',
                      sm: idx % 2 === 0 ? `1px solid ${theme.palette.divider}` : 'none',
                      md: idx < 3 ? `1px solid ${theme.palette.divider}` : 'none',
                    }),
                    borderBottom: (theme) => ({
                      xs: `1px solid ${theme.palette.divider}`,
                      sm: idx < 2 ? `1px solid ${theme.palette.divider}` : 'none',
                      md: 'none',
                    }),
                    p: 4,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}
                  >
                    {feat.number}
                  </Typography>
                  <Typography variant="h4" sx={{ fontSize: '1.5rem', mb: 2 }}>
                    {feat.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {feat.desc}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Template Showcase */}
        <Box sx={{ py: 12, px: { xs: 3, md: 6 } }}>
          <Container maxWidth="lg" disableGutters>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box
                sx={{
                  mb: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: 4,
                }}
              >
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      mb: 2,
                      textTransform: 'uppercase',
                    }}
                  >
                    {t('templates.galleryTitle')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.25rem', maxWidth: 600 }}>
                    {t('templates.gallerySubtitle')}
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            <Grid container spacing={4}>
              {templates.map((tpl, i) => (
                <Grid size={{ xs: 12, md: 6 }} key={tpl.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 4,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'dark' ? '#111' : '#f5f5f5',
                        },
                      }}
                      onClick={() => {
                        setTemplateId(tpl.id);
                        navigate('/editor');
                      }}
                    >
                      <Box sx={{ flex: 1, mb: 4 }}>
                        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', mb: 3 }}>
                          {(tpl.tags || []).slice(0, 3).map((tag, i) => (
                            <Chip key={i} label={tag} variant="outlined" sx={{ fontWeight: 500 }} />
                          ))}
                        </Stack>
                        <Typography variant="h3" sx={{ fontSize: '2rem', mb: 2 }}>
                          {tpl.name}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: 'text.secondary', fontSize: '1.1rem' }}
                        >
                          {tpl.description}
                        </Typography>
                      </Box>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ fontWeight: 600 }}
                      >
                        <Typography variant="button">{t('templates.useTemplate')}</Typography>
                        <ArrowForwardIcon fontSize="small" />
                      </Stack>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </PageTransition>
  );
}
