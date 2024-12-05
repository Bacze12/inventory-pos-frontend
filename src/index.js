import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './components/ui/theme-provider';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ErrorBoundary>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ErrorBoundary>
);