import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Stack,
  Menu,
  MenuItem,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  alpha,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import TranslateIcon from '@mui/icons-material/Translate';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CheckIcon from '@mui/icons-material/Check';

import { useThemeMode } from '../../hooks/useThemeMode.js';
import { useLocale } from '../../hooks/useLocale.js';
import { ImportJsonModal } from '../common/ImportJsonModal.jsx';

/**
 * @file Navbar.jsx
 * @description Global application header navbar with responsive mobile navigation drawer,
 * theme controls, language switcher, and JSON import modal trigger.
 */
export function Navbar() {
  const navigate = useNavigate();
  const { mode, toggleMode, activePaletteId, setPaletteId, palettes } = useThemeMode();
  const { locale, setLocale, t, availableLocales } = useLocale();

  const [langMenuAnchor, setLangMenuAnchor] = useState(null);
  const [paletteMenuAnchor, setPaletteMenuAnchor] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isDark = mode === 'dark';

  const navItems = [
    { label: t('nav.builder'), path: '/editor', icon: <EditNoteIcon /> },
    { label: t('nav.templates'), path: '/templates', icon: <DashboardCustomizeOutlinedIcon /> },
    { label: t('nav.settings'), path: '/settings', icon: <SettingsOutlinedIcon /> },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: (theme) =>
            alpha(isDark ? theme.palette.background.paper : theme.palette.common.white, 0.92),
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            justifyContent: 'space-between',
            px: { xs: 1.5, sm: 2, md: 3 },
            width: '100%',
          }}
        >
          {/* Logo */}
          <Stack
            direction="row"
            onClick={() => navigate('/')}
            sx={{
              alignItems: 'center',
              gap: 1.25,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <Stack
              direction="row"
              sx={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'common.white',
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 18, color: 'common.white' }} />
            </Stack>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                background: isDark
                  ? 'linear-gradient(135deg, #ffffff, #cbd5e1)'
                  : 'linear-gradient(135deg, #0f172a, #334155)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              OzCraft
            </Typography>
          </Stack>

          {/* Desktop Navigation Links */}
          <Stack
            direction="row"
            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  px: 1.75,
                  py: 0.75,
                  borderRadius: 2,
                  '&.active': {
                    color: 'primary.main',
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, isDark ? 0.18 : 0.08),
                  },
                  '&:hover': {
                    backgroundColor: (theme) =>
                      isDark ? alpha(theme.palette.common.white, 0.06) : 'action.hover',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* Right Action Tools */}
          <Stack direction="row" sx={{ alignItems: 'center', gap: { xs: 0.75, sm: 1.25 } }}>
            {/* Import JSON Button (Desktop only) */}
            <Tooltip title={t('nav.importJson')} arrow>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsImportOpen(true)}
                startIcon={
                  <FileUploadOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                }
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  borderRadius: 2,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  borderColor: (theme) => alpha(theme.palette.divider, 0.8),
                }}
              >
                {t('nav.importJson')}
              </Button>
            </Tooltip>

            {/* Color Palette Menu (Desktop) */}
            <Tooltip title={t('settings.accentColor')} arrow>
              <IconButton
                size="small"
                onClick={(e) => setPaletteMenuAnchor(e.currentTarget)}
                sx={{ display: { xs: 'none', sm: 'inline-flex' }, color: 'text.secondary' }}
              >
                <PaletteOutlinedIcon fontSize="small" sx={{ color: 'inherit' }} />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={paletteMenuAnchor}
              open={Boolean(paletteMenuAnchor)}
              onClose={() => setPaletteMenuAnchor(null)}
              PaperProps={{ sx: { borderRadius: 2, p: 1, minWidth: 160 } }}
            >
              {palettes.map((p) => (
                <MenuItem
                  key={p.id}
                  selected={activePaletteId === p.id}
                  onClick={() => {
                    setPaletteId(p.id);
                    setPaletteMenuAnchor(null);
                  }}
                  sx={{ gap: 1.5, borderRadius: 1 }}
                >
                  <Box
                    sx={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: p.primary }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {p.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>

            {/* Language Switcher (Desktop) */}
            <Tooltip title={t('nav.language')} arrow>
              <IconButton
                size="small"
                onClick={(e) => setLangMenuAnchor(e.currentTarget)}
                sx={{ display: { xs: 'none', sm: 'inline-flex' }, color: 'text.secondary' }}
              >
                <TranslateIcon fontSize="small" sx={{ color: 'inherit' }} />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={langMenuAnchor}
              open={Boolean(langMenuAnchor)}
              onClose={() => setLangMenuAnchor(null)}
              PaperProps={{ sx: { borderRadius: 2, p: 0.5 } }}
            >
              {availableLocales.map((loc) => (
                <MenuItem
                  key={loc.code}
                  selected={locale === loc.code}
                  onClick={() => {
                    setLocale(loc.code);
                    setLangMenuAnchor(null);
                  }}
                  sx={{ gap: 1.5, borderRadius: 1 }}
                >
                  <span>{loc.flag}</span>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {loc.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>

            {/* Dark/Light Toggle */}
            <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} arrow>
              <IconButton
                size="small"
                onClick={toggleMode}
                sx={{ color: isDark ? 'warning.light' : 'text.secondary' }}
              >
                {isDark ? (
                  <Brightness7Icon fontSize="small" sx={{ color: 'warning.light' }} />
                ) : (
                  <Brightness4Icon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>

            {/* Mobile Menu Hamburger Button */}
            <IconButton
              size="small"
              onClick={() => setIsDrawerOpen(true)}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                color: 'text.primary',
                backgroundColor: (theme) =>
                  isDark
                    ? alpha(theme.palette.common.white, 0.08)
                    : alpha(theme.palette.common.black, 0.05),
                borderRadius: 2,
                p: 0.75,
                ml: 0.5,
                '&:hover': {
                  backgroundColor: (theme) =>
                    isDark
                      ? alpha(theme.palette.common.white, 0.16)
                      : alpha(theme.palette.common.black, 0.09),
                },
              }}
              aria-label="open mobile navigation drawer"
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
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
              setIsDrawerOpen(false);
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
            onClick={() => setIsDrawerOpen(false)}
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
                onClick={() => setIsDrawerOpen(false)}
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
              setIsDrawerOpen(false);
              setIsImportOpen(true);
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
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            OzCraft AI Resume Builder
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            v1.0.0
          </Typography>
        </Stack>
      </Drawer>

      {/* Import JSON Modal */}
      <ImportJsonModal open={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </>
  );
}
