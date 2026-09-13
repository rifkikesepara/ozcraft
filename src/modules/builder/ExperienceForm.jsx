import React from 'react';
import {
  Box,
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
  FormControlLabel,
  Checkbox,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Reorder, useDragControls } from 'framer-motion';

import { useResume, useLocale, useAI } from '../../hooks/index.js';
import { AIEnhanceButton } from '../../components/index.js';
import { AI_PROMPTS } from '../../utils/ai/index.js';

/**
 * @file ExperienceForm.jsx
 * @description Work experience form list with smooth Framer Motion drag reordering,
 * highlight editing, and AI action-verb bullet point enhancement.
 */
function ExperienceItem({
  exp,
  expIndex,
  locale,
  t,
  handleUpdateItem,
  handleRemoveItem,
  handleAddHighlight,
  handleUpdateHighlight,
  handleRemoveHighlight,
  handleEnhanceHighlight,
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={exp}
      dragListener={false}
      dragControls={dragControls}
      style={{ listStyle: 'none' }}
    >
      <Accordion
        defaultExpanded={expIndex === 0}
        sx={{
          borderRadius: '14px !important',
          border: '1px solid',
          borderColor: 'divider',
          '&:before': { display: 'none' },
          boxShadow: 'none',
          overflow: 'hidden',
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1 }}
          >
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
                {exp.position || exp.company
                  ? `${exp.position || 'Position'} ${exp.company ? `@ ${exp.company}` : ''}`
                  : `${locale === 'tr' ? 'Pozisyon' : 'Role'} #${expIndex + 1}`}
              </Typography>
            </Stack>
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveItem(expIndex);
              }}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={t('form.position')}
                value={exp.position || ''}
                onChange={(e) => handleUpdateItem(expIndex, 'position', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={t('form.company')}
                value={exp.company || ''}
                onChange={(e) => handleUpdateItem(expIndex, 'company', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label={t('form.location')}
                value={exp.location || ''}
                onChange={(e) => handleUpdateItem(expIndex, 'location', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField
                fullWidth
                label={t('form.startDate')}
                placeholder="YYYY-MM"
                value={exp.startDate || ''}
                onChange={(e) => handleUpdateItem(expIndex, 'startDate', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField
                fullWidth
                label={t('form.endDate')}
                placeholder={exp.current ? t('common.present') : 'YYYY-MM'}
                disabled={Boolean(exp.current)}
                value={exp.endDate || ''}
                onChange={(e) => handleUpdateItem(expIndex, 'endDate', e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(exp.current)}
                    onChange={(e) => handleUpdateItem(expIndex, 'current', e.target.checked)}
                  />
                }
                label={<Typography variant="body2">{t('form.currentJob')}</Typography>}
              />
            </Grid>
          </Grid>

          {/* Highlights List */}
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}
            >
              {locale === 'tr'
                ? 'Önemli Sorumluluklar ve Başarılar'
                : 'Key Responsibilities & Achievements'}
            </Typography>

            <Stack sx={{ gap: 1.5, mt: 1.5 }}>
              {(exp.highlights || []).map((hl, hlIndex) => (
                <Stack direction="row" key={hlIndex} sx={{ gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder={
                      locale === 'tr'
                        ? '• Tasarım sistemi dönüşümüne öncülük ederek derleme sürelerini %40 kısalttı...'
                        : '• Spearheaded design system migration cutting build times by 40%...'
                    }
                    value={hl}
                    onChange={(e) => handleUpdateHighlight(expIndex, hlIndex, e.target.value)}
                  />
                  <Stack sx={{ gap: 0.5 }}>
                    <AIEnhanceButton
                      tooltip={t('ai.button')}
                      onClick={() => handleEnhanceHighlight(expIndex, hlIndex, hl)}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveHighlight(expIndex, hlIndex)}
                      disabled={(exp.highlights || []).length <= 1}
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}

              <Button
                size="small"
                variant="text"
                startIcon={<AddIcon />}
                onClick={() => handleAddHighlight(expIndex)}
                sx={{ alignSelf: 'flex-start' }}
              >
                {t('form.addHighlight') || 'Add Bullet Point'}
              </Button>
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Reorder.Item>
  );
}

/**
 * @file ExperienceForm.jsx
 * @description Form module for work experience items with per-bullet localized AI enhancement
 * and drag-and-drop reordering.
 */
export function ExperienceForm() {
  const { resumeData, updateSection } = useResume();
  const { t, locale } = useLocale();
  const { openEnhanceModal } = useAI();

  const experience = React.useMemo(() => {
    const list = resumeData?.experience || [];
    return list.map((item, index) => {
      if (item.id) return item;
      return { ...item, id: `exp-${index + 1}` };
    });
  }, [resumeData?.experience]);

  const handleReorder = (newOrder) => {
    updateSection('experience', newOrder);
  };

  const handleAddExperience = () => {
    const newItem = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      highlights: [''],
    };
    updateSection('experience', (prev) => [newItem, ...prev]);
  };

  const handleUpdateItem = (index, field, value) => {
    updateSection('experience', (prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveItem = (index) => {
    updateSection('experience', (prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddHighlight = (expIndex) => {
    updateSection('experience', (prev) => {
      const copy = [...prev];
      copy[expIndex] = {
        ...copy[expIndex],
        highlights: [...(copy[expIndex].highlights || []), ''],
      };
      return copy;
    });
  };

  const handleUpdateHighlight = (expIndex, hlIndex, text) => {
    updateSection('experience', (prev) => {
      const copy = [...prev];
      const newHighlights = [...(copy[expIndex].highlights || [])];
      newHighlights[hlIndex] = text;
      copy[expIndex] = { ...copy[expIndex], highlights: newHighlights };
      return copy;
    });
  };

  const handleRemoveHighlight = (expIndex, hlIndex) => {
    updateSection('experience', (prev) => {
      const copy = [...prev];
      const newHighlights = copy[expIndex].highlights.filter((_, i) => i !== hlIndex);
      copy[expIndex] = { ...copy[expIndex], highlights: newHighlights };
      return copy;
    });
  };

  const handleEnhanceHighlight = (expIndex, hlIndex, originalText) => {
    if (!originalText.trim()) return;

    openEnhanceModal({
      originalText,
      prompt: AI_PROMPTS.enhanceBullet(originalText, 'action', locale),
      title: `${t('ai.button')} (STAR ${locale === 'tr' ? 'Yöntemi' : 'Method'})`,
      promptType: 'bullet',
      metadata: { originalText },
      onApply: (enhancedText) => {
        handleUpdateHighlight(expIndex, hlIndex, enhancedText);
      },
    });
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {locale === 'tr'
            ? 'Kariyer gelişiminizi, ölçülebilir başarılarınızı ve liderlik etkinizi vurgulayın. Sıralamak için tutamaçlardan sürükleyin.'
            : 'Highlight your career progression, quantifiable achievements, and leadership impact. Drag handles to reorder.'}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddExperience}
        >
          {t('common.add')}
        </Button>
      </Stack>

      <Reorder.Group
        axis="y"
        values={experience}
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
        {experience.map((exp, expIndex) => (
          <ExperienceItem
            key={exp.id || expIndex}
            exp={exp}
            expIndex={expIndex}
            locale={locale}
            t={t}
            handleUpdateItem={handleUpdateItem}
            handleRemoveItem={handleRemoveItem}
            handleAddHighlight={handleAddHighlight}
            handleUpdateHighlight={handleUpdateHighlight}
            handleRemoveHighlight={handleRemoveHighlight}
            handleEnhanceHighlight={handleEnhanceHighlight}
          />
        ))}
      </Reorder.Group>
    </Stack>
  );
}
