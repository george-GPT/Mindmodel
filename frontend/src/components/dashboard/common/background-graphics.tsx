import React from 'react';
import { Box, useTheme } from '@mui/material';
import {
  Psychology,          // Brain/thinking
  EmojiObjects,        // Creative lightbulb
  Extension,           // Puzzle piece
  Explore,             // Discovery/curiosity
  School,              // Learning
  TipsAndUpdates,      // Insights
  AutoFixHigh,         // Creative spark
  Hub,                 // Neural connections
} from '@mui/icons-material';

const BackgroundGraphics = () => {
  const theme = useTheme();

  const icons = [
    { Icon: Psychology, top: '10%', left: '5%', size: 60 },
    { Icon: EmojiObjects, top: '20%', right: '10%', size: 48 },
    { Icon: Extension, bottom: '15%', left: '15%', size: 52 },
    { Icon: Explore, top: '30%', left: '25%', size: 44 },
    { Icon: School, bottom: '25%', right: '20%', size: 56 },
    { Icon: TipsAndUpdates, top: '15%', left: '45%', size: 40 },
    { Icon: AutoFixHigh, bottom: '30%', left: '35%', size: 48 },
    { Icon: Hub, top: '25%', right: '30%', size: 52 },
  ];

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.12,  // Increased from 0.1
      }}
    >
      {icons.map(({ Icon, top, left, right, bottom, size }, index) => (
        <Icon
          key={index}
          sx={{
            position: 'absolute',
            fontSize: size,
            top,
            left,
            right,
            bottom,
            color: '#98989D',  // Apple's system gray 4 color
            transform: 'rotate(10deg)',
            transition: 'all 0.3s ease-in-out',
            animation: `float ${3 + index}s ease-in-out infinite alternate`,  // Changed back to 3s
          }}
        />
      ))}
      <style>
        {`
          @keyframes float {
            from { transform: translate(0, 0) rotate(10deg); }
            to { transform: translate(12px, 12px) rotate(15deg); }  // Increased from 10px to 12px
          }
        `}
      </style>
    </Box>
  );
};

export default BackgroundGraphics; 