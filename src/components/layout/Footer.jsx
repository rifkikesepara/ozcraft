import { Box, Container, Typography, Stack, Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GitHubIcon from '@mui/icons-material/GitHub';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import { useLocale } from '../../hooks/useLocale.js';

/**
 * @file Footer.jsx
 * @description Minimalist, elegant footer with repository source code and feedback links.
 */
export function Footer() {
  const { t } = useLocale();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              OzCraft
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('app.tagline')}
            </Typography>
          </Stack>

          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', textAlign: { xs: 'center', sm: 'right' }, mr: { sm: 1 } }}
            >
              {t('footer.tagline')}
            </Typography>

            <Button
              component="a"
              href="https://github.com/rifkikesepara/resume-builder"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<GitHubIcon sx={{ fontSize: '1.05rem !important' }} />}
              sx={{
                borderRadius: 2,
                fontSize: '0.78rem',
                textTransform: 'none',
                fontWeight: 600,
                borderColor: 'divider',
                color: 'text.primary',
                px: 1.25,
                py: 0.35,
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              {t('footer.sourceCode') || 'GitHub'}
            </Button>

            <Button
              component="a"
              href="https://github.com/rifkikesepara/resume-builder/issues"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<FeedbackOutlinedIcon sx={{ fontSize: '1.05rem !important' }} />}
              sx={{
                borderRadius: 2,
                fontSize: '0.78rem',
                textTransform: 'none',
                fontWeight: 600,
                borderColor: 'divider',
                color: 'text.primary',
                px: 1.25,
                py: 0.35,
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              {t('footer.feedback') || 'Feedback'}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}


