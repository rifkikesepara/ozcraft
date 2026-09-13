import { useState } from 'react';
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
import EditNoteIcon from '@mui/icons-material/EditNote';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';

import { useThemeMode, useLocale } from '../../hooks/index.js';
import { ImportJsonModal } from '../common/ImportJsonModal.jsx';
import { MobileNavDrawer } from './MobileNavDrawer.jsx';

/**
 * @file Navbar.jsx
 * @description Global application header navbar with responsive mobile navigation drawer,
 * theme controls, language switcher, and JSON import modal trigger.
 */
export function Navbar() {
  const [langMenuAnchor, setLangMenuAnchor] = useState(null);
  const [paletteMenuAnchor, setPaletteMenuAnchor] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const { mode, toggleMode, activePaletteId, setPaletteId, palettes } = useThemeMode();
  const { locale, setLocale, t, availableLocales } = useLocale();

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
          zIndex: (theme) => theme.zIndex.appBar,
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

            {/* Feedback Button (GitHub Issues) */}
            <Tooltip title={t('footer.feedback')} arrow>
              <IconButton
                component="a"
                href="https://github.com/rifkikesepara/resume-builder/issues"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                <FeedbackOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

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
      <MobileNavDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenImport={() => setIsImportOpen(true)}
        navItems={navItems}
      />

      {/* Import JSON Modal */}
      <ImportJsonModal open={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </>
  );
}
