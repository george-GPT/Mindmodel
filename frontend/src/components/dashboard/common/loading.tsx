// src/components/Common/Loading.tsx

import React from 'react';

import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import logo from '../assets/logo.png';

const LoaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const Loading: React.FC = () => {
  return (
    <LoaderContainer>
      {/* Optional: Add an icon or logo */}
      {/* <Box mb={2}>
        <brainIconPurple />
      </Box> */}
      <CircularProgress size={80} sx={{ color: '#3442DA' }} />
      <Typography variant="h6" sx={{ marginTop: 2, color: '#3442DA' }}>
        Loading, please wait...
      </Typography>
    </LoaderContainer>
  );
};

export default Loading;
