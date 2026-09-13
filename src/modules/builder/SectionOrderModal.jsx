import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Paper,
  Switch,
  Tooltip,
  Chip,
  Divider,
  alpha,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import CodeIcon from '@mui/icons-material/Code';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Reorder } from 'framer-motion';

import { useResume, useLocale } from '../../hooks/index.js';
import { DEFAULT_SECTION_ORDER } from '../../schemas/resume.schema.js';

/**
 * @file SectionOrderModal.jsx
 * @description Drag-and-drop modal utilizing Framer Motion's Reorder component
 * to rearrange resume sections in real-time and toggle their visibility.
 *
 * @param {object} props
 * @param {boolean} props.open - Modal visibility state
 * @param {() => void} props.onClose - Modal close handler
 */
export function SectionOrderModal({ open, onClose }) {
  const { sectionOrder, setSectionOrder, disabledSections = [], setDisabledSections } = useResume();
  const { t } = useLocale();

  const SECTION_METADATA = {
    summary: { label: t('builder.summary'), icon: <DescriptionOutlinedIcon fontSize="small" /> },
    experience: { label: t('builder.experience'), icon: <WorkOutlinedIcon fontSize="small" /> },
    education: { label: t('builder.education'), icon: <SchoolOutlinedIcon fontSize="small" /> },
    skills: { label: t('builder.skills'), icon: <BuildOutlinedIcon fontSize="small" /> },
    projects: { label: t('builder.projects'), icon: <CodeIcon fontSize="small" /> },
    certifications: {
      label: t('builder.certifications'),
      icon: <CardMembershipOutlinedIcon fontSize="small" />,
    },
    languages: { label: t('builder.languages'), icon: <TranslateOutlinedIcon fontSize="small" /> },
    references: {
      label: t('builder.references'),
      icon: <ContactMailOutlinedIcon fontSize="small" />,
    },
  };

  // Derive disabled sections: any section in default order not present in active sectionOrder
  const disabledKeys = Array.from(
    new Set([
      ...disabledSections,
      ...DEFAULT_SECTION_ORDER.filter((key) => !sectionOrder.includes(key)),
    ])
  );

  const handleDisable = (sectionKey) => {
    if (sectionOrder.length <= 1) return;
    const newOrder = sectionOrder.filter((key) => key !== sectionKey);
    const newDisabled = Array.from(new Set([...disabledKeys, sectionKey]));
    setSectionOrder(newOrder);
    setDisabledSections(newDisabled);
  };

  const handleEnable = (sectionKey) => {
    const newOrder = [...sectionOrder, sectionKey];
    const newDisabled = disabledKeys.filter((key) => key !== sectionKey);
    setSectionOrder(newOrder);
    setDisabledSections(newDisabled);
  };

  const handleReset = () => {
    setSectionOrder(DEFAULT_SECTION_ORDER);
    setDisabledSections([]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 1.5,
        }}
      >
        <Stack
          direction="row"
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
          }}
        >
          <SwapVertIcon />
        </Stack>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t('builder.reorderSections')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {t('builder.dragToReorder')}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 2.5, px: { xs: 2, sm: 3 } }}>
        <Stack sx={{ gap: 2 }}>
          {/* Active Sections Header */}
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {t('builder.visibleSections')} ({sectionOrder.length})
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('builder.dragToReorder')}
            </Typography>
          </Stack>

          {/* Reorderable Active Sections List */}
          <Reorder.Group
            axis="y"
            values={sectionOrder}
            onReorder={setSectionOrder}
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {sectionOrder.map((sectionKey) => {
              const meta = SECTION_METADATA[sectionKey] || { label: sectionKey, icon: null };
              const canDisable = sectionOrder.length > 1;

              return (
                <Reorder.Item
                  key={sectionKey}
                  value={sectionKey}
                  whileDrag={{
                    scale: 1.02,
                    zIndex: 25,
                    borderRadius: '14px',
                    boxShadow: `0 12px 28px -4px ${alpha('#000000', 0.18)}, 0 4px 12px -2px ${alpha('#000000', 0.08)}`,
                  }}
                  style={{
                    cursor: 'grab',
                    userSelect: 'none',
                    borderRadius: '14px',
                    listStyle: 'none',
                    position: 'relative',
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.25,
                      px: 2,
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'background.paper',
                      borderColor: 'divider',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: (theme) =>
                          `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}`,
                      },
                      '&:active': {
                        cursor: 'grabbing',
                      },
                    }}
                  >
                    {/* Left: Drag Handle + Icon + Label */}
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                      <Stack direction="row" sx={{ alignItems: 'center', color: 'text.disabled' }}>
                        <DragIndicatorIcon sx={{ fontSize: 20 }} />
                      </Stack>
                      <Stack direction="row" sx={{ color: 'primary.main', alignItems: 'center' }}>
                        {meta.icon}
                      </Stack>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {meta.label}
                      </Typography>
                    </Stack>

                    {/* Right: Switch Toggle */}
                    <Tooltip
                      title={
                        canDisable ? t('builder.toggleVisibility') : t('builder.atLeastOneSection')
                      }
                      arrow
                    >
                      <Box>
                        <Switch
                          size="small"
                          checked={true}
                          disabled={!canDisable}
                          onChange={() => handleDisable(sectionKey)}
                          color="primary"
                        />
                      </Box>
                    </Tooltip>
                  </Paper>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>

          {/* Hidden / Disabled Sections List */}
          {disabledKeys.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Stack
                direction="row"
                sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  {t('builder.hiddenSections')} ({disabledKeys.length})
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {t('builder.clickToEnable')}
                </Typography>
              </Stack>

              <Stack sx={{ gap: 1 }}>
                {disabledKeys.map((sectionKey) => {
                  const meta = SECTION_METADATA[sectionKey] || { label: sectionKey, icon: null };

                  return (
                    <Paper
                      key={sectionKey}
                      variant="outlined"
                      sx={{
                        p: 1.25,
                        px: 2,
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: (theme) =>
                          alpha(theme.palette.action.disabledBackground, 0.04),
                        borderColor: 'divider',
                        opacity: 0.65,
                        transition: 'opacity 0.2s, border-color 0.2s',
                        '&:hover': {
                          opacity: 0.9,
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      {/* Left: Icon + Label + Hidden Chip */}
                      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                        <Stack
                          direction="row"
                          sx={{ color: 'text.disabled', alignItems: 'center' }}
                        >
                          {meta.icon}
                        </Stack>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 500,
                            color: 'text.secondary',
                            textDecoration: 'line-through',
                          }}
                        >
                          {meta.label}
                        </Typography>
                        <Chip
                          size="small"
                          label={t('builder.hidden')}
                          sx={{
                            height: 20,
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            backgroundColor: (theme) => alpha(theme.palette.text.secondary, 0.1),
                            color: 'text.secondary',
                          }}
                        />
                      </Stack>

                      {/* Right: Switch Toggle */}
                      <Tooltip title={t('builder.showSection')} arrow>
                        <Switch
                          size="small"
                          checked={false}
                          onChange={() => handleEnable(sectionKey)}
                          color="primary"
                        />
                      </Tooltip>
                    </Paper>
                  );
                })}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          px: 3,
          justifyContent: 'space-between',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button onClick={handleReset} size="small" startIcon={<RestartAltIcon />} color="inherit">
          {t('builder.resetOrder')}
        </Button>

        <Button onClick={onClose} variant="contained" size="small">
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
