// src/App.tsx

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import ErrorBoundary from './components/common/errorBoundary';
import Loading from './components/common/Loading';
import MainLayout from './components/Layout/MainLayout';
import AppRoutes from './routes/Routes';
import { persistor, store } from './store/store';
import theme from './theme/theme';
import './styles/animations.css';

const App: React.FC = () => {
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
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  );
};

export default App;
