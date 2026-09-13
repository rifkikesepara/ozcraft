import { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  alpha,
  Divider,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import { useSnackbar } from 'notistack';

import { useAI, useThemeMode, useResume, useLocale } from '../hooks/index.js';
import { PageTransition, ConfirmDialog } from '../components/index.js';
import { getAIAdapter } from '../utils/ai/index.js';
import { getApiKey, getDisplayApiUrl } from '../utils/cookieStorage.js';

/**
 * @file SettingsPage.jsx
 * @description Settings configuration view for Ollama Cloud credentials,
 * custom API endpoints, color themes, dark mode toggle, and local storage data management.
 */
export function SettingsPage() {
  const [newKeyInput, setNewKeyInput] = useState('');
  const [endpointInput, setEndpointInput] = useState(() => getDisplayApiUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [cookieKey, setCookieKey] = useState(() => getApiKey() || '');
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: '',
    message: '',
    confirmColor: 'primary',
    onConfirm: null,
  });

  const {
    providerId,
    setProviderId,
    model,
    setModel,
    updateApiUrl,
    supportedProviders = [],
    defaultModels = [],
    listModels,
    saveApiKey,
    clearApiKey,
    hasApiKey: isKeyPresent,
  } = useAI();

  const [availableModels, setAvailableModels] = useState(defaultModels);

  useEffect(() => {
    let isMounted = true;
    listModels()
      .then((fetchedModels) => {
        if (isMounted && Array.isArray(fetchedModels) && fetchedModels.length > 0) {
          setAvailableModels(fetchedModels);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAvailableModels(defaultModels);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [listModels, providerId, defaultModels]);

  const {
    mode,
    toggleMode,
    activePaletteId,
    setPaletteId,
    palettes = [],
    isMobile,
  } = useThemeMode();
  const { resetToDefault, clearAll } = useResume();
  const { t } = useLocale();
  const { enqueueSnackbar } = useSnackbar();

  const handleSaveKey = () => {
    if (!newKeyInput.trim()) return;
    saveApiKey(newKeyInput.trim());
    setCookieKey(newKeyInput.trim());
    setNewKeyInput('');
    enqueueSnackbar(t('settings.keySaved'), { variant: 'success' });
  };

  const handleClearKey = () => {
    clearApiKey();
    setCookieKey('');
    enqueueSnackbar(t('settings.keyCleared'), { variant: 'info' });
  };

  const handleSaveEndpoint = async () => {
    if (!endpointInput.trim()) return;
    updateApiUrl(endpointInput.trim());
    enqueueSnackbar(
      'API Endpoint URL updated! Requests are proxied via /api/ollama to avoid CORS.',
      { variant: 'success' }
    );
    try {
      const freshModels = await listModels();
      if (Array.isArray(freshModels) && freshModels.length > 0) {
        setAvailableModels(freshModels);
      }
    } catch {}
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const adapter = getAIAdapter(providerId);
      const res = await adapter.testConnection(cookieKey);
      if (res.success) {
        enqueueSnackbar(res.message || t('settings.testSuccess'), { variant: 'success' });
        try {
          const freshModels = await listModels();
          if (Array.isArray(freshModels) && freshModels.length > 0) {
            setAvailableModels(freshModels);
          }
        } catch {}
      } else {
        enqueueSnackbar(
          res.message ||
            'Cannot reach Ollama at this endpoint. Verify internet/proxy connection or use Built-in AI mode.',
          { variant: 'warning', autoHideDuration: 6000 }
        );
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Connection failed. Verify network or check API endpoint.', {
        variant: 'error',
        autoHideDuration: 6000,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleResetSampleData = () => {
    setConfirmModal({
      open: true,
      title: t('settings.confirmResetTitle'),
      message: t('settings.confirmReset'),
      confirmColor: 'primary',
      onConfirm: () => {
        resetToDefault();
        enqueueSnackbar(t('settings.dataReset'), { variant: 'info' });
        setConfirmModal((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleClearEverything = () => {
    setConfirmModal({
      open: true,
      title: t('settings.confirmClearTitle'),
      message: t('settings.confirmClear'),
      confirmColor: 'error',
      onConfirm: () => {
        clearAll();
        setConfirmModal((prev) => ({ ...prev, open: false }));
      },
    });
  };

  return (
    <PageTransition>
      <Container
        maxWidth="md"
        sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Box sx={{ mb: 5, textAlign: 'center', maxWidth: 650 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
            {t('settings.title')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t('settings.subtitle')}
          </Typography>
        </Box>

        {/* Section 1: AI Provider Settings */}
        <Paper
          elevation={0}
          sx={{
            p: 3.5,
            borderRadius: 3.5,
            border: '1px solid',
            borderColor: 'divider',
            mb: 4,
            width: '100%',
            maxWidth: 760,
            mx: 'auto',
          }}
        >
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 2 }}>
            <LockOutlinedIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t('settings.aiConfig')}
            </Typography>
          </Stack>

          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            {t('settings.securityAlert')}
          </Alert>

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('settings.provider')}</InputLabel>
                <Select
                  label={t('settings.provider')}
                  value={providerId}
                  onChange={(e) => setProviderId(e.target.value)}
                >
                  {supportedProviders.map((p) => (
                    <MenuItem key={p.id} value={p.id} disabled={!p.enabled}>
                      {p.name} {p.badge ? `(${p.badge})` : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('settings.model')}</InputLabel>
                <Select
                  label={t('settings.model')}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  {availableModels.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.name}
                    </MenuItem>
                  ))}
                  {!availableModels.some((m) => m.id === model) && (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Configurable Endpoint URL */}
            <Grid size={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.75 }}>
                {t('settings.apiUrl')}
              </Typography>
              <Stack direction={{ md: 'row', xs: 'column' }} spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="https://ollama.com/api or http://localhost:11434"
                  value={endpointInput}
                  onChange={(e) => setEndpointInput(e.target.value)}
                  helperText={!isMobile && t('settings.corsHelper')}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveEndpoint}
                  disabled={!endpointInput.trim()}
                  sx={{ height: 40, whiteSpace: 'nowrap' }}
                >
                  {t('settings.saveUrl')}
                </Button>
              </Stack>
            </Grid>

            {/* API Key */}
            <Grid size={12}>
              <Stack
                direction={{ md: 'row', xs: 'column' }}
                sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {t('settings.apiKey')}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: cookieKey || isKeyPresent ? 'success.main' : 'text.secondary',
                    fontWeight: 600,
                  }}
                >
                  {cookieKey || isKeyPresent
                    ? t('settings.keyActive')
                    : t('settings.keyNotConfigured')}
                </Typography>
              </Stack>

              <Stack direction={{ md: 'row', xs: 'column' }} sx={{ gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  placeholder={
                    cookieKey || isKeyPresent
                      ? '••••••••••••••••••••'
                      : t('settings.keyPlaceholder')
                  }
                  value={newKeyInput}
                  onChange={(e) => setNewKeyInput(e.target.value)}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveKey}
                  disabled={!newKeyInput.trim()}
                >
                  {t('settings.save')}
                </Button>
                {(cookieKey || isKeyPresent) && (
                  <Button variant="outlined" color="error" size="small" onClick={handleClearKey}>
                    {t('settings.clearKey')}
                  </Button>
                )}
              </Stack>
            </Grid>
            <Grid size={12}>
              <Divider />
            </Grid>
            <Grid size={12}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={handleTestConnection}
                disabled={isTesting}
                startIcon={isTesting ? <CircularProgress size={16} /> : undefined}
              >
                {isTesting ? t('settings.testing') : t('settings.testConnection')}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Section 2: Theme & Visuals */}
        <Paper
          elevation={0}
          sx={{
            p: 3.5,
            borderRadius: 3.5,
            border: '1px solid',
            borderColor: 'divider',
            mb: 4,
            width: '100%',
            maxWidth: 760,
            mx: 'auto',
          }}
        >
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 2 }}>
            <PaletteOutlinedIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t('settings.theme')}
            </Typography>
          </Stack>

          <FormControlLabel
            control={<Switch checked={mode === 'dark'} onChange={toggleMode} />}
            label={<Typography sx={{ fontWeight: 600 }}>{t('settings.darkMode')}</Typography>}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
            {t('settings.accentColor')}
          </Typography>

          <Stack direction="row" sx={{ gap: 1.5, flexWrap: 'wrap' }}>
            {palettes.map((preset) => {
              const isSelected = activePaletteId === preset.id;
              return (
                <Button
                  key={preset.id}
                  variant={isSelected ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setPaletteId(preset.id)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'divider',
                    color: isSelected ? 'common.white' : 'text.primary',
                    backgroundColor: isSelected ? preset.primary : 'transparent',
                    '&:hover': {
                      backgroundColor: isSelected ? preset.primary : 'action.hover',
                    },
                  }}
                  startIcon={
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        backgroundColor: preset.primary,
                        border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.4)}`,
                      }}
                    />
                  }
                >
                  {preset.name}
                </Button>
              );
            })}
          </Stack>
        </Paper>

        {/* Section 3: Data Management */}
        <Paper
          elevation={0}
          sx={{
            p: 3.5,
            borderRadius: 3.5,
            border: '1px solid',
            borderColor: 'divider',
            width: '100%',
            maxWidth: 760,
            mx: 'auto',
          }}
        >
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 2 }}>
            <StorageOutlinedIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t('settings.dataManagement')}
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {t('settings.dataSubtitle')}
          </Typography>

          <Stack direction="row" sx={{ gap: 2, flexWrap: 'wrap' }}>
            <Button
              fullWidth={isMobile}
              variant="outlined"
              color="primary"
              onClick={handleResetSampleData}
            >
              {t('settings.resetData')}
            </Button>
            <Button
              fullWidth={isMobile}
              variant="outlined"
              color="error"
              onClick={handleClearEverything}
            >
              {t('settings.clearAll')}
            </Button>
          </Stack>
        </Paper>

        <ConfirmDialog
          open={confirmModal.open}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmColor={confirmModal.confirmColor}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
        />
      </Container>
    </PageTransition>
  );
}
