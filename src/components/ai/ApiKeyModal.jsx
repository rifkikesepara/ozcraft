import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Alert,
  CircularProgress,
  alpha,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useAI, useLocale } from '../../hooks/index.js';
import { axiosClient } from '../../utils/axiosClient.js';

/**
 * @file ApiKeyModal.jsx
 * @description Dialog allowing the user to provide/update their Ollama Cloud API Key.
 * Performs a lightweight pre-flight ping before persisting securely in cookies.
 */
export function ApiKeyModal() {
  const { isKeyModalOpen, closeKeyModal, apiKey, setApiKey } = useAI();
  const { t } = useLocale();

  const [inputKey, setInputKey] = useState(apiKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, message: string }

  const handleTest = async () => {
    if (!inputKey.trim()) return;
    setIsTesting(true);
    setTestResult(null);

    try {
      // Test key with tags endpoint
      await axiosClient.get('/tags', {
        headers: {
          Authorization: `Bearer ${inputKey.trim()}`,
        },
      });

      setTestResult({
        success: true,
        message: 'Connection successful! API key is valid.',
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: err.response?.data?.error || err.message || 'Failed to authenticate with Ollama.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (!inputKey.trim()) return;
    setApiKey(inputKey.trim());
    closeKeyModal();
  };

  return (
    <Dialog
      open={isKeyModalOpen}
      onClose={closeKeyModal}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Stack
          direction="row"
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
          }}
        >
          <LockOutlinedIcon />
        </Stack>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t('ai.apiKeyRequired')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {t('ai.modalDesc')}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ borderLeft: 'none', borderRight: 'none' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {t('ai.apiKeyPrompt')}
        </Typography>

        <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
          {t('settings.securityAlert')}
        </Alert>

        <TextField
          autoFocus
          fullWidth
          type="password"
          label={t('ai.apiKeyPlaceholder')}
          placeholder="ollama_sec_..."
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          sx={{ mb: 2 }}
        />

        {testResult && (
          <Alert
            severity={testResult.success ? 'success' : 'error'}
            icon={testResult.success ? <CheckCircleOutlinedIcon /> : undefined}
            sx={{ mb: 1, borderRadius: 2 }}
          >
            {testResult.message}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button
          onClick={handleTest}
          disabled={!inputKey.trim() || isTesting}
          variant="outlined"
          size="small"
          startIcon={isTesting ? <CircularProgress size={16} /> : undefined}
        >
          {isTesting ? t('settings.testing') : t('settings.testConnection')}
        </Button>

        <Stack direction="row" sx={{ gap: 1 }}>
          <Button onClick={closeKeyModal} color="inherit">
            {t('ai.discard')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!inputKey.trim()}
            variant="contained"
            color="primary"
          >
            {t('ai.saveKey')}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
