import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  Typography,
  Box,
} from '@mui/material';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage.js';

export function ImageCropperModal({ open, imageSrc, onClose, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Fotoğrafı Kırp</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: 'relative', width: '100%', height: 400, background: '#333' }}>
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} // 1:1 aspect ratio, square/circle
              onCropChange={setCrop}
              onCropComplete={onCropCompleteHandler}
              onZoomChange={setZoom}
            />
          )}
        </Box>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>Yakınlaştır</Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e, zoom) => setZoom(zoom)}
            sx={{ flex: 1 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          İptal
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Uygula
        </Button>
      </DialogActions>
    </Dialog>
  );
}
