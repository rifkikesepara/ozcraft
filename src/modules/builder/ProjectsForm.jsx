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
  alpha,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Reorder, useDragControls } from 'framer-motion';

import { useResume, useLocale } from '../../hooks/index.js';

/**
 * Individual reorderable Project card item.
 */
function ProjectItem({ proj, index, locale, t, handleUpdateItem, handleRemoveItem }) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={proj}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{
        scale: 1.015,
        zIndex: 25,
        borderRadius: '14px',
        boxShadow: (theme) =>
          `0 12px 28px -4px ${alpha(theme.palette.common.black, 0.16)}, 0 4px 12px -2px ${alpha(theme.palette.common.black, 0.08)}`,
      }}
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
                {proj.name || `${locale === 'tr' ? 'Proje' : 'Project'} #${index + 1}`}
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
                label={t('form.projectName')}
                value={proj.name || ''}
                onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={t('form.projectLink')}
                placeholder="https://..."
                value={proj.link || ''}
                onChange={(e) => handleUpdateItem(index, 'link', e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label={t('form.technologies')}
                placeholder="e.g. React, Node.js, Docker, WebSockets (comma separated)"
                value={(proj.technologies || []).join(', ')}
                onChange={(e) =>
                  handleUpdateItem(
                    index,
                    'technologies',
                    e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t('form.projectDesc')}
                value={proj.description || ''}
                onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Reorder.Item>
  );
}

/**
 * @file ProjectsForm.jsx
 * @description Form module for portfolio projects, tech stacks, and live demo links
 * with drag-and-drop reordering.
 */
export function ProjectsForm() {
  const { resumeData, updateSection } = useResume();
  const { t, locale } = useLocale();

  const projects = React.useMemo(() => {
    const list = resumeData?.projects || [];
    return list.map((item, index) => {
      if (item.id) return item;
      return { ...item, id: `proj-${index + 1}` };
    });
  }, [resumeData?.projects]);

  const handleReorder = (newOrder) => {
    updateSection('projects', newOrder);
  };

  const handleAddProject = () => {
    const newItem = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      link: '',
    };
    updateSection('projects', (prev) => [newItem, ...prev]);
  };

  const handleUpdateItem = (index, field, value) => {
    updateSection('projects', (prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveItem = (index) => {
    updateSection('projects', (prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {locale === 'tr'
            ? 'Öne çıkan projelerinizi, kullandığınız teknolojileri ve bağlantıları ekleyin. Sıralamak için tutamaçlardan sürükleyin.'
            : 'Feature your top engineering or design projects, apps, and open-source packages. Drag handles to reorder.'}
        </Typography>
        <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAddProject}>
          {t('form.addProject')}
        </Button>
      </Stack>

      <Reorder.Group
        axis="y"
        values={projects}
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
        {projects.map((proj, index) => (
          <ProjectItem
            key={proj.id || index}
            proj={proj}
            index={index}
            locale={locale}
            t={t}
            handleUpdateItem={handleUpdateItem}
            handleRemoveItem={handleRemoveItem}
          />
        ))}
      </Reorder.Group>
    </Stack>
  );
}
