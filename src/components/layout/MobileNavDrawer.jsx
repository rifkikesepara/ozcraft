import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Drawer,
  Stack,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Switch,
  alpha,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CheckIcon from '@mui/icons-material/Check';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';

import { useThemeMode, useLocale } from '../../hooks/index.js';

/**
 * @file MobileNavDrawer.jsx
 * @description Mobile slide-out navigation drawer with route links, language switcher,
 * theme controls, palette picker, and JSON import launcher.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {() => void} props.onOpenImport
 * @param {Array<{ label: string, path: string, icon: React.ReactNode }>} props.navItems
 */
export function MobileNavDrawer({ open, onClose, onOpenImport, navItems }) {
  const navigate = useNavigate();
  const { mode, toggleMode, activePaletteId, setPaletteId, palettes } = useThemeMode();
  const { locale, setLocale, t, availableLocales } = useLocale();

  const isDark = mode === 'dark';

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
      }}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '82vw', sm: 320 },
            maxWidth: 340,
            backgroundColor: 'background.paper',
            backgroundImage: 'none',
            display: 'flex',
            flexDirection: 'column',
            p: 2.5,
            gap: 2,
          },
        },
      }}
    >
      {/* Drawer Header */}
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack
          direction="row"
          onClick={() => {
            navigate('/');
            onClose();
          }}
          sx={{ alignItems: 'center', gap: 1.25, cursor: 'pointer' }}
        >
          <Stack
            direction="row"
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'common.white',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 16, color: 'common.white' }} />
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.15rem' }}>
            OzCraft
          </Typography>
        </Stack>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: 'text.secondary' }}
          aria-label="close drawer"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Divider />

      {/* Navigation List */}
      <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={onClose}
              sx={{
                borderRadius: 2,
                py: 1.2,
                px: 1.5,
                gap: 1.5,
                color: 'text.primary',
                '&.active': {
                  color: 'primary.main',
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, isDark ? 0.16 : 0.08),
                  fontWeight: 700,
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 28, color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: '0.94rem', fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Quick Actions */}
      <Stack sx={{ gap: 1.5 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            onClose();
            onOpenImport();
          }}
          startIcon={<FileUploadOutlinedIcon />}
          sx={{
            borderRadius: 2,
            py: 1,
            fontWeight: 600,
            fontSize: '0.85rem',
            justifyContent: 'flex-start',
            px: 2,
          }}
        >
          {t('nav.importJson')}
        </Button>
      </Stack>

      <Divider />

      {/* Preferences: Language, Theme Mode, Accent Color */}
      <Stack sx={{ gap: 2.25 }}>
        {/* Language Switcher */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
              display: 'block',
              mb: 1,
            }}
          >
            {t('nav.language')}
          </Typography>
          <Stack direction="row" sx={{ gap: 1 }}>
            {availableLocales.map((loc) => {
              const isSelected = locale === loc.code;
              return (
                <Button
                  key={loc.code}
                  size="small"
                  variant={isSelected ? 'contained' : 'outlined'}
                  onClick={() => setLocale(loc.code)}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    py: 0.75,
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    gap: 0.75,
                  }}
                >
                  <span>{loc.flag}</span>
                  {loc.label}
                </Button>
              );
            })}
          </Stack>
        </Box>

        {/* Dark / Light Toggle */}
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            {isDark ? (
              <Brightness7Icon fontSize="small" sx={{ color: 'warning.light' }} />
            ) : (
              <Brightness4Icon fontSize="small" sx={{ color: 'text.secondary' }} />
            )}
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {isDark ? t('settings.darkMode') : locale === 'tr' ? 'Açık Tema' : 'Light Mode'}
            </Typography>
          </Stack>
          <Switch checked={isDark} onChange={toggleMode} size="small" color="primary" />
        </Stack>

        {/* Accent Color Palette Selector */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
              display: 'block',
              mb: 1,
            }}
          >
            {t('settings.accentColor')}
          </Typography>
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            {palettes.map((p) => {
              const isSelected = activePaletteId === p.id;
              return (
                <Stack
                  direction="row"
                  key={p.id}
                  onClick={() => setPaletteId(p.id)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: p.primary,
                    cursor: 'pointer',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                    boxShadow: (theme) =>
                      isSelected ? `0 0 8px ${alpha(theme.palette.primary.main, 0.5)}` : 'none',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.15)' },
                  }}
                  title={p.name}
                >
                  {isSelected && <CheckIcon sx={{ fontSize: 16, color: 'common.white' }} />}
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </Stack>

      {/* Drawer Footer */}
      <Stack
        direction="row"
        sx={{
          mt: 'auto',
          pt: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button
          component="a"
          href="https://github.com/rifkikesepara/resume-builder/issues"
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          startIcon={<FeedbackOutlinedIcon sx={{ fontSize: '1rem !important' }} />}
          sx={{
            textTransform: 'none',
            fontSize: '0.78rem',
            color: 'text.secondary',
            px: 1,
            py: 0.25,
            fontWeight: 600,
            '&:hover': { color: 'primary.main' },
          }}
        >
          {t('footer.feedback')}
        </Button>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          v1.0.0
        </Typography>
      </Stack>
    </Drawer>
  );
}
