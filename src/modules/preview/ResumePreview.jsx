import { useState, useRef, useEffect, forwardRef } from 'react';
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
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';

import { useResume, useLocale } from '../../hooks/index.js';
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
 * Computes exact vertical page offsets (in pixels) to paginate resume content
 * without orphan section headings or awkwardly split items.
 *
 * @param {HTMLElement} container - The unpaginated rendered template container
 * @param {number} printableH - Height in px of the printable page area (e.g., 265mm = ~1001.5px)
 * @returns {number[]} Array of content scroll offsets for each page (e.g. [0, 920, 1850])
 */
function calculateSmartPageOffsets(container, printableH) {
  if (!container || printableH <= 0) return [0];

  const totalHeight = container.scrollHeight || container.offsetHeight || 0;
  if (totalHeight <= printableH + 60) return [0];

  const containerRect = container.getBoundingClientRect();

  // Find candidate headings, sections, items, and list items
  const candidateElements = Array.from(
    container.querySelectorAll(
      '.resume-section, .resume-section-title, .resume-section-item, .resume-section-item li, li, h5, h6, [data-section]'
    )
  );

  const sectionNodes = [];
  candidateElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const relTop = Math.round(rect.top - containerRect.top);
    const relHeight = Math.round(rect.height);
    if (relTop >= 0 && relHeight > 0) {
      const isHeading =
        el.classList.contains('resume-section-title') || el.tagName === 'H6' || el.tagName === 'H5';
      const sectionEl = el.closest('.resume-section');
      const sectionTop = sectionEl
        ? Math.round(sectionEl.getBoundingClientRect().top - containerRect.top)
        : relTop;
      sectionNodes.push({
        element: el,
        top: relTop,
        sectionTop: sectionTop > 0 ? sectionTop : relTop,
        bottom: relTop + relHeight,
        height: relHeight,
        isHeading,
        isListItem: el.tagName === 'LI',
        isItem: el.classList.contains('resume-section-item'),
        isSection: el.classList.contains('resume-section'),
      });
    }
  });

  sectionNodes.sort((a, b) => a.top - b.top);

  const offsets = [0];
  let currentOffset = 0;

  while (currentOffset + printableH < totalHeight && offsets.length < 10) {
    const theoreticalEnd = currentOffset + printableH;
    let chosenBreak = theoreticalEnd;

    // 1. Check for orphan heading near the page bottom (starts within 130px)
    const orphanHeading = sectionNodes.find(
      (n) =>
        n.isHeading &&
        n.top > currentOffset + 120 &&
        n.top > theoreticalEnd - 130 &&
        n.top < theoreticalEnd
    );

    if (orphanHeading) {
      // Break right before the enclosing section so heading and section stay together
      chosenBreak = orphanHeading.sectionTop;
    } else {
      // 2. Find any item or element that crosses theoreticalEnd (straddles page break)
      const crossingItems = sectionNodes.filter(
        (n) =>
          n.top > currentOffset + 100 &&
          n.top < theoreticalEnd &&
          n.bottom > theoreticalEnd
      );

      if (crossingItems.length > 0) {
        // Break cleanly before the crossing item/bullet so text is never sliced
        const itemNode = crossingItems.find((n) => n.isItem) || crossingItems[0];
        chosenBreak = itemNode.top;
      } else {
        // 3. Check for any section container starting near the bottom that overflows
        const orphanSection = sectionNodes.find(
          (n) =>
            n.isSection &&
            n.top > currentOffset + 120 &&
            n.top > theoreticalEnd - 80 &&
            n.bottom > theoreticalEnd &&
            n.top < theoreticalEnd
        );

        if (orphanSection) {
          chosenBreak = orphanSection.top;
        }
      }
    }

    // Safety guard: ensure substantial forward progress (at least 200px)
    if (chosenBreak <= currentOffset + 200) {
      chosenBreak = theoreticalEnd;
    }

    offsets.push(chosenBreak);
    currentOffset = chosenBreak;
  }

  return offsets;
}

/**
 * @file ResumePreview.jsx
 * @description Real-time CV preview pane with smart A4 page splitting (210mm x 297mm per sheet),
 * orphan heading prevention, zoom scaling controls, template switcher, and color picker.
 * Features discrete physical page view, page numbers, and high-contrast dark mode visibility.
 */
export const ResumePreview = forwardRef(function ResumePreview(_props, ref) {
  const { resumeData, setTemplateId, setThemeColor } = useResume();
  const { t } = useLocale();
  const theme = useTheme();
  const [zoom, setZoom] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 640 ? 0.45 : 0.85
  );
  const [pageOffsets, setPageOffsets] = useState([0]);
  const measureRef = useRef(null);
  const a4PrintableRef = useRef(null);

  const pageCount = pageOffsets.length;
  const iconColor = theme.palette.text.secondary;

  const templateList = getTemplateList(t);
  const activeTemplateId = resumeData?.templateId || 'modern';
  const activeThemeColor = resumeData?.themeColor || '#1e293b';

  const TemplateComponent = getTemplateComponent(activeTemplateId);
  const isSidebarTemplate = activeTemplateId === 'sidebar';

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 1.25));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.35));
  const handleResetZoom = () => setZoom(window.innerWidth < 640 ? 0.45 : 0.85);

  useEffect(() => {
    const updatePagination = () => {
      if (!measureRef.current) return;
      // Printable height per page: 265mm for padded templates (297mm - 32mm), or 297mm for full-bleed sidebar
      const defaultH = isSidebarTemplate ? (297 * 96) / 25.4 : (265 * 96) / 25.4;
      const printableH = a4PrintableRef.current?.offsetHeight || defaultH;
      if (printableH <= 0) return;

      const offsets = calculateSmartPageOffsets(measureRef.current, printableH);
      setPageOffsets(offsets);
    };

    updatePagination();

    const resizeObserver = new ResizeObserver(() => {
      updatePagination();
    });

    if (measureRef.current) {
      resizeObserver.observe(measureRef.current);
    }

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(updatePagination);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [resumeData, activeTemplateId, activeThemeColor, isSidebarTemplate]);

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

        {/* Zoom Controls & Page Count Indicator */}
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
          <Chip
            size="small"
            label={
              pageCount === 1
                ? `1 ${t('preview.page')} (A4)`
                : `${pageCount} ${t('preview.pages')} (A4)`
            }
            sx={{
              height: 24,
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: (tTheme) => alpha(tTheme.palette.primary.main, 0.08),
              color: 'primary.main',
              mr: 0.5,
            }}
          />
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
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: { xs: 1, sm: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 0,
        }}
      >
        {/* Scaled Wrapper matching exact visual width for perfect centering */}
        <Box
          sx={{
            width: `calc(210mm * ${zoom})`,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            mb: 4,
          }}
        >
          {/* Transform container scaled from top-left */}
          <Box
            sx={{
              width: '210mm',
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              transition: 'transform 0.2s ease-out',
            }}
          >
            {/* A4 Multi-Page Container for Display & PDF Export */}
            <Box
              ref={ref}
              id="resume-preview-document"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '210mm',
                position: 'relative',
              }}
            >
              {pageOffsets.map((offset, pageIndex) => (
                <Box
                  key={pageIndex}
                  className="resume-page-wrapper"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '210mm',
                    mb: pageIndex < pageCount - 1 ? 3 : 0,
                  }}
                >
                  {/* Page Indicator Header (UI only - excluded from PDF export) */}
                  <Stack
                    direction="row"
                    data-html2canvas-ignore="true"
                    className="html2pdf__ignore"
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '210mm',
                      mb: 1.2,
                      px: 0.5,
                      userSelect: 'none',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: 'text.secondary',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                      }}
                    >
                      {t('preview.page')} {pageIndex + 1} / {pageCount}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.disabled',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                      }}
                    >
                      A4 (210 × 297 mm)
                    </Typography>
                  </Stack>

                  {/* A4 Sheet Paper with Optional 16mm Page Padding */}
                  <Paper
                    elevation={4}
                    className="resume-page-sheet"
                    sx={{
                      width: '210mm',
                      height: '297mm',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      borderRadius: 1,
                      boxShadow: (tTheme) =>
                        `0 10px 30px ${alpha(tTheme.palette.common.black, tTheme.palette.mode === 'dark' ? 0.6 : 0.15)}`,
                      p: isSidebarTemplate ? 0 : '16mm',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Full-bleed sidebar background column for sidebar template to maintain continuous full-height appearance */}
                    {isSidebarTemplate && (
                      <Box
                        aria-hidden="true"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '72mm',
                          height: '100%',
                          backgroundColor: '#f8fafc',
                          borderRight: '1px solid #e2e8f0',
                          pointerEvents: 'none',
                          zIndex: 0,
                        }}
                      />
                    )}

                    {/* Inner content viewport */}
                    <Box
                      sx={{
                        width: '100%',
                        height:
                          pageIndex < pageOffsets.length - 1
                            ? `${pageOffsets[pageIndex + 1] - offset}px`
                            : '100%',
                        maxHeight: '100%',
                        position: 'relative',
                        zIndex: 1,
                        overflow: 'hidden',
                      }}
                    >
                      {/* Shifted content for this page using smart offset */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: `-${offset}px`,
                          left: 0,
                          width: '100%',
                          '& > .MuiBox-root': {
                            p: 0,
                            minHeight: 'auto',
                          },
                        }}
                      >
                        <TemplateComponent data={resumeData} themeColor={activeThemeColor} />
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Hidden container to measure unpaginated content height wrapped at printable width */}
      <Box
        ref={measureRef}
        aria-hidden="true"
        data-html2canvas-ignore="true"
        className="html2pdf__ignore"
        sx={{
          position: 'fixed',
          top: 0,
          left: -99999,
          width: isSidebarTemplate ? '210mm' : '178mm',
          visibility: 'hidden',
          pointerEvents: 'none',
          zIndex: -1000,
          '& > .MuiBox-root': {
            p: 0,
            minHeight: 'auto',
          },
        }}
      >
        <TemplateComponent data={resumeData} themeColor={activeThemeColor} />
      </Box>

      {/* Hidden reference box to measure printable height in exact device pixels */}
      <Box
        ref={a4PrintableRef}
        aria-hidden="true"
        data-html2canvas-ignore="true"
        className="html2pdf__ignore"
        sx={{
          position: 'fixed',
          top: 0,
          left: -99999,
          width: isSidebarTemplate ? '210mm' : '178mm',
          height: isSidebarTemplate ? '297mm' : '265mm',
          visibility: 'hidden',
          pointerEvents: 'none',
          zIndex: -1000,
        }}
      />
    </Stack>
  );
});
