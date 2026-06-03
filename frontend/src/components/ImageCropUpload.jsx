import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImage } from '../utils/cropImage';
import api from '../api/axios';
import { mediaUrl } from '../utils/mediaUrl';
import './ImageCropUpload.css';

export default function ImageCropUpload({
  value,
  onChange,
  aspect = 4 / 5,
  label = 'Image',
  hint = 'JPEG, PNG, or WebP',
}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onCropComplete = useCallback((_croppedArea, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleApplyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setUploading(true);
    setError('');
    try {
      const blob = await getCroppedImage(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append('image', blob, 'project.jpg');
      const res = await api.post('/upload/project', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.imageUrl);
      setImageSrc(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setImageSrc(null);
    setError('');
  };

  return (
    <div className="image-crop-upload">
      <label className="icu-label">{label}</label>

      {value && !imageSrc && (
        <div className="icu-preview">
          <img src={mediaUrl(value)} alt="" />
          <div className="icu-preview-actions">
            <label className="btn-ghost icu-change-btn">
              Change image
              <input type="file" accept="image/*" hidden onChange={onFileChange} />
            </label>
            <button type="button" className="icu-remove-btn" onClick={handleRemove}>
              Remove
            </button>
          </div>
        </div>
      )}

      {!value && !imageSrc && (
        <label className="icu-dropzone">
          <span>Click to upload an image</span>
          <small>{hint}</small>
          <input type="file" accept="image/*" hidden onChange={onFileChange} />
        </label>
      )}

      {imageSrc && (
        <div className="icu-crop-panel">
          <div className="icu-crop-area">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <label className="icu-zoom-label">
            Zoom
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </label>
          <div className="icu-crop-actions">
            <button type="button" className="btn-ghost" onClick={() => setImageSrc(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleApplyCrop}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : 'Apply crop & upload'}
            </button>
          </div>
        </div>
      )}

      {error && <p className="icu-error">{error}</p>}
    </div>
  );
}
