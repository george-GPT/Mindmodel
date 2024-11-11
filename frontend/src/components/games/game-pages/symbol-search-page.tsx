import React from 'react';
import SymbolSearchGame from '../symbol-search-game';
import { Box } from '@mui/material';

const SymbolSearchPage: React.FC = () => {
  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: '#F9F9F9',
        minHeight: '100vh',
      }}
    >
      <SymbolSearchGame />
    </Box>
  );
};

export default SymbolSearchPage; 