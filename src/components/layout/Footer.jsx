import { Box, Container, Typography, Stack } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useLocale } from '../../hooks/useLocale.js';

/**
 * @file Footer.jsx
 * @description Minimalist, elegant footer.
 */
export function Footer() {
  const { t } = useLocale();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
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
          <Stack direction={{ md: 'row', xs: 'column' }} sx={{ alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              OzCraft
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('app.tagline')}
            </Typography>
          </Stack>

          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', textAlign: { xs: 'center' } }}
          >
            {t('footer.tagline')}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
