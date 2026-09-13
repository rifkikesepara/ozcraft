import React from 'react';
import {
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
  alpha,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Reorder, useDragControls } from 'framer-motion';

import { useResume, useLocale } from '../../hooks/index.js';

/**
 * Individual reorderable Reference card item.
 */
function ReferenceItem({ item, index, locale, t, handleUpdate, handleRemove }) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{
        scale: 1.015,
        zIndex: 25,
        borderRadius: '16px',
        boxShadow: (theme) =>
          `0 12px 28px -4px ${alpha(theme.palette.common.black, 0.16)}, 0 4px 12px -2px ${alpha(theme.palette.common.black, 0.08)}`,
      }}
      style={{ listStyle: 'none', position: 'relative', borderRadius: '16px' }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Stack
              component="span"
              direction="row"
              onPointerDown={(e) => {
                e.stopPropagation();
                dragControls.start(e);
              }}
              sx={{
                cursor: 'grab',
                color: 'text.secondary',
                alignItems: 'center',
                p: 0.5,
                borderRadius: 1,
                '&:hover': { color: 'primary.main', backgroundColor: 'action.hover' },
                '&:active': { cursor: 'grabbing' },
              }}
              title={locale === 'tr' ? 'Sıralamak için sürükleyin' : 'Drag to reorder'}
            >
              <DragIndicatorIcon fontSize="small" />
            </Stack>
            <Typography sx={{ fontWeight: 600 }}>
              {item.fullName || `${locale === 'tr' ? 'Referans' : 'Reference'} #${index + 1}`}
            </Typography>
          </Stack>
          <IconButton size="small" color="error" onClick={() => handleRemove(index)}>
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={t('form.referenceName')}
              placeholder="e.g. Sarah Jenkins"
              value={item.fullName || ''}
              onChange={(e) => handleUpdate(index, 'fullName', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={t('form.referencePosition')}
              placeholder="e.g. VP of Engineering"
              value={item.position || ''}
              onChange={(e) => handleUpdate(index, 'position', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={t('form.referenceCompany')}
              placeholder="e.g. TechFlow Systems"
              value={item.company || ''}
              onChange={(e) => handleUpdate(index, 'company', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="email"
              label={t('form.referenceEmail')}
              placeholder="e.g. sarah.jenkins@techflow.io"
              value={item.email || ''}
              onChange={(e) => handleUpdate(index, 'email', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label={t('form.referencePhone')}
              placeholder="e.g. +1 (555) 345-6789"
              value={item.phone || ''}
              onChange={(e) => handleUpdate(index, 'phone', e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>
    </Reorder.Item>
  );
}

/**
 * @file ReferencesForm.jsx
 * @description Form module for professional references with drag-and-drop reordering.
 */
export function ReferencesForm() {
  const { resumeData, updateSection } = useResume();
  const { t, locale } = useLocale();

  const references = React.useMemo(() => {
    const list = resumeData?.references || [];
    return list.map((item, index) => {
      if (item.id) return item;
      return { ...item, id: `ref-${index + 1}` };
    });
  }, [resumeData?.references]);

  const handleReorder = (newOrder) => {
    updateSection('references', newOrder);
  };

  const handleAdd = () => {
    const newItem = {
      id: `ref-${Date.now()}`,
      fullName: '',
      company: '',
      position: '',
      email: '',
      phone: '',
    };
    updateSection('references', (prev = []) => [newItem, ...prev]);
  };

  const handleUpdate = (index, field, value) => {
    updateSection('references', (prev = []) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemove = (index) => {
    updateSection('references', (prev = []) => prev.filter((_, i) => i !== index));
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {locale === 'tr'
            ? 'Deneyimlerinizi ve yetkinliklerinizi doğrulayabilecek profesyonel referansları ekleyin. Sıralamak için tutamaçlardan sürükleyin.'
            : 'Add professional references who can vouch for your experience and work ethic. Drag handles to reorder.'}
        </Typography>
        <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAdd}>
          {t('common.add')}
        </Button>
      </Stack>

      <Reorder.Group
        axis="y"
        values={references}
        onReorder={handleReorder}
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {references.map((item, index) => (
          <ReferenceItem
            key={item.id || index}
            item={item}
            index={index}
            locale={locale}
            t={t}
            handleUpdate={handleUpdate}
            handleRemove={handleRemove}
          />
        ))}
      </Reorder.Group>
    </Stack>
  );
}
