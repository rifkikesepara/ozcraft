import { useRef, useState } from 'react';
import {
  Box,
  Stack,
  Container,
  Button,
  ButtonGroup,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { useSnackbar } from 'notistack';
import { useResume, useLocale, useExport } from '../hooks/index.js';
import { EXPORT_TYPE } from '../utils/constants.js';
import {
  PageTransition,
  ConfirmDialog,
  SaveStatusBadge,
  ApiKeyModal,
  AIEnhanceModal,
} from '../components/index.js';
import { ResumeBuilder, ResumePreview } from '../modules/index.js';

/**
 * @file EditorPage.jsx
 * @description The main resume workspace with centered dual-pane layout on desktop,
 * seamless mobile view switcher (Form vs Live Preview), sticky export toolbar, and AI assistance modals.
 */
export function EditorPage() {
  const { resumeData, resetToDefault, clearAll } = useResume();
  const { t } = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const previewRef = useRef(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [mobileView, setMobileView] = useState('form'); // 'form' | 'preview'
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: '',
    message: '',
    confirmColor: 'primary',
    onConfirm: null,
  });

  const { exportPdf, exportDocx, exportJson, isExporting, exportType } = useExport(
    resumeData,
    previewRef
  );

  return (
    <PageTransition>
      <Stack sx={{ minHeight: 'calc(100vh - 64px)' }}>
        {/* Sticky Action Sub-header */}
        <Stack
          direction="row"
          sx={{
            py: { xs: 1, sm: 1.5 },
            px: { xs: 1.5, sm: 2, md: 4 },
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            position: 'sticky',
            top: 64,
            zIndex: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          {/* Export Action Buttons */}
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <ButtonGroup variant="contained" size="small" disableElevation>
              <Button
                onClick={exportPdf}
                disabled={isExporting}
                startIcon={
                  isExporting && exportType === EXPORT_TYPE.PDF ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <PictureAsPdfIcon fontSize="small" />
                  )
                }
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.82rem' },
                  px: { xs: 1, sm: 1.5 },
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {t('export.pdf')}
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  {t('export.pdfShort')}
                </Box>
              </Button>
              <Button
                onClick={exportDocx}
                disabled={isExporting}
                color="secondary"
                startIcon={
                  isExporting && exportType === EXPORT_TYPE.DOCX ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <DescriptionIcon fontSize="small" />
                  )
                }
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.82rem' },
                  px: { xs: 1, sm: 1.5 },
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {t('export.word')}
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  {t('export.wordShort')}
                </Box>
              </Button>
            </ButtonGroup>

            <Button
              variant="outlined"
              size="small"
              onClick={exportJson}
              startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                fontSize: { xs: '0.75rem', sm: '0.82rem' },
                px: { xs: 1, sm: 1.5 },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                {t('export.json')}
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                {t('export.jsonShort')}
              </Box>
            </Button>
          </Stack>

          {/* Right Action Tools & More Menu */}
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <SaveStatusBadge />
            <Tooltip title={t('nav.resetOrClear')} arrow>
              <IconButton
                size="small"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{ color: 'text.secondary' }}
                aria-label={t('nav.moreOptions')}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              PaperProps={{ sx: { borderRadius: 2, minWidth: 180, p: 0.5 } }}
            >
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null);
                  setConfirmModal({
                    open: true,
                    title: t('settings.confirmResetTitle'),
                    message: t('settings.confirmReset'),
                    confirmColor: 'primary',
                    onConfirm: () => {
                      resetToDefault();
                      enqueueSnackbar(t('settings.dataReset'), { variant: 'info' });
                      setConfirmModal((prev) => ({ ...prev, open: false }));
                    },
                  });
                }}
                sx={{ gap: 1.5, fontSize: '0.88rem' }}
              >
                <RestartAltIcon fontSize="small" color="action" />
                {t('settings.resetData')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null);
                  setConfirmModal({
                    open: true,
                    title: t('settings.confirmClearTitle'),
                    message: t('settings.confirmClear'),
                    confirmColor: 'error',
                    onConfirm: () => {
                      clearAll();
                      enqueueSnackbar(t('settings.allCleared'), { variant: 'warning' });
                      setConfirmModal((prev) => ({ ...prev, open: false }));
                    },
                  });
                }}
                sx={{ gap: 1.5, fontSize: '0.88rem', color: 'error.main' }}
              >
                <DeleteSweepOutlinedIcon fontSize="small" color="error" />
                {t('settings.clearAll')}
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>

        {/* Mobile View Switcher (Form vs Live Preview) */}
        <Stack
          direction="row"
          sx={{
            display: { xs: 'flex', lg: 'none' },
            width: '100%',
            px: { xs: 1.5, sm: 2.5, md: 3 },
            pt: 2,
            pb: 0.5,
          }}
        >
          <ToggleButtonGroup
            value={mobileView}
            exclusive
            onChange={(_, val) => val && setMobileView(val)}
            size="small"
            fullWidth
            sx={{
              width: '100%',
              backgroundColor: 'background.paper',
              p: 0,
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,
              '& .MuiToggleButtonGroup-grouped': {
                border: 0,
                borderRadius: 0,
                '&:not(:first-of-type)': {
                  borderLeft: '1px solid',
                  borderColor: 'divider',
                },
              },
            }}
          >
            <ToggleButton
              value="form"
              sx={{
                flex: 1,
                fontWeight: 600,
                fontSize: '0.85rem',
                gap: 0.75,
                textTransform: 'none',
                py: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'common.white',
                  '&:hover': { backgroundColor: 'primary.dark' },
                  '& .MuiSvgIcon-root': { color: 'common.white' },
                },
              }}
            >
              <EditNoteIcon sx={{ fontSize: 18 }} />
              {t('nav.builder')}
            </ToggleButton>
            <ToggleButton
              value="preview"
              sx={{
                flex: 1,
                fontWeight: 600,
                fontSize: '0.85rem',
                gap: 0.75,
                textTransform: 'none',
                py: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'common.white',
                  '&:hover': { backgroundColor: 'primary.dark' },
                  '& .MuiSvgIcon-root': { color: 'common.white' },
                },
              }}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
              {t('preview.title')}
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {/* Main Workspace: Dual Pane on Desktop, Toggleable on Mobile */}
        <Container
          maxWidth="xl"
          sx={{
            flex: 1,
            py: { xs: 1.5, sm: 2.5, md: 3 },
            px: { xs: 1.5, sm: 2.5, md: 3 },
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 3,
            justifyContent: { xs: 'flex-start', lg: 'center' },
            alignItems: 'flex-start',
            minHeight: 'calc(100vh - 140px)',
          }}
        >
          {/* Left: Interactive Form Builder Card */}
          <Box
            sx={{
              display: { xs: mobileView === 'form' ? 'block' : 'none', lg: 'block' },
              width: { xs: '100%', lg: '50%' },
              maxWidth: { xs: '840px', lg: 'none' },
              height: { xs: 'auto', lg: 'calc(100vh - 160px)' },
              position: { lg: 'sticky' },
              top: { lg: 130 },
              mx: { xs: 0, sm: 'auto' },
            }}
          >
            <ResumeBuilder />
          </Box>

          {/* Right: Live A4 Canvas Preview Card */}
          <Box
            sx={{
              display: { xs: mobileView === 'preview' ? 'block' : 'none', lg: 'block' },
              width: { xs: '100%', lg: '50%' },
              maxWidth: { xs: '840px', lg: 'none' },
              height: { xs: 'calc(100vh - 200px)', lg: 'calc(100vh - 160px)' },
              minHeight: { xs: 560, lg: 'none' },
              position: { lg: 'sticky' },
              top: { lg: 130 },
              mx: 'auto',
            }}
          >
            <ResumePreview ref={previewRef} />
          </Box>
        </Container>

        {/* Modals for AI & Confirmation */}
        <ApiKeyModal />
        <AIEnhanceModal />
        <ConfirmDialog
          open={confirmModal.open}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmColor={confirmModal.confirmColor}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
        />
      </Stack>
    </PageTransition>
  );
}
