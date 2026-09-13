import {
  Box,
  Stack,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Paper,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';

import { useResume, useLocale } from '../hooks/index.js';
import { PageTransition } from '../components/index.js';
import { getTemplateList } from '../modules/index.js';

/**
 * @file TemplatesPage.jsx
 * @description Gallery page showcasing all available CV templates with centered cards
 * and instant selection.
 */
export function TemplatesPage() {
  const navigate = useNavigate();
  const { resumeData, setTemplateId } = useResume();
  const { t } = useLocale();

  const templates = getTemplateList(t);
  const activeId = resumeData?.templateId || 'modern';

  const handleSelect = (id) => {
    setTemplateId(id);
    navigate('/editor');
  };

  return (
    <PageTransition>
      <Container
        maxWidth="lg"
        sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Box sx={{ textAlign: 'center', mb: 6, maxWidth: 650, mx: 'auto' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: '-0.02em' }}>
            {t('templates.galleryTitle')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t('templates.gallerySubtitle')}
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center" sx={{ width: '100%' }}>
          {templates.map((tpl) => {
            const isActive = activeId === tpl.id;
            const Component = tpl.component;

            return (
              <Grid
                size={{ xs: 12, md: 6 }}
                key={tpl.id}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <Card
                  component={motion.div}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  sx={{
                    borderRadius: 3.5,
                    border: '2px solid',
                    borderColor: isActive ? 'primary.main' : 'divider',
                    boxShadow: (theme) =>
                      isActive
                        ? `0 10px 30px ${alpha(theme.palette.primary.main, 0.15)}`
                        : `0 4px 20px ${alpha(theme.palette.common.black, 0.04)}`,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    width: '100%',
                    maxWidth: 540,
                    mx: 'auto',
                  }}
                >
                  {/* Miniature Live Preview Frame */}
                  <Stack
                    direction="row"
                    sx={{
                      height: 280,
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? theme.palette.background.default
                          : alpha(theme.palette.divider, 0.3),
                      overflow: 'hidden',
                      position: 'relative',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      pt: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{
                        transform: 'scale(0.38)',
                        transformOrigin: 'top center',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        justifyContent: 'center',
                        width: '210mm',
                        mx: 'auto',
                      }}
                    >
                      <Paper
                        elevation={3}
                        sx={{
                          width: '210mm',
                          minHeight: '297mm',
                          backgroundColor: (theme) => theme.palette.common.white,
                          overflow: 'hidden',
                          mx: 'auto',
                        }}
                      >
                        <Component data={resumeData} themeColor={resumeData.themeColor} />
                      </Paper>
                    </Stack>

                    {isActive && (
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: '15px !important' }} />}
                        label={t('templates.current')}
                        color="primary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 14,
                          right: 14,
                          fontWeight: 700,
                          borderRadius: 2,
                        }}
                      />
                    )}
                  </Stack>

                  <CardContent sx={{ flex: 1, p: 3 }}>
                    <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap', mb: 1.5 }}>
                      {(tpl.tags || []).map((tag, i) => (
                        <Chip
                          key={i}
                          label={tag}
                          size="small"
                          sx={{ fontSize: '0.72rem', height: 22, fontWeight: 600 }}
                        />
                      ))}
                    </Stack>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {tpl.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {tpl.description}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={isActive ? 'outlined' : 'contained'}
                      color="primary"
                      onClick={() => handleSelect(tpl.id)}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ fontWeight: 700, borderRadius: 2.5, py: 1.2 }}
                    >
                      {isActive ? t('templates.continueEditing') : t('templates.useTemplate')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </PageTransition>
  );
}
