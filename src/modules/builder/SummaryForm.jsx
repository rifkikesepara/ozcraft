import { Stack, TextField, Typography, Box } from '@mui/material';
import { useResume, useLocale, useAI } from '../../hooks/index.js';
import { AIEnhanceButton } from '../../components/index.js';
import { AI_PROMPTS } from '../../utils/ai/index.js';

/**
 * @file SummaryForm.jsx
 * @description Form module for the professional summary with integrated localized AI generation.
 */
export function SummaryForm() {
  const { resumeData, updateSection } = useResume();
  const { t, locale } = useLocale();
  const { openEnhanceModal } = useAI();

  const summary = resumeData?.summary || '';
  const jobTitle = resumeData?.personalInfo?.jobTitle || '';
  const allSkills = (resumeData?.skills || []).flatMap((s) => s.items).join(', ');

  const handleAIEnhance = () => {
    const isEnhancing = Boolean(summary.trim());
    const prompt = isEnhancing
      ? AI_PROMPTS.enhanceBullet(summary, 'executive', locale)
      : AI_PROMPTS.generateSummary(jobTitle || 'Professional', allSkills, '', locale);

    openEnhanceModal({
      originalText: summary || `[${t('ai.generateSummary')} - ${jobTitle || 'Professional'}]`,
      prompt,
      title: isEnhancing ? t('ai.modalTitle') : t('ai.generateSummary'),
      promptType: isEnhancing ? 'bullet' : 'summary',
      metadata: { jobTitle, skills: allSkills },
      onApply: (enhancedText) => {
        updateSection('summary', enhancedText);
      },
    });
  };

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {t('form.summaryDesc')}
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <TextField
          fullWidth
          multiline
          minRows={5}
          maxRows={20}
          placeholder={t('form.summaryPlaceholder')}
          value={summary}
          onChange={(e) => updateSection('summary', e.target.value)}
          sx={{
            '& .MuiInputBase-root': {
              pb: 6,
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            zIndex: 2,
            maxWidth: 'calc(100% - 20px)',
          }}
        >
          <AIEnhanceButton
            iconOnly={false}
            label={summary ? t('ai.button') : t('ai.generateSummary')}
            onClick={handleAIEnhance}
          />
        </Box>
      </Box>
    </Stack>
  );
}
