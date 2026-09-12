import React from 'react';
import {
  Box,
  Stack,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import { motion } from 'framer-motion';

import { useLocale } from '../hooks/useLocale.js';
import { useResume } from '../hooks/useResume.js';
import { PageTransition } from '../components/common/PageTransition.jsx';
import { getTemplateList } from '../modules/templates/templateRegistry.js';

/**
 * @file HomePage.jsx
 * @description Modern minimalist landing page with hero banner, centered feature cards,
 * and centered template showcase cards.
 */
export function HomePage() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const { setTemplateId } = useResume();

  const templates = getTemplateList(t);

  const features = [
    {
      icon: <StyleOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
      title: t('home.feature1Title'),
      desc: t('home.feature1Desc'),
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
      title: t('home.feature2Title'),
      desc: t('home.feature2Desc'),
    },
    {
      icon: <PictureAsPdfOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
      title: t('home.feature3Title'),
      desc: t('home.feature3Desc'),
    },
    {
      icon: <SecurityOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
      title: t('home.feature4Title'),
      desc: t('home.feature4Desc'),
    },
  ];

  return (
    <PageTransition>
      <Box sx={{ overflow: 'hidden' }}>
        {/* Hero Section */}
        <Box
          sx={{
            py: { xs: 8, md: 13 },
            textAlign: 'center',
            position: 'relative',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? `radial-gradient(circle at 50% 20%, ${alpha(theme.palette.primary.main, 0.12)} 0%, transparent 60%)`
                : `radial-gradient(circle at 50% 20%, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 60%)`,
          }}
        >
          <Container maxWidth="md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Chip
                icon={<AutoAwesomeIcon sx={{ fontSize: '15px !important' }} />}
                label={t('home.heroBadge')}
                color="primary"
                variant="outlined"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  py: 0.5,
                  borderRadius: 3,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.05),
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.2rem' },
                  lineHeight: 1.15,
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  mb: 2.5,
                }}
              >
                {t('home.heroTitle')}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1.05rem', sm: '1.25rem' },
                  color: 'text.secondary',
                  maxWidth: 680,
                  mx: 'auto',
                  mb: 4.5,
                  lineHeight: 1.6,
                }}
              >
                {t('home.heroSubtitle')}
              </Typography>

              <Stack direction="row" sx={{ justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={motion.button}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/editor')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    boxShadow: (theme) => `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
                  }}
                >
                  {t('home.ctaStart')}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/templates')}
                  sx={{
                    px: 3.5,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                  }}
                >
                  {t('home.ctaTemplates')}
                </Button>
              </Stack>
            </motion.div>
          </Container>
        </Box>

        {/* Features Grid */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={3} justifyContent="center">
            {features.map((feat, idx) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                key={idx}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <Card
                  component={motion.div}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  sx={{
                    height: '100%',
                    width: '100%',
                    maxWidth: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1.5,
                    backgroundColor: 'background.paper',
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    <Stack
                      direction="row"
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '12px',
                        backgroundColor: (theme) =>
                          alpha(
                            theme.palette.primary.main,
                            theme.palette.mode === 'dark' ? 0.15 : 0.08
                          ),
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      {feat.icon}
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 1 }}>
                      {feat.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {feat.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Template Showcase Strip */}
        <Container maxWidth="lg" sx={{ pb: 12 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 800, mb: 1 }}
            >
              {t('templates.galleryTitle')}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {t('templates.gallerySubtitle')}
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            {templates.map((tpl) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                key={tpl.id}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <Paper
                  component={motion.div}
                  whileHover={{ y: -6 }}
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    height: '100%',
                    width: '100%',
                    maxWidth: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => {
                    setTemplateId(tpl.id);
                    navigate('/editor');
                  }}
                >
                  <Box>
                    <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap', mb: 1.5 }}>
                      {(tpl.tags || []).slice(0, 2).map((tag, i) => (
                        <Chip
                          key={i}
                          label={tag}
                          size="small"
                          sx={{ fontSize: '0.7rem', height: 22 }}
                        />
                      ))}
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 1 }}>
                      {tpl.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 2 }}
                    >
                      {tpl.description}
                    </Typography>
                  </Box>

                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    endIcon={<ArrowForwardIcon fontSize="small" />}
                    sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                  >
                    {t('templates.useTemplate')}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </PageTransition>
  );
}
