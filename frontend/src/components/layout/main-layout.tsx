import React from 'react';
import { Box } from '@mui/material';
import Header from './header';
import Footer from './footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: theme => theme.palette.background.default,
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          bgcolor: 'background.default',
          backgroundImage: theme => 
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.paper})`,
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout; 