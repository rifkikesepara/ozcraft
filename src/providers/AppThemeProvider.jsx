import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
  alpha,
  useMediaQuery,
} from '@mui/material';
import {
  COLOR_PALETTES,
  THEME_MODE,
  MODE_LIGHT,
  MODE_DARK,
  THEME_MODE_STORAGE_KEY,
  LEGACY_THEME_MODE_STORAGE_KEY,
  THEME_PALETTE_STORAGE_KEY,
  LEGACY_THEME_PALETTE_STORAGE_KEY,
} from '../utils/constants.js';

/**
 * @file AppThemeProvider.jsx
 * @description Application theme context and Material UI ThemeProvider.
 * Provides dynamic accent color schemes, light/dark mode switching, high-contrast icon visibility in dark mode,
 * and minimalist design tokens.
 */

export { COLOR_PALETTES, THEME_MODE, MODE_LIGHT, MODE_DARK };

const ThemeCustomizerContext = createContext(null);

/**
 * Custom hook to access and control the application theme state.
 * @returns {{
 *   mode: 'light' | 'dark',
 *   toggleMode: () => void,
 *   activePaletteId: string,
 *   setPaletteId: (id: string) => void,
 *   currentPalette: { id: string, name: string, primary: string, secondary: string },
 *   palettes: typeof COLOR_PALETTES
 * isMobile: boolean
 * }}
 */
export function useThemeMode() {
  const context = useContext(ThemeCustomizerContext);
  if (!context) {
    throw new Error('useThemeMode must be used within an AppThemeProvider');
  }
  return context;
}

/**
 * AppThemeProvider component managing light/dark mode and dynamic primary colors.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function AppThemeProvider({ children }) {
  // All state placed at the beginning of the component
  const [mode, setMode] = useState(() => {
    try {
      const saved =
        localStorage.getItem(THEME_MODE_STORAGE_KEY) ||
        localStorage.getItem(LEGACY_THEME_MODE_STORAGE_KEY);
      if (saved === THEME_MODE.DARK || saved === THEME_MODE.LIGHT) return saved;
    } catch {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEME_MODE.DARK
      : THEME_MODE.LIGHT;
  });

  const [activePaletteId, setActivePaletteId] = useState(() => {
    try {
      const saved =
        localStorage.getItem(THEME_PALETTE_STORAGE_KEY) ||
        localStorage.getItem(LEGACY_THEME_PALETTE_STORAGE_KEY);
      if (saved && COLOR_PALETTES.some((p) => p.id === saved)) return saved;
    } catch {}
    return 'slate';
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
      localStorage.setItem(THEME_PALETTE_STORAGE_KEY, activePaletteId);
    } catch {}
  }, [mode, activePaletteId]);

  const currentPalette = useMemo(() => {
    return COLOR_PALETTES.find((p) => p.id === activePaletteId) || COLOR_PALETTES[0];
  }, [activePaletteId]);

  const toggleMode = () => {
    setMode((prev) => (prev === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT));
  };

  const theme = useMemo(() => {
    const isDark = mode === THEME_MODE.DARK;
    const commonWhite = '#ffffff';
    const commonBlack = '#000000';

    return createTheme({
      palette: {
        mode,
        common: {
          white: commonWhite,
          black: commonBlack,
        },
        primary: {
          main: isDark
            ? currentPalette.id === 'slate'
              ? '#6366f1'
              : currentPalette.secondary
            : currentPalette.primary,
          light: currentPalette.secondary,
        },
        secondary: {
          main: currentPalette.secondary,
        },
        background: {
          default: isDark ? '#090d16' : '#f8fafc',
          paper: isDark ? '#111827' : commonWhite,
        },
        text: {
          primary: isDark ? '#f8fafc' : '#0f172a',
          secondary: isDark ? '#94a3b8' : '#64748b',
        },
        action: {
          active: isDark ? '#f1f5f9' : '#475569',
          hover: isDark ? alpha(commonWhite, 0.08) : alpha(commonBlack, 0.04),
          selected: isDark ? alpha(commonWhite, 0.16) : alpha(commonBlack, 0.08),
          disabled: isDark ? alpha(commonWhite, 0.3) : alpha(commonBlack, 0.26),
        },
        divider: isDark ? alpha(commonWhite, 0.08) : alpha(commonBlack, 0.06),
        ai: {
          borderGradient: isDark
            ? 'conic-gradient(from 0deg, #818cf8, #c084fc, #f472b6, #22d3ee, #818cf8)'
            : 'conic-gradient(from 0deg, #4f46e5, #9333ea, #db2777, #0891b2, #4f46e5)',
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
          outlineBorder: isDark ? alpha('#a855f7', 0.4) : alpha('#8b5cf6', 0.35),
          outlineBorderHover: '#a855f7',
          outlineBgHover: isDark ? alpha('#a855f7', 0.1) : alpha('#a855f7', 0.05),
          outlineGlowHover: `0 0 10px ${alpha('#a855f7', 0.25)}`,
        },
      },
      shape: {
        borderRadius: 6,
      },
      typography: {
        fontFamily: ['"Plus Jakarta Sans"', '"Inter"', '-apple-system', 'sans-serif'].join(','),
        h1: { fontWeight: 800, letterSpacing: '-0.025em' },
        h2: { fontWeight: 700, letterSpacing: '-0.02em' },
        h3: { fontWeight: 700, letterSpacing: '-0.015em' },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
      },
      components: {
        MuiIconButton: {
          styleOverrides: {
            root: {
              color: isDark ? '#e2e8f0' : '#475569',
              transition: 'color 0.2s ease, background-color 0.2s ease',
              '&:hover': {
                backgroundColor: isDark ? alpha(commonWhite, 0.1) : alpha(commonBlack, 0.04),
                color: isDark ? commonWhite : '#0f172a',
              },
            },
          },
        },
        MuiSvgIcon: {
          styleOverrides: {
            root: {
              transition: 'color 0.2s ease',
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              color: isDark ? '#94a3b8' : '#64748b',
              '&.Mui-selected': {
                color: isDark ? '#a5b4fc' : currentPalette.primary,
              },
              '& .MuiSvgIcon-root': {
                color: 'inherit',
              },
            },
          },
        },
        MuiAccordionSummary: {
          styleOverrides: {
            expandIconWrapper: {
              color: isDark ? '#e2e8f0' : '#475569',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              padding: '8px 18px',
              transition: 'all 0.2s ease-in-out',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: `0 4px 12px ${alpha(commonBlack, 0.08)}`,
                transform: 'translateY(-1px)',
              },
            },
            containedPrimary: {
              color: commonWhite,
              background: isDark
                ? `linear-gradient(135deg, ${currentPalette.primary}, ${currentPalette.secondary})`
                : currentPalette.primary,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              transition: 'background-color 0.3s ease, border-color 0.3s ease',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 14,
              border: isDark
                ? `1px solid ${alpha(commonWhite, 0.08)}`
                : `1px solid ${alpha(commonBlack, 0.06)}`,
              boxShadow: isDark
                ? `0 4px 20px ${alpha(commonBlack, 0.3)}`
                : `0 4px 20px ${alpha(commonBlack, 0.03)}`,
            },
          },
        },
        MuiTextField: {
          defaultProps: {
            variant: 'outlined',
            size: 'small',
          },
        },
      },
    });
  }, [mode, currentPalette]);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const contextValue = useMemo(
    () => ({
      mode,
      toggleMode,
      activePaletteId,
      setPaletteId: setActivePaletteId,
      currentPalette,
      palettes: COLOR_PALETTES,
      isMobile,
    }),
    [mode, activePaletteId, currentPalette, isMobile]
  );

  return (
    <ThemeCustomizerContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeCustomizerContext.Provider>
  );
}
