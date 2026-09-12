import React from 'react';
import { Box, Typography, Tooltip, CircularProgress, alpha } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncIcon from '@mui/icons-material/Sync';
import { motion } from 'framer-motion';
import { useResume } from '../../hooks/useResume.js';
import { useLocale } from '../../hooks/useLocale.js';
import { SAVING_STATUS } from '../../utils/constants.js';

/**
 * @file SaveStatusBadge.jsx
 * @description Visual indicator badge indicating auto-save state to browser localStorage.
 */
export function SaveStatusBadge() {
  const { saveStatus, manualSave } = useResume();
  const { t } = useLocale();

  const getStatusConfig = () => {
    switch (saveStatus) {
      case SAVING_STATUS.SAVING:
        return {
          icon: <CircularProgress size={12} color="inherit" thickness={6} />,
          text: t('status.saving'),
          colorKey: 'warning.main',
        };
      case SAVING_STATUS.UNSAVED:
        return {
          icon: <SyncIcon sx={{ fontSize: 13 }} />,
          text: t('status.unsaved'),
          colorKey: 'error.main',
        };
      case SAVING_STATUS.SAVED:
      default:
        return {
          icon: <CheckCircleIcon sx={{ fontSize: 13 }} />,
          text: t('status.saved'),
          colorKey: 'success.main',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Tooltip title={t('status.forceSave')} arrow>
      <Box
        component={motion.div}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={manualSave}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.25,
          py: 0.4,
          borderRadius: 20,
          backgroundColor: (theme) => {
            const paletteColor =
              config.colorKey === 'warning.main'
                ? theme.palette.warning.main
                : config.colorKey === 'error.main'
                  ? theme.palette.error.main
                  : theme.palette.success.main;
            return alpha(paletteColor, 0.1);
          },
          color: config.colorKey,
          cursor: 'pointer',
          userSelect: 'none',
          fontSize: '0.75rem',
          fontWeight: 600,
          transition: 'background-color 0.2s ease',
        }}
      >
        {config.icon}
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'inherit' }}
        >
          {config.text}
        </Typography>
      </Box>
    </Tooltip>
  );
}
