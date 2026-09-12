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

import { useResume } from '../../hooks/useResume.js';
import { useLocale } from '../../hooks/useLocale.js';

/**
 * Individual reorderable Certification card item.
 */
function CertificationItem({ cert, index, locale, t, handleUpdate, handleRemove }) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={cert}
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
              {cert.name || `${locale === 'tr' ? 'Sertifika' : 'Certification'} #${index + 1}`}
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
              label={t('form.certName')}
              placeholder="e.g. AWS Solutions Architect"
              value={cert.name || ''}
              onChange={(e) => handleUpdate(index, 'name', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={t('form.issuer')}
              placeholder="e.g. Amazon Web Services"
              value={cert.issuer || ''}
              onChange={(e) => handleUpdate(index, 'issuer', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={t('form.issueDate')}
              placeholder="YYYY-MM"
              value={cert.date || ''}
              onChange={(e) => handleUpdate(index, 'date', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={t('form.certUrl')}
              placeholder="https://..."
              value={cert.url || ''}
              onChange={(e) => handleUpdate(index, 'url', e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>
    </Reorder.Item>
  );
}

/**
 * @file CertificationsForm.jsx
 * @description Form module for professional certificates, licenses, and issuing bodies
 * with drag-and-drop reordering.
 */
export function CertificationsForm() {
  const { resumeData, updateSection } = useResume();
  const { t, locale } = useLocale();

  const certifications = React.useMemo(() => {
    const list = resumeData?.certifications || [];
    return list.map((item, index) => {
      if (item.id) return item;
      return { ...item, id: `cert-${index + 1}` };
    });
  }, [resumeData?.certifications]);

  const handleReorder = (newOrder) => {
    updateSection('certifications', newOrder);
  };

  const handleAdd = () => {
    const newItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
      url: '',
    };
    updateSection('certifications', (prev) => [newItem, ...prev]);
  };

  const handleUpdate = (index, field, value) => {
    updateSection('certifications', (prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemove = (index) => {
    updateSection('certifications', (prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {locale === 'tr'
            ? 'Doğrulanmış sertifikalarınızı ve lisanslarınızı ekleyin. Sıralamak için tutamaçlardan sürükleyin.'
            : 'Add verified licenses, industry badges, and professional credentials. Drag handles to reorder.'}
        </Typography>
        <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAdd}>
          {t('form.addCert')}
        </Button>
      </Stack>

      <Reorder.Group
        axis="y"
        values={certifications}
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
        {certifications.map((cert, index) => (
          <CertificationItem
            key={cert.id || index}
            cert={cert}
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
