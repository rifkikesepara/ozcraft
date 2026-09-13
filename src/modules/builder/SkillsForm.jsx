import React, { useState } from 'react';
import {
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
  Chip,
  Paper,
  alpha,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Reorder, useDragControls } from 'framer-motion';

import { useResume, useLocale, useAI, useThemeMode } from '../../hooks/index.js';
import { AIEnhanceButton } from '../../components/index.js';
import { AI_PROMPTS } from '../../utils/ai/index.js';

/**
 * Individual skill category with drag handle.
 */
function SkillCategoryItem({
  cat,
  catIndex,
  handleUpdateCategoryName,
  handleAISuggestSkills,
  handleRemoveCategory,
  handleRemoveSkillItem,
  handleReorderChips,
  newSkillInput,
  setNewSkillInput,
  handleAddSkillItem,
}) {
  const dragControls = useDragControls();
  const { isMobile } = useThemeMode();
  const { t, locale } = useLocale();

  return (
    <Reorder.Item
      value={cat}
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
        <Stack direction={'row'} sx={{ alignItems: 'center', gap: 1.5 }}>
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
            title={locale === 'tr' ? 'Kategoriyi sürükleyin' : 'Drag category to reorder'}
          >
            <DragIndicatorIcon fontSize="small" />
          </Stack>

          <TextField
            size="small"
            placeholder={
              locale === 'tr'
                ? 'Kategori Adı (Örn: Programlama Dilleri, Bulut & DevOps)'
                : 'Category Name (e.g. Core Languages, Cloud & DevOps)'
            }
            value={cat.category}
            onChange={(e) => handleUpdateCategoryName(catIndex, e.target.value)}
            sx={{ flex: 1 }}
          />
          <AIEnhanceButton
            iconOnly={isMobile}
            label={t('ai.suggestSkills')}
            onClick={() => handleAISuggestSkills(catIndex)}
          />
          <IconButton size="small" color="error" onClick={() => handleRemoveCategory(catIndex)}>
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Reorderable Chips List */}
        <Reorder.Group
          axis="x"
          values={cat.items || []}
          onReorder={(newItems) => handleReorderChips(catIndex, newItems)}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            minHeight: 32,
            alignItems: 'center',
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}
        >
          {(cat.items || []).map((item, itemIdx) => (
            <Reorder.Item
              key={item + '-' + itemIdx}
              value={item}
              whileDrag={{
                scale: 1.08,
                zIndex: 20,
                borderRadius: '8px',
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`,
              }}
              style={{ listStyle: 'none', cursor: 'grab', borderRadius: '8px' }}
            >
              <Chip
                label={item}
                onDelete={() => handleRemoveSkillItem(catIndex, item)}
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  borderRadius: '8px',
                  cursor: 'grab',
                  '&:active': { cursor: 'grabbing' },
                }}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* Add skill input */}
        <Stack direction="row" sx={{ gap: 1 }}>
          <TextField
            size="small"
            placeholder={t('form.skillItems')}
            value={newSkillInput[catIndex] || ''}
            onChange={(e) => setNewSkillInput((prev) => ({ ...prev, [catIndex]: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkillItem(catIndex);
              }
            }}
            sx={{ flex: 1 }}
          />
          <Button variant="contained" size="small" onClick={() => handleAddSkillItem(catIndex)}>
            {t('common.add')}
          </Button>
        </Stack>
      </Paper>
    </Reorder.Item>
  );
}

/**
 * @file SkillsForm.jsx
 * @description Form module for categorizing skills with interactive chips, localized AI skill suggestions,
 * and drag-and-drop reordering for both categories and skills.
 */
export function SkillsForm() {
  const [newSkillInput, setNewSkillInput] = useState({});

  const { resumeData, updateSection } = useResume();
  const { t, locale } = useLocale();
  const { openEnhanceModal } = useAI();

  const skills = React.useMemo(() => {
    const list = resumeData?.skills || [];
    return list.map((cat, idx) => {
      if (cat.id) return cat;
      return { ...cat, id: `skill-${idx + 1}` };
    });
  }, [resumeData?.skills]);

  const targetRole =
    resumeData?.personalInfo?.jobTitle ||
    (locale === 'tr' ? 'Yazılım Mühendisi' : 'Software Engineer');

  const handleReorderCategories = (newOrder) => {
    updateSection('skills', newOrder);
  };

  const handleReorderChips = (catIndex, newItems) => {
    updateSection('skills', (prev) => {
      const copy = [...prev];
      copy[catIndex] = { ...copy[catIndex], items: newItems };
      return copy;
    });
  };

  const handleAddCategory = () => {
    const newCategory = {
      id: `skill-${Date.now()}`,
      category: '',
      items: [],
    };
    updateSection('skills', (prev) => [...prev, newCategory]);
  };

  const handleRemoveCategory = (catIndex) => {
    updateSection('skills', (prev) => prev.filter((_, i) => i !== catIndex));
  };

  const handleUpdateCategoryName = (catIndex, name) => {
    updateSection('skills', (prev) => {
      const copy = [...prev];
      copy[catIndex] = { ...copy[catIndex], category: name };
      return copy;
    });
  };

  const handleAddSkillItem = (catIndex) => {
    const text = (newSkillInput[catIndex] || '').trim();
    if (!text) return;

    updateSection('skills', (prev) => {
      const copy = [...prev];
      const existing = copy[catIndex].items || [];
      if (!existing.includes(text)) {
        copy[catIndex] = {
          ...copy[catIndex],
          items: [...existing, text],
        };
      }
      return copy;
    });

    setNewSkillInput((prev) => ({ ...prev, [catIndex]: '' }));
  };

  const handleRemoveSkillItem = (catIndex, skillToRemove) => {
    updateSection('skills', (prev) => {
      const copy = [...prev];
      copy[catIndex] = {
        ...copy[catIndex],
        items: copy[catIndex].items.filter((s) => s !== skillToRemove),
      };
      return copy;
    });
  };

  const handleAISuggestSkills = (catIndex) => {
    openEnhanceModal({
      originalText: `Role: ${targetRole}`,
      prompt: AI_PROMPTS.suggestSkills(targetRole, locale),
      title: `${t('ai.suggestSkills')} (${targetRole})`,
      promptType: 'skills',
      metadata: { role: targetRole },
      onApply: (csvString) => {
        const parsed = csvString
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        updateSection('skills', (prev) => {
          const copy = [...prev];
          const existing = copy[catIndex]?.items || [];
          const combined = Array.from(new Set([...existing, ...parsed]));
          copy[catIndex] = { ...copy[catIndex], items: combined };
          return copy;
        });
      },
    });
  };

  return (
    <Stack sx={{ gap: 2.5 }}>
      <Stack
        direction={{ md: 'row', xs: 'column' }}
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {locale === 'tr'
            ? 'Teknik yetkinliklerinizi ve sosyal becerilerinizi net kategoriler altında düzenleyin. Kategorileri ve yetenekleri sürükleyerek sıralayabilirsiniz.'
            : 'Organize your technical competencies and soft skills into clear categories. Drag handles to reorder categories or chips.'}
        </Typography>
        <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAddCategory}>
          {t('common.add')}
        </Button>
      </Stack>

      <Reorder.Group
        axis="y"
        values={skills}
        onReorder={handleReorderCategories}
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {skills.map((cat, catIndex) => (
          <SkillCategoryItem
            key={cat.id || catIndex}
            cat={cat}
            catIndex={catIndex}
            handleUpdateCategoryName={handleUpdateCategoryName}
            handleAISuggestSkills={handleAISuggestSkills}
            handleRemoveCategory={handleRemoveCategory}
            handleRemoveSkillItem={handleRemoveSkillItem}
            handleReorderChips={handleReorderChips}
            newSkillInput={newSkillInput}
            setNewSkillInput={setNewSkillInput}
            handleAddSkillItem={handleAddSkillItem}
          />
        ))}
      </Reorder.Group>
    </Stack>
  );
}
