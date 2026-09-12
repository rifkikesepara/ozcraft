import React from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { useResume } from '../../hooks/useResume.js';
import { useLocale } from '../../hooks/useLocale.js';
import { useAI } from '../../hooks/useAI.js';
import { AIEnhanceButton } from '../../components/ai/AIEnhanceButton.jsx';
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
      title: isEnhancing
        ? t('ai.modalTitle') || 'Enhance Professional Summary'
        : t('ai.generateSummary') || 'Generate Summary with AI',
      promptType: isEnhancing ? 'bullet' : 'summary',
      metadata: { jobTitle, skills: allSkills },
      onApply: (enhancedText) => {
        updateSection('summary', enhancedText);
      },
    });
  };

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 1.5,
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {locale === 'tr'
            ? 'Geçmişinizin, temel yetkinliklerinizin ve kattığınız değerin 3-4 cümlelik kısa bir özetini oluşturun.'
            : 'Craft a concise 3-4 sentence overview of your background, core strengths, and value proposition.'}
        </Typography>
        <AIEnhanceButton
          iconOnly={false}
          label={summary ? t('ai.button') : t('ai.generateSummary')}
          onClick={handleAIEnhance}
        />
      </Stack>

      <TextField
        fullWidth
        multiline
        minRows={5}
        maxRows={20}
        placeholder={
          locale === 'tr'
            ? 'Örn: 7+ yıllık deneyime sahip, ölçeklenebilir mikroservisler tasarlayan ve yüksek performanslı takımlara liderlik eden Sonuç Odaklı Kıdemli Yazılım Mühendisi...'
            : 'e.g. Results-driven Senior Software Engineer with 7+ years of expertise designing scalable microservices and leading high-performing teams...'
        }
        value={summary}
        onChange={(e) => updateSection('summary', e.target.value)}
      />
    </Stack>
  );
}
