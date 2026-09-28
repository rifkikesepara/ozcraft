import React from 'react';
import {
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { useResume, useLocale, useLocalReorder } from '../../hooks/index.js';

/**
 * Individual reorderable Education card item.
 */
function EducationItem({ edu, index, locale, t, handleUpdateItem, handleRemoveItem   handleDragEnd,
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={edu}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.015, zIndex: 999, borderRadius: '14px', boxShadow: '0 12px 28px -4px rgba(0,0,0,0.16)' }}
      style={{ listStyle: 'none', position: 'relative', borderRadius: '14px' }}
    >
      <Accordion
        defaultExpanded={index === 0}
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
                onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); dragControls.start(e); }} onClick={(e) => e.stopPropagation()}
                sx={{
                  cursor: 'grab',
                  color: 'text.secondary',
                  alignItems: 'center',
                  p: 0.5,
                  '&:hover': { color: 'primary.main', backgroundColor: 'action.hover' },
                  '&:active': { cursor: 'grabbing' },
                }}
                title={t('builder.dragToReorderItem')}
              >
                <DragIndicatorIcon fontSize="small" />
              </Stack>
              <Typography sx={{ fontWeight: 600 }}>
                {edu.degree || edu.institution
                  ? `${edu.degree || 'Degree'} ${edu.institution ? `@ ${edu.institution}` : ''}`
                  : `${t('form.defaultEducation')} #${index + 1}`}
              </Typography>
            </Stack>
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveItem(index);
              }}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={t('form.degree')}
                placeholder="e.g. Bachelor of Science"
                value={edu.degree || ''}
                onChange={(e) => handleUpdateItem(index, 'degree', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={t('form.field')}
                placeholder="e.g. Computer Science"
                value={edu.field || ''}
                onChange={(e) => handleUpdateItem(index, 'field', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={t('form.institution')}
                placeholder="e.g. Stanford University"
                value={edu.institution || ''}
                onChange={(e) => handleUpdateItem(index, 'institution', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={t('form.location')}
                placeholder="e.g. Stanford, CA"
                value={edu.location || ''}
                onChange={(e) => handleUpdateItem(index, 'location', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <DatePicker
                label={t('form.startDate')}
                views={['year', 'month']}
                format="MMM YYYY"
                value={edu.startDate ? dayjs(edu.startDate) : null}
                onChange={(newValue) =>
                  handleUpdateItem(index, 'startDate', newValue ? newValue.format('YYYY-MM') : '')
                }
                slotProps={{
                  textField: { fullWidth: true, placeholder: 'YYYY-MM', size: 'small' },
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <DatePicker
                label={t('form.endDate')}
                views={['year', 'month']}
                format="MMM YYYY"
                value={edu.endDate ? dayjs(edu.endDate) : null}
                onChange={(newValue) =>
                  handleUpdateItem(index, 'endDate', newValue ? newValue.format('YYYY-MM') : '')
                }
                slotProps={{
                  textField: { fullWidth: true, placeholder: 'YYYY-MM', size: 'small' },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label={t('form.gpa')}
                placeholder="e.g. 3.85 / 4.0"
                value={edu.gpa || ''}
                onChange={(e) => handleUpdateItem(index, 'gpa', e.target.value)}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Reorder.Item>
  );
}

/**
 * @file EducationForm.jsx
 * @description Form module for education degrees, universities, graduation years, and GPA
 * with drag-and-drop reordering.
 */
export function EducationForm() {
  const { resumeData, updateSection } = useResume();
  const { t, locale } = useLocale();

  const education = React.useMemo(() => {
    const list = resumeData?.education || [];
    return list.map((item, index) => {
      if (item.id) return item;
      return { ...item, id: `edu-${index + 1}` };
    });
  }, [resumeData?.education]);

  const {
    localItems: localEducation,
    handleReorder: handleReorderLocal,
    handleDragEnd,
  } = useLocalReorder(education, (newOrder) => updateSection('education', newOrder));


  

  const handleAddEducation = () => {
    const newItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    updateSection('education', (prev) => [newItem, ...prev]);
  };

  const handleUpdateItem = (index, field, value) => {
    updateSection('education', (prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveItem = (index) => {
    updateSection('education', (prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('form.educationDesc')}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddEducation}
        >
          {t('common.add')}
        </Button>
      </Stack>

      <Reorder.Group
        axis="y"
        values={localEducation}
        onReorder={handleReorderLocal}
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {localEducation.map((edu, index) => (
          <EducationItem
            key={edu.id || index}
            edu={edu}
            index={index}
            locale={locale}
            t={t}
            handleUpdateItem={handleUpdateItem}
            handleRemoveItem={handleRemoveItem}
            handleDragEnd={handleDragEnd}
          />
        ))}
      </Reorder.Group>
    </Stack>
  );
}
