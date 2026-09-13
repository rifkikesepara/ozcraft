import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage, EditorPage, TemplatesPage, SettingsPage } from '../pages/index.js';

/**
 * @file AppRoutes.jsx
 * @description Centralized React Router route configuration.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
