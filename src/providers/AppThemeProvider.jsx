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
          main: isDark ? '#ffffff' : '#000000',
          light: isDark ? '#cccccc' : '#333333',
        },
        secondary: {
          main: isDark ? '#aaaaaa' : '#555555',
        },
        background: {
          default: isDark ? '#050505' : '#ffffff',
          paper: isDark ? '#000000' : '#fcfcfc',
        },
        text: {
          primary: isDark ? '#ffffff' : '#000000',
          secondary: isDark ? '#888888' : '#666666',
        },
        action: {
          active: isDark ? '#ffffff' : '#000000',
          hover: isDark ? alpha(commonWhite, 0.1) : alpha(commonBlack, 0.05),
          selected: isDark ? alpha(commonWhite, 0.2) : alpha(commonBlack, 0.1),
          disabled: isDark ? alpha(commonWhite, 0.3) : alpha(commonBlack, 0.26),
        },
        divider: isDark ? '#333333' : '#e0e0e0',
        ai: {
          borderGradient: 'none',
          glowAura: 'none',
          glowHover: 'none',
          buttonBg: isDark ? '#000000' : '#ffffff',
          buttonBgHover: isDark ? '#111111' : '#f0f0f0',
          text: isDark ? '#ffffff' : '#000000',
          iconColor: isDark ? '#ffffff' : '#000000',
          outlineBorder: isDark ? '#555555' : '#aaaaaa',
          outlineBorderHover: isDark ? '#ffffff' : '#000000',
          outlineBgHover: isDark ? alpha(commonWhite, 0.1) : alpha(commonBlack, 0.05),
          outlineGlowHover: 'none',
        },
      },
      shape: {
        borderRadius: 0,
      },
      typography: {
        fontFamily: ['"Inter"', '-apple-system', 'sans-serif'].join(','),
        h1: { fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, textWrap: 'balance' },
        h2: { fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.2, textWrap: 'balance' },
        h3: { fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.3 },
        h4: { fontWeight: 600, letterSpacing: '-0.01em' },
        h5: { fontWeight: 500 },
        h6: { fontWeight: 500 },
        button: { textTransform: 'none', fontWeight: 500, letterSpacing: '0.02em' },
        body1: { lineHeight: 1.6 },
        body2: { lineHeight: 1.6 },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              fontVariantNumeric: 'tabular-nums',
            }
          }
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              color: isDark ? '#ffffff' : '#000000',
              transition: 'background-color 0.1s ease',
              '&:hover': {
                backgroundColor: isDark ? alpha(commonWhite, 0.1) : alpha(commonBlack, 0.05),
              },
            },
          },
        },
        MuiSvgIcon: {
          styleOverrides: {
            root: {
              transition: 'none',
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              color: isDark ? '#888888' : '#666666',
              textTransform: 'none',
              fontWeight: 500,
              '&.Mui-selected': {
                color: isDark ? '#ffffff' : '#000000',
              },
            },
          },
        },
        MuiAccordion: {
          styleOverrides: {
            root: {
              border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
              boxShadow: 'none',
              '&:before': { display: 'none' },
              '&.Mui-expanded': { margin: 0 },
            }
          }
        },
        MuiAccordionSummary: {
          styleOverrides: {
            root: {
              borderBottom: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
            },
            expandIconWrapper: {
              color: isDark ? '#ffffff' : '#000000',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              padding: '10px 20px',
              transition: 'background-color 0.1s ease, color 0.1s ease',
              boxShadow: 'none',
              border: `1px solid ${isDark ? '#333' : '#ddd'}`,
              '&:hover': {
                boxShadow: 'none',
                backgroundColor: isDark ? '#ffffff' : '#000000',
                color: isDark ? '#000000' : '#ffffff',
              },
              '&.Mui-focusVisible': {
                outline: `2px solid ${isDark ? '#ffffff' : '#000000'}`,
                outlineOffset: 2,
              }
            },
            containedPrimary: {
              border: 'none',
              color: isDark ? '#000000' : '#ffffff',
              background: isDark ? '#ffffff' : '#000000',
              '&:hover': {
                background: isDark ? '#cccccc' : '#333333',
              }
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              borderRadius: 0,
              boxShadow: 'none',
              border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
              boxShadow: 'none',
            },
          },
        },
        MuiTextField: {
          defaultProps: {
            variant: 'outlined',
            size: 'small',
          },
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                '&.Mui-focused fieldset': {
                  borderColor: isDark ? '#ffffff' : '#000000',
                  borderWidth: '1px',
                }
              }
            }
          }
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
