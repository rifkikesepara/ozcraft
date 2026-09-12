import React from 'react';
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
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Reorder } from 'framer-motion';

import { useResume } from '../../hooks/useResume.js';
import { useLocale } from '../../hooks/useLocale.js';
import { DEFAULT_SECTION_ORDER } from '../../schemas/resume.schema.js';

/**
 * @file SectionOrderModal.jsx
 * @description Drag-and-drop modal utilizing Framer Motion's Reorder component
 * to rearrange resume sections in real-time.
 *
 * @param {object} props
 * @param {boolean} props.open - Modal visibility state
 * @param {() => void} props.onClose - Modal close handler
 */
export function SectionOrderModal({ open, onClose }) {
  const { sectionOrder, setSectionOrder } = useResume();
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
  };

  const handleReset = () => {
    setSectionOrder(DEFAULT_SECTION_ORDER);
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

      <DialogContent sx={{ py: 3 }}>
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
            gap: '10px',
          }}
        >
          {sectionOrder.map((sectionKey) => {
            const meta = SECTION_METADATA[sectionKey] || { label: sectionKey, icon: null };

            return (
              <Reorder.Item
                key={sectionKey}
                value={sectionKey}
                whileDrag={{
                  scale: 1.02,
                  zIndex: 25,
                  borderRadius: '16px',
                  boxShadow: `0 12px 28px -4px ${alpha('#000000', 0.16)}, 0 4px 12px -2px ${alpha('#000000', 0.08)}`,
                }}
                style={{
                  cursor: 'grab',
                  userSelect: 'none',
                  borderRadius: '16px',
                  listStyle: 'none',
                  position: 'relative',
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.75,
                    px: 2,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'background.paper',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}`,
                    },
                    '&:active': {
                      cursor: 'grabbing',
                    },
                  }}
                >
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                    <Stack direction="row" sx={{ color: 'text.secondary', alignItems: 'center' }}>
                      {meta.icon}
                    </Stack>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {meta.label}
                    </Typography>
                  </Stack>

                  <Stack direction="row" sx={{ alignItems: 'center', color: 'text.secondary' }}>
                    <DragIndicatorIcon sx={{ fontSize: 20 }} />
                  </Stack>
                </Paper>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
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
