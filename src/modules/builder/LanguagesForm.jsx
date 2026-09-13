import React from 'react';
import {
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Grid,
  Paper,
  alpha,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Reorder, useDragControls } from 'framer-motion';

import { useResume, useLocale } from '../../hooks/index.js';

const PROFICIENCY_LEVELS = [
  { value: 'native', labelTr: 'Ana Dil', labelEn: 'Native / Bilingual' },
  { value: 'fluent', labelTr: 'Akıcı (C1/C2)', labelEn: 'Full Professional (C1/C2)' },
  {
    value: 'professional',
    labelTr: 'Profesyonel Çalışma (B2)',
    labelEn: 'Professional Working (B2)',
  },
  { value: 'intermediate', labelTr: 'Orta Düzey (B1)', labelEn: 'Limited Working (B1)' },
  { value: 'beginner', labelTr: 'Başlangıç (A1/A2)', labelEn: 'Elementary (A1/A2)' },
];

/**
 * Individual reorderable Language card item.
 */
function LanguageItem({ lang, index, locale, t, handleUpdate, handleRemove }) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={lang}
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
              {lang.language || `${locale === 'tr' ? 'Dil' : 'Language'} #${index + 1}`}
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
              label={t('form.language')}
              placeholder="e.g. English, Turkish, Spanish"
              value={lang.language || ''}
              onChange={(e) => handleUpdate(index, 'language', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              select
              label={t('form.proficiency')}
              value={lang.proficiency || 'fluent'}
              onChange={(e) => handleUpdate(index, 'proficiency', e.target.value)}
            >
              {PROFICIENCY_LEVELS.map((level) => {
                const val = typeof level === 'string' ? level : level.value;
                const lbl =
                  typeof level === 'string'
                    ? level
                    : locale === 'tr'
                      ? level.labelTr
                      : level.labelEn;
                return (
                  <MenuItem key={val} value={val}>
                    {lbl}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
        </Grid>
      </Paper>
    </Reorder.Item>
  );
}

/**
 * @file LanguagesForm.jsx
 * @description Form module for spoken/written languages and CEFR/standard proficiency levels
 * with drag-and-drop reordering.
 */
export function LanguagesForm() {
  const { resumeData, updateSection } = useResume();
  const { t, locale } = useLocale();

  const languages = React.useMemo(() => {
    const list = resumeData?.languages || [];
    return list.map((item, index) => {
      if (item.id) return item;
      return { ...item, id: `lang-${index + 1}` };
    });
  }, [resumeData?.languages]);

  const handleReorder = (newOrder) => {
    updateSection('languages', newOrder);
  };

  const handleAdd = () => {
    const newItem = {
      id: `lang-${Date.now()}`,
      language: '',
      proficiency: 'Full Professional',
    };
    updateSection('languages', (prev) => [newItem, ...prev]);
  };

  const handleUpdate = (index, field, value) => {
    updateSection('languages', (prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemove = (index) => {
    updateSection('languages', (prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {locale === 'tr'
            ? 'Konuştuğunuz ve yazdığınız dilleri yetkinlik düzeyleriyle ekleyin. Sıralamak için tutamaçlardan sürükleyin.'
            : 'Add your spoken and written languages with fluency levels. Drag handles to reorder.'}
        </Typography>
        <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAdd}>
          {t('form.addLanguage')}
        </Button>
      </Stack>

      <Reorder.Group
        axis="y"
        values={languages}
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
        {languages.map((lang, index) => (
          <LanguageItem
            key={lang.id || index}
            lang={lang}
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
