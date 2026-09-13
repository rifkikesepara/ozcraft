import { useState } from 'react';
import {
  Stack,
  Paper,
  Tabs,
  Tab,
  Button,
  Tooltip,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import CodeIcon from '@mui/icons-material/Code';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { motion, AnimatePresence } from 'framer-motion';

import { useResume, useLocale } from '../../hooks/index.js';

import { PersonalInfoForm } from './PersonalInfoForm.jsx';
import { SummaryForm } from './SummaryForm.jsx';
import { ExperienceForm } from './ExperienceForm.jsx';
import { EducationForm } from './EducationForm.jsx';
import { SkillsForm } from './SkillsForm.jsx';
import { ProjectsForm } from './ProjectsForm.jsx';
import { CertificationsForm } from './CertificationsForm.jsx';
import { LanguagesForm } from './LanguagesForm.jsx';
import { ReferencesForm } from './ReferencesForm.jsx';
import { SectionOrderModal } from './SectionOrderModal.jsx';

/**
 * @file ResumeBuilder.jsx
 * @description Accordion and tabs-driven builder interface hosting modular sub-forms
 * with drag-and-drop section reordering capability.
 */
export function ResumeBuilder() {
  const { resumeData } = useResume();
  const { locale, t } = useLocale();
  const [activeTab, setActiveTab] = useState(0);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  const sectionOrder = resumeData?.sectionOrder || [
    'personalInfo',
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'languages',
    'references',
  ];

  // Map of available sections
  const sectionComponents = {
    personalInfo: {
      label: t('builder.personalInfo'),
      icon: <PersonOutlinedIcon fontSize="small" />,
      component: <PersonalInfoForm />,
    },
    summary: {
      label: t('builder.summary'),
      icon: <DescriptionOutlinedIcon fontSize="small" />,
      component: <SummaryForm />,
    },
    experience: {
      label: t('builder.experience'),
      icon: <WorkOutlinedIcon fontSize="small" />,
      component: <ExperienceForm />,
    },
    education: {
      label: t('builder.education'),
      icon: <SchoolOutlinedIcon fontSize="small" />,
      component: <EducationForm />,
    },
    skills: {
      label: t('builder.skills'),
      icon: <BuildOutlinedIcon fontSize="small" />,
      component: <SkillsForm />,
    },
    projects: {
      label: t('builder.projects'),
      icon: <CodeIcon fontSize="small" />,
      component: <ProjectsForm />,
    },
    certifications: {
      label: t('builder.certifications'),
      icon: <CardMembershipOutlinedIcon fontSize="small" />,
      component: <CertificationsForm />,
    },
    languages: {
      label: t('builder.languages'),
      icon: <TranslateOutlinedIcon fontSize="small" />,
      component: <LanguagesForm />,
    },
    references: {
      label: t('builder.references'),
      icon: <ContactMailOutlinedIcon fontSize="small" />,
      component: <ReferencesForm />,
    },
  };

  // Personal Info is always the primary first tab; remaining tabs follow dynamic sectionOrder
  const reorderableTabs = sectionOrder
    .filter((key) => key !== 'personalInfo')
    .map((key) => sectionComponents[key])
    .filter(Boolean);

  const tabs = [sectionComponents.personalInfo, ...reorderableTabs];
  const safeActiveTab = Math.min(activeTab, Math.max(0, tabs.length - 1));

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Mobile-Friendly Section Switcher Toolbar (< md) - Selectbox Only */}
      <Stack
        direction="row"
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          gap: 1,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.default',
          p: 1.25,
        }}
      >
        <FormControl size="small" sx={{ flex: 1, minWidth: 0 }}>
          <Select
            value={safeActiveTab}
            onChange={(e) => setActiveTab(Number(e.target.value))}
            renderValue={(selected) => {
              const selectedTab = tabs[selected];
              if (!selectedTab) return null;
              return (
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                  <Stack direction="row" sx={{ color: 'primary.main' }}>
                    {selectedTab.icon}
                  </Stack>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedTab.label}
                  </Typography>
                </Stack>
              );
            }}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '0.85rem',
              backgroundColor: 'background.paper',
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 0.85,
              },
            }}
          >
            {tabs.map((tab, idx) => (
              <MenuItem
                key={idx}
                value={idx}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1.2,
                  fontWeight: activeTab === idx ? 700 : 500,
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    color: activeTab === idx ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {tab.icon}
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 'inherit', flex: 1 }}>
                  {tab.label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                  {idx + 1}/{tabs.length}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Previous Section Button */}
        <Tooltip title={locale === 'tr' ? 'Önceki Bölüm' : 'Previous Section'} arrow>
          <IconButton
            size="small"
            disabled={activeTab === 0}
            onClick={() => setActiveTab((prev) => Math.max(0, prev - 1))}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              width: 38,
              height: 38,
              backgroundColor: 'background.paper',
              color: 'text.primary',
            }}
            aria-label="previous section"
          >
            <NavigateBeforeIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Next Section Button */}
        <Tooltip title={locale === 'tr' ? 'Sonraki Bölüm' : 'Next Section'} arrow>
          <IconButton
            size="small"
            disabled={activeTab === tabs.length - 1}
            onClick={() => setActiveTab((prev) => Math.min(tabs.length - 1, prev + 1))}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              width: 38,
              height: 38,
              backgroundColor: 'background.paper',
              color: 'text.primary',
            }}
            aria-label="next section"
          >
            <NavigateNextIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Section Reorder Modal Trigger */}
        <Tooltip title={t('builder.reorderSections')} arrow>
          <IconButton
            size="small"
            onClick={() => setIsReorderOpen(true)}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              width: 38,
              height: 38,
              backgroundColor: 'background.paper',
              color: 'primary.main',
            }}
            aria-label="reorder sections"
          >
            <SwapVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Desktop Section Tabs Header (>= md) */}
      <Stack
        direction="row"
        sx={{
          display: { xs: 'none', md: 'flex' },
          borderBottom: 1,
          borderColor: 'divider',
          px: 2,
          pt: 1,
          backgroundColor: 'background.default',
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: 0,
        }}
      >
        <Tabs
          value={safeActiveTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 48,
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              gap: 1,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
              },
              '& .MuiSvgIcon-root': {
                color: 'inherit',
              },
            },
            '& .MuiTabs-scrollButtons': {
              color: 'text.primary',
            },
          }}
        >
          {tabs.map((tab, idx) => (
            <Tab key={idx} label={tab.label} icon={tab.icon} iconPosition="start" />
          ))}
        </Tabs>

        {/* Drag & Drop Reorder Button */}
        <Tooltip title={t('builder.dragToReorder')} arrow>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsReorderOpen(true)}
            startIcon={<SwapVertIcon />}
            sx={{
              ml: 1.5,
              whiteSpace: 'nowrap',
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '0.78rem',
              height: 34,
              flexShrink: 0,
            }}
          >
            {t('builder.reorderSections')}
          </Button>
        </Tooltip>
      </Stack>

      {/* Form Content Area with Smooth Animation */}
      <Stack
        sx={{
          p: { xs: 2, sm: 3, md: 3.5 },
          flex: 1,
          overflowY: 'auto',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
            }}
          >
            {tabs[safeActiveTab]?.component}
          </motion.div>
        </AnimatePresence>
      </Stack>

      {/* Drag and Drop Section Reorder Modal */}
      <SectionOrderModal open={isReorderOpen} onClose={() => setIsReorderOpen(false)} />
    </Paper>
  );
}
