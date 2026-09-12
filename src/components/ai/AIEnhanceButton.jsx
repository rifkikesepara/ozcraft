import React from 'react';
import { Tooltip, IconButton, Button, Box, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion } from 'framer-motion';
import { useLocale } from '../../hooks/useLocale.js';

/**
 * @file AIEnhanceButton.jsx
 * @description Elegant, outline-only animated neon AI trigger button.
 * The button surface uses the solid, comfortable theme background to avoid visual fatigue,
 * while the neon animation runs exclusively along the 1.5px outline using 100% GPU rotation.
 * All colors are dynamically derived from theme.palette.ai with zero static colors.
 *
 * @param {object} props
 * @param {() => void} props.onClick - Handler triggered on click
 * @param {boolean} [props.iconOnly=true] - Whether to render as an icon button or labeled button
 * @param {string} [props.label] - Custom label
 * @param {boolean} [props.disabled=false] - Disabled state
 */
export function AIEnhanceButton({ onClick, iconOnly = true, label, disabled = false }) {
  const { t } = useLocale();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const ai = theme.palette.ai || {
    borderGradient: 'conic-gradient(from 0deg, #6366f1, #a855f7, #ec4899, #06b6d4, #6366f1)',
    glowAura: isDark
      ? `0 0 10px ${alpha('#8b5cf6', 0.35)}, 0 0 20px ${alpha('#06b6d4', 0.18)}`
      : `0 0 8px ${alpha('#8b5cf6', 0.25)}, 0 0 16px ${alpha('#06b6d4', 0.12)}`,
    glowHover: isDark
      ? `0 0 14px ${alpha('#8b5cf6', 0.6)}, 0 0 26px ${alpha('#ec4899', 0.35)}`
      : `0 0 12px ${alpha('#8b5cf6', 0.45)}, 0 0 20px ${alpha('#ec4899', 0.25)}`,
    buttonBg: isDark ? '#111827' : '#ffffff',
    buttonBgHover: isDark ? '#1f293d' : '#f8fafc',
    text: isDark ? '#f1f5f9' : '#1e293b',
    iconColor: isDark ? '#c084fc' : '#7c3aed',
  };

  const title = label || t('ai.button');

  if (!iconOnly) {
    return (
      <Box
        component={motion.div}
        whileHover={disabled ? undefined : { scale: 1.03 }}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        sx={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: '1.5px', // Exact thickness for the neon outline
          borderRadius: '24px',
          overflow: 'hidden',
          verticalAlign: 'middle',
          boxShadow: disabled ? 'none' : ai.glowAura,
          transition: 'box-shadow 0.25s ease',
          opacity: disabled ? 0.5 : 1,
          '&:hover': {
            boxShadow: disabled ? 'none' : ai.glowHover,
          },
        }}
      >
        {/* GPU-Accelerated Spinning Border Gradient (confines neon strictly to 1.5px perimeter) */}
        {!disabled ? (
          <Box
            sx={{
              position: 'absolute',
              width: '280%',
              height: '280%',
              top: '-90%',
              left: '-90%',
              background: ai.borderGradient,
              willChange: 'transform',
              transform: 'translateZ(0)',
              animation: 'aiBorderRotate 4s linear infinite',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: theme.palette.action.disabledBackground,
              zIndex: 0,
            }}
          />
        )}

        {/* Solid Theme-Masked Inner Button (Gentle on the eyes, crisp typography) */}
        <Button
          size="small"
          onClick={onClick}
          disabled={disabled}
          startIcon={
            <AutoAwesomeIcon
              sx={{
                fontSize: '16px !important',
                color: disabled ? theme.palette.text.disabled : ai.iconColor,
                willChange: 'transform',
                transform: 'translateZ(0)',
                animation: disabled ? 'none' : 'aiGpuTwinkle 3s ease-in-out infinite',
              }}
            />
          }
          sx={{
            position: 'relative',
            zIndex: 1,
            borderRadius: '22.5px',
            px: 2,
            py: 0.55,
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: '0.015em',
            backgroundColor: ai.buttonBg,
            color: ai.text,
            boxShadow: 'none',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease, color 0.2s ease',
            '&:hover': {
              backgroundColor: ai.buttonBgHover,
              boxShadow: 'none',
            },
            '&:disabled': {
              backgroundColor: ai.buttonBg,
              color: `${theme.palette.text.disabled} !important`,
              boxShadow: 'none',
            },
          }}
        >
          {title}
        </Button>
      </Box>
    );
  }

  return (
    <Tooltip title={title} arrow placement="top">
      <Box
        component={motion.div}
        whileHover={disabled ? undefined : { scale: 1.12, rotate: 5 }}
        whileTap={disabled ? undefined : { scale: 0.92 }}
        sx={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          p: '1.5px', // Exact thickness for the neon outline
          borderRadius: '10px',
          overflow: 'hidden',
          verticalAlign: 'middle',
          boxShadow: disabled ? 'none' : ai.glowAura,
          transition: 'box-shadow 0.25s ease',
          opacity: disabled ? 0.45 : 1,
          '&:hover': {
            boxShadow: disabled ? 'none' : ai.glowHover,
          },
        }}
      >
        {/* GPU-Accelerated Spinning Border Gradient */}
        {!disabled ? (
          <Box
            sx={{
              position: 'absolute',
              width: '280%',
              height: '280%',
              top: '-90%',
              left: '-90%',
              background: ai.borderGradient,
              willChange: 'transform',
              transform: 'translateZ(0)',
              animation: 'aiBorderRotate 4s linear infinite',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: theme.palette.action.disabledBackground,
              zIndex: 0,
            }}
          />
        )}

        {/* Solid Theme-Masked Inner IconButton */}
        <IconButton
          size="small"
          onClick={onClick}
          disabled={disabled}
          sx={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            borderRadius: '8.5px',
            backgroundColor: ai.buttonBg,
            color: ai.iconColor,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: ai.buttonBgHover,
            },
            '&:disabled': {
              backgroundColor: ai.buttonBg,
              color: theme.palette.text.disabled,
            },
          }}
        >
          <AutoAwesomeIcon
            sx={{
              fontSize: '16px !important',
              color: disabled ? theme.palette.text.disabled : ai.iconColor,
              willChange: 'transform',
              transform: 'translateZ(0)',
              animation: disabled ? 'none' : 'aiGpuTwinkle 3s ease-in-out infinite',
            }}
          />
        </IconButton>
      </Box>
    </Tooltip>
  );
}
