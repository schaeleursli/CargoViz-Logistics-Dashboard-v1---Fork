import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import { App } from './App';
// Developer warning for missing API URL using more reliable check
const isDevelopment = process.env.NODE_ENV === 'development';
const apiUrl = typeof __API_URL__ !== 'undefined' ? __API_URL__ : null;
if (isDevelopment && !apiUrl) {
  // eslint-disable-next-line no-console
  console.warn('⚠️  __API_URL__ is empty – check VITE_CARGOVIZ_API_URL in .env.local');
}
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);
root.render(<React.StrictMode>
    <App />
  </React.StrictMode>);