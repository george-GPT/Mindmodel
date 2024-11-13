// src/App.tsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import ErrorBoundary from './components/dashboard/common/error-boundary';
import MainLayout from './components/layout/main-layout';
import AppRoutes from './routes/routes';
import theme from './theme/theme';
import './styles/animations.css';

const App: React.FC = () => {
  // Favicon setup effect
  useEffect(() => {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) {
      favicon.href = '/favicon.png';
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = '/favicon.png';
      document.head.appendChild(newFavicon);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
