import { useRef } from 'react';
import {
  Stack,
  TextField,
  Typography,
  Avatar,
  Button,
  FormControlLabel,
  Switch,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Paper,
  alpha,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useResume, useLocale } from '../../hooks/index.js';

/**
 * @file PersonalInfoForm.jsx
 * @description Form module for personal contact details and photo management.
 * Includes client-side photo resizing to base64, shape controls, and visibility toggles.
 */
export function PersonalInfoForm() {
  const { resumeData, updateSection } = useResume();
  const { t } = useLocale();
  const fileInputRef = useRef(null);

  const personalInfo = resumeData?.personalInfo || {};

  const handleChange = (field, value) => {
    updateSection('personalInfo', (prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handles photo file selection and compresses to a lightweight base64 string.
   */
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        handleChange('avatar', dataUrl);
        handleChange('showPhoto', true);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    handleChange('avatar', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getBorderRadius = () => {
    if (personalInfo.avatarShape === 'square') return '4px';
    if (personalInfo.avatarShape === 'rounded') return '14px';
    return '50%';
  };

  return (
    <Stack sx={{ gap: 3, width: '100%', alignItems: 'stretch' }}>
      {/* Profile Photo Section */}
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 2.5,
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { md: 'flex-start', xs: 'center' },
          gap: 3,
        }}
      >
        <Avatar
          src={personalInfo.avatar}
          alt={personalInfo.fullName}
          sx={{
            width: 80,
            height: 80,
            borderRadius: getBorderRadius(),
            border: (theme) => `2px solid ${theme.palette.primary.main}`,
            boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
          }}
        />

        <Stack
          sx={{ flex: 1, gap: 1, alignItems: { md: 'flex-start', xs: 'center' }, width: '100%' }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {t('form.photo')}
          </Typography>

          <Stack
            direction="row"
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              alignItems: { md: 'flex-start', xs: 'center' },
              justifyContent: 'center',
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/webp"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
            >
              {t('form.uploadPhoto')}
            </Button>

            {personalInfo.avatar && (
              <Button
                variant="text"
                color="error"
                size="small"
                startIcon={<DeleteOutlinedIcon />}
                onClick={handleRemovePhoto}
              >
                {t('form.removePhoto')}
              </Button>
            )}

            <ToggleButtonGroup
              size="small"
              exclusive
              value={personalInfo.avatarShape || 'circle'}
              onChange={(_, val) => val && handleChange('avatarShape', val)}
            >
              <ToggleButton value="circle">{t('form.shapeCircle')}</ToggleButton>
              <ToggleButton value="rounded">{t('form.shapeRounded')}</ToggleButton>
              <ToggleButton value="square">{t('form.shapeSquare')}</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={Boolean(personalInfo.showPhoto)}
                onChange={(e) => handleChange('showPhoto', e.target.checked)}
              />
            }
            label={<Typography variant="caption">{t('form.showPhoto')}</Typography>}
          />
        </Stack>
      </Paper>

      {/* Inputs Grid */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label={t('form.fullName')}
            value={personalInfo.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label={t('form.jobTitle')}
            value={personalInfo.jobTitle || ''}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label={t('form.email')}
            type="email"
            value={personalInfo.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label={t('form.phone')}
            value={personalInfo.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label={t('form.location')}
            value={personalInfo.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label={t('form.website')}
            value={personalInfo.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label={t('form.linkedin')}
            value={personalInfo.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label={t('form.github')}
            value={personalInfo.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
