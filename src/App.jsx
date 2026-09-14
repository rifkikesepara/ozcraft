import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { Box, Stack } from '@mui/material';

import { LocaleProvider } from './providers/LocaleProvider.jsx';
import { AppThemeProvider } from './providers/AppThemeProvider.jsx';
import { ResumeProvider } from './providers/ResumeProvider.jsx';
import { AIProvider } from './providers/AIProvider.jsx';

import { Navbar, Footer } from './components/index.js';
import { AppRoutes } from './routes/AppRoutes.jsx';

/**
 * @file App.jsx
 * @description Main application root component wiring all contextual providers:
 * Routing, Localization (react-intl), Theme (MUI), Notifications (notistack),
 * Resume State (localStorage), and AI Integration (Ollama Cloud).
 */
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LocaleProvider>
        <AppThemeProvider>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            autoHideDuration={3500}
          >
            <ResumeProvider>
              <AIProvider>
                <Stack
                  sx={{
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                    color: 'text.primary',
                  }}
                >
                  <Navbar />
                  <Box component="main" sx={{ flex: 1 }}>
                    <AppRoutes />
                  </Box>
                  <Footer />
                </Stack>
              </AIProvider>
            </ResumeProvider>
          </SnackbarProvider>
        </AppThemeProvider>
      </LocaleProvider>
    </BrowserRouter>
  );
}
