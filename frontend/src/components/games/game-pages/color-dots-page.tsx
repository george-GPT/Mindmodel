import React from 'react';
import ColorDotsGame from '../color-dots-game';
import { Box } from '@mui/material';

const ColorDotsPage: React.FC = () => {
  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: '#F9F9F9',
        minHeight: '100vh',
      }}
    >
      <ColorDotsGame />
    </Box>
  );
};

export default ColorDotsPage;