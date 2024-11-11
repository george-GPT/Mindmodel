import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  subtitle, 
  children, 
  maxWidth = 'lg' 
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.paper})`,
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth={maxWidth}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: 'primary.dark',
              mb: subtitle ? 3 : 0,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="h5" 
              color="text.secondary"
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {children}
      </Container>
    </Box>
  );
};

export default PageLayout; 