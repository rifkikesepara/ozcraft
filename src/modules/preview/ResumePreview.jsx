import React, { useState, forwardRef } from 'react';
import {
  Box,
  Stack,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  alpha,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';

import { useResume } from '../../hooks/useResume.js';
import { useLocale } from '../../hooks/useLocale.js';
import { getTemplateComponent, getTemplateList } from '../templates/templateRegistry.js';

const ACCENT_COLORS = [
  { label: 'Slate', color: '#1e293b' },
  { label: 'Indigo', color: '#4338ca' },
  { label: 'Emerald', color: '#047857' },
  { label: 'Rose', color: '#be123c' },
  { label: 'Amber', color: '#b45309' },
  { label: 'Charcoal', color: '#18181b' },
];

/**
 * @file ResumePreview.jsx
 * @description Real-time CV preview pane with centered A4 aspect ratio rendering,
 * zoom scaling controls, template switcher, and color picker.
 * Features high-contrast dark mode icon visibility.
 */
export const ResumePreview = forwardRef(function ResumePreview(_props, ref) {
  const { resumeData, setTemplateId, setThemeColor } = useResume();
  const { t } = useLocale();
  const theme = useTheme();
  const [zoom, setZoom] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 640 ? 0.45 : 0.85
  );

  const iconColor = theme.palette.text.secondary;

  const templateList = getTemplateList(t);
  const activeTemplateId = resumeData?.templateId || 'modern';
  const activeThemeColor = resumeData?.themeColor || '#1e293b';

  const TemplateComponent = getTemplateComponent(activeTemplateId);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 1.25));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.35));
  const handleResetZoom = () => setZoom(window.innerWidth < 640 ? 0.45 : 0.85);

  return (
    <Stack
      sx={{
        height: '100%',
        backgroundColor: (tTheme) =>
          tTheme.palette.mode === 'dark'
            ? tTheme.palette.background.default
            : alpha(tTheme.palette.divider, 0.3),
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Top Controls Toolbar */}
      <Stack
        direction="row"
        sx={{
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.25,
          p: 1.25,
          px: { xs: 1.5, sm: 2.5 },
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Template Selector */}
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}
          >
            {t('preview.template')}
          </Typography>
          <FormControl size="small">
            <Select
              value={activeTemplateId}
              onChange={(e) => setTemplateId(e.target.value)}
              sx={{
                height: 32,
                fontSize: '0.85rem',
                fontWeight: 600,
                minWidth: { xs: 130, sm: 160 },
              }}
            >
              {templateList.map((tpl) => (
                <MenuItem key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Color Palette Selector */}
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          <PaletteOutlinedIcon sx={{ fontSize: 18, color: iconColor }} />
          <Stack direction="row" sx={{ gap: 0.75 }}>
            {ACCENT_COLORS.map((item) => (
              <Box
                key={item.color}
                onClick={() => setThemeColor(item.color)}
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: activeThemeColor === item.color ? 'primary.main' : 'transparent',
                  transition: 'transform 0.15s ease',
                  '&:hover': { transform: 'scale(1.2)' },
                }}
                title={item.label}
              />
            ))}
          </Stack>
        </Stack>

        {/* Zoom Controls */}
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={t('preview.zoomOut')} arrow>
            <IconButton size="small" onClick={handleZoomOut} sx={{ color: iconColor }}>
              <ZoomOutIcon fontSize="small" sx={{ color: 'inherit' }} />
            </IconButton>
          </Tooltip>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, width: 38, textAlign: 'center', color: 'text.primary' }}
          >
            {Math.round(zoom * 100)}%
          </Typography>
          <Tooltip title={t('preview.zoomIn')} arrow>
            <IconButton size="small" onClick={handleZoomIn} sx={{ color: iconColor }}>
              <ZoomInIcon fontSize="small" sx={{ color: 'inherit' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('preview.resetZoom')} arrow>
            <IconButton size="small" onClick={handleResetZoom} sx={{ color: iconColor }}>
              <RestartAltIcon fontSize="small" sx={{ color: 'inherit' }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Centered Resume Canvas Area */}
      <Stack
        direction="row"
        sx={{
          flex: 1,
          overflow: 'auto',
          p: { xs: 1, sm: 2, md: 3 },
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: 'center',
            width: '100%',
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
            mb: 4,
          }}
        >
          {/* A4 Standard Paper Container (210mm x 297mm) */}
          <Paper
            ref={ref}
            id="resume-preview-document"
            elevation={4}
            sx={{
              width: '210mm',
              minHeight: '297mm',
              backgroundColor: (tTheme) => tTheme.palette.common.white,
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: (tTheme) =>
                `0 10px 30px ${alpha(tTheme.palette.common.black, tTheme.palette.mode === 'dark' ? 0.6 : 0.15)}`,
              mx: 'auto',
            }}
          >
            <TemplateComponent data={resumeData} themeColor={activeThemeColor} />
          </Paper>
        </Stack>
      </Stack>
    </Stack>
  );
});
