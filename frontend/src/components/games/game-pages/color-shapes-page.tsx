import React from 'react';
import ColorShapesGame from '../color-shapes-game';
import { Box } from '@mui/material';

const ColorShapesPage: React.FC = () => {
  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: '#F9F9F9',
        minHeight: '100vh',
      }}
    >
      <ColorShapesGame />
    </Box>
  );
};

export default ColorShapesPage;