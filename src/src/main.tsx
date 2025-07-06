import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
// Developer warning for missing API URL
if (import.meta.env.DEV && (typeof __API_URL__ === 'undefined' || !__API_URL__)) {
  // eslint-disable-next-line no-console
  console.warn('⚠️  VITE_CARGOVIZ_API_URL is missing; default endpoint in use.');
}
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);
root.render(<React.StrictMode>
    <App />
  </React.StrictMode>);