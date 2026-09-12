import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  CircularProgress,
  Chip,
  Alert,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TranslateIcon from '@mui/icons-material/Translate';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useAI } from '../../hooks/useAI.js';
import { useLocale } from '../../hooks/useLocale.js';
import { AI_PROMPTS } from '../../utils/ai/index.js';
import { getSmartFallback } from '../../utils/ai/smartFallback.js';

/**
 * @file AIEnhanceModal.jsx
 * @description Dialog presenting live AI generated text and enhancements with side-by-side comparison,
 * multiple style tones, explicit language output indicator, and graceful offline fallback support.
 */
export function AIEnhanceModal() {
  const theme = useTheme();
  const ai = theme.palette.ai || {};
  const { enhanceModalState, closeEnhanceModal, generate, model, apiUrl } = useAI();
  const { t, locale } = useLocale();
  const navigate = useNavigate();

  const [selectedStyle, setSelectedStyle] = useState('action');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentEnhancedText, setCurrentEnhancedText] = useState('');
  const [isFallbackActive, setIsFallbackActive] = useState(false);

  const displayedText = currentEnhancedText || enhanceModalState.enhancedText;
  const isFallback = isFallbackActive || enhanceModalState.isFallbackMode;

  const handleRegenerate = async (styleToUse) => {
    const style = styleToUse || selectedStyle;
    setIsRegenerating(true);

    let prompt;
    if (enhanceModalState.promptType === 'summary') {
      const { jobTitle, skills } = enhanceModalState.metadata || {};
      prompt = AI_PROMPTS.generateSummary(jobTitle || 'Professional', skills || '', '', locale);
    } else if (enhanceModalState.promptType === 'skills') {
      const { role } = enhanceModalState.metadata || {};
      prompt = AI_PROMPTS.suggestSkills(role || 'Software Engineer', locale);
    } else {
      prompt = AI_PROMPTS.enhanceBullet(enhanceModalState.originalText, style, locale);
    }

    try {
      const res = await generate(prompt);
      setCurrentEnhancedText(res);
    } catch {
      // Graceful localized smart fallback on network or CORS disconnect
      const fallback = getSmartFallback(prompt, locale);
      setCurrentEnhancedText(fallback);
      setIsFallbackActive(true);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleApply = () => {
    if (displayedText && enhanceModalState.onApply) {
      enhanceModalState.onApply(displayedText);
    }
    closeEnhanceModal();
    setCurrentEnhancedText('');
    setIsFallbackActive(false);
  };

  const handleGoToSettings = () => {
    closeEnhanceModal();
    navigate('/settings');
  };

  return (
    <Dialog
      open={enhanceModalState.isOpen}
      onClose={closeEnhanceModal}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 1.5,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '10px',
              backgroundColor: (tTheme) =>
                alpha(tTheme.palette.primary.main, tTheme.palette.mode === 'dark' ? 0.16 : 0.08),
              color: ai.iconColor || 'primary.main',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 20 }} />
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {enhanceModalState.title || t('ai.modalTitle')}
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {/* Active Locale Output Indicator */}
          <Chip
            icon={<TranslateIcon sx={{ fontSize: '15px !important' }} />}
            label={locale === 'tr' ? '🇹🇷 Türkçe Çıktı' : '🇺🇸 English Output'}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          />

          {isFallback && (
            <Chip
              icon={<InfoOutlinedIcon sx={{ fontSize: '14px !important' }} />}
              label={t('ai.fallbackBadge') || 'Built-in AI Fallback'}
              color="warning"
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.72rem' }}
            />
          )}

          <Chip
            label={`Model: ${model}`}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          />
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5 }}>
        {/* Style Selection Pills (shown for bullet point enhancements) */}
        {enhanceModalState.promptType !== 'skills' && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}
            >
              {t('ai.chooseOption')}
            </Typography>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
              {[
                { id: 'action', label: t('ai.styleAction') },
                { id: 'concise', label: t('ai.styleConcise') },
                { id: 'executive', label: t('ai.styleExecutive') },
              ].map((style) => (
                <Chip
                  key={style.id}
                  label={style.label}
                  clickable
                  color={selectedStyle === style.id ? 'primary' : 'default'}
                  variant={selectedStyle === style.id ? 'filled' : 'outlined'}
                  onClick={() => {
                    setSelectedStyle(style.id);
                    handleRegenerate(style.id);
                  }}
                  sx={{ fontWeight: 600 }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Fallback & Offline Guidance Notice */}
        {isFallback && (
          <Alert
            severity="info"
            sx={{ mb: 2.5, borderRadius: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                startIcon={<SettingsOutlinedIcon fontSize="small" />}
                onClick={handleGoToSettings}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {t('settings.title') || 'Settings'}
              </Button>
            }
          >
            {locale === 'tr'
              ? `Ollama uç noktanız (${apiUrl}) erişilemediğinden dahili yapay zeka motoru Türkçe olarak kullanıldı. Bulut modelinizi kontrol etmek için Ayarlar sayfasını ziyaret edin.`
              : `Generated using the built-in AI writing engine because your Ollama endpoint (${apiUrl}) was unreachable. Check Settings to verify model and connection.`}
          </Alert>
        )}

        {enhanceModalState.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {enhanceModalState.error}
          </Alert>
        )}

        {/* Side by side comparison cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {/* Original Card */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: 'background.default',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase' }}
            >
              {t('ai.original')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              {enhanceModalState.originalText || 'No original text provided.'}
            </Typography>
          </Paper>

          {/* AI Enhanced Card */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              borderColor: 'primary.main',
              backgroundColor: (tTheme) =>
                alpha(tTheme.palette.primary.main, tTheme.palette.mode === 'dark' ? 0.08 : 0.03),
              position: 'relative',
              minHeight: 140,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'primary.main', mb: 1, textTransform: 'uppercase' }}
            >
              {t('ai.enhanced')} ({locale === 'tr' ? 'Türkçe' : 'English'})
            </Typography>

            <AnimatePresence mode="wait">
              {enhanceModalState.isLoading || isRegenerating ? (
                <Stack
                  key="loading"
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  sx={{ alignItems: 'center', justifyContent: 'center', flex: 1, py: 3 }}
                >
                  <CircularProgress size={28} />
                  <Typography variant="caption" sx={{ mt: 1.5, color: 'text.secondary' }}>
                    {t('ai.enhancing')}
                  </Typography>
                </Stack>
              ) : (
                <Typography
                  key="text"
                  component={motion.div}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  variant="body2"
                  sx={{ fontWeight: 500, color: 'text.primary', lineHeight: 1.65 }}
                >
                  {displayedText || 'No generation result.'}
                </Typography>
              )}
            </AnimatePresence>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          px: 3,
          justifyContent: 'space-between',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button
          onClick={() => handleRegenerate()}
          disabled={enhanceModalState.isLoading || isRegenerating}
          startIcon={<RefreshIcon />}
          variant="outlined"
          size="small"
        >
          {t('ai.regenerate') || 'Regenerate'}
        </Button>

        <Stack direction="row" sx={{ gap: 1 }}>
          <Button onClick={closeEnhanceModal} color="inherit">
            {t('ai.discard')}
          </Button>
          <Button
            onClick={handleApply}
            disabled={enhanceModalState.isLoading || isRegenerating || !displayedText}
            variant="contained"
            color="primary"
            startIcon={<CheckIcon />}
            sx={{
              borderRadius: 2,
              px: 2.5,
              fontWeight: 600,
            }}
          >
            {t('ai.apply')}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
