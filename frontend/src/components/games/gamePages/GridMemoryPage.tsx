import React from 'react';
import GridMemoryGame from '../GridMemoryGame';
import { Box } from '@mui/material';

const GridMemoryPage: React.FC = () => {
  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: '#F9F9F9',
        minHeight: '100vh',
      }}
    >
      <GridMemoryGame />
    </Box>
  );
};

export default GridMemoryPage; 