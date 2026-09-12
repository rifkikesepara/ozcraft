import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { useLocale } from '../../hooks/useLocale.js';

/**
 * @file ConfirmDialog.jsx
 * @description Accessible, stylized Material-UI confirmation modal window replacing native browser window.confirm / alerts.
 *
 * @param {object} props
 * @param {boolean} props.open - Modal visibility
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Descriptive body message
 * @param {string} [props.confirmText] - Confirm button label
 * @param {string} [props.cancelText] - Cancel button label
 * @param {'error' | 'warning' | 'primary'} [props.confirmColor='primary'] - Confirm button theme color
 * @param {React.ReactNode} [props.icon] - Optional custom icon
 * @param {() => void} props.onConfirm - Callback when confirmed
 * @param {() => void} props.onCancel - Callback when cancelled or closed
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmText,
  cancelText,
  confirmColor = 'primary',
  icon,
  onConfirm,
  onCancel,
}) {
  const { t } = useLocale();

  return (
    <Dialog
      open={Boolean(open)}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        {icon || (
          <WarningAmberRoundedIcon
            color={confirmColor === 'error' ? 'error' : 'warning'}
            sx={{ fontSize: 26 }}
          />
        )}
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1.5, gap: 1 }}>
        <Button onClick={onCancel} color="inherit" sx={{ fontWeight: 600 }}>
          {cancelText || t('common.cancel')}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          autoFocus
          sx={{ fontWeight: 600, minWidth: 90 }}
        >
          {confirmText || t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
