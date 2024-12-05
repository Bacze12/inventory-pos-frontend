import React from 'react';

export function ThemeProvider({ children }) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {children}
    </div>
  );
}
