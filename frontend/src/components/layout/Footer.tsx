import React from 'react';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, Container, IconButton, Link, Typography, Grid, useTheme } from '@mui/material';

import BrainIconWhite from '../assets/icons/brainIconwhite';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.primary.dark,
        color: 'white',
        pt: { xs: 10, md: 12 },
        pb: { xs: 0, md: 0 },
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <BrainIconWhite sx={{ fontSize: 40, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Mindmodel
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 5, opacity: 0.8 }}>
              Empowering cognitive understanding through AI-driven assessment and personalized insights.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link 
                href="/about-us" 
                color="inherit" 
                sx={{ 
                  opacity: 0.8, 
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': { 
                    opacity: 1,
                    textDecoration: 'none'
                  }
                }}
              >
                About Us
              </Link>
              <Link 
                href="/our-approach" 
                color="inherit" 
                sx={{ 
                  opacity: 0.8, 
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': { 
                    opacity: 1,
                    textDecoration: 'none'
                  }
                }}
              >
                Our Approach
              </Link>
              <Link 
                href="/research" 
                color="inherit" 
                sx={{ 
                  opacity: 0.8, 
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': { 
                    opacity: 1,
                    textDecoration: 'none'
                  }
                }}
              >
                Research
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link 
                href="/privacy-policy" 
                color="inherit" 
                sx={{ 
                  opacity: 0.8, 
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': { 
                    opacity: 1,
                    textDecoration: 'none'
                  }
                }}
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                color="inherit" 
                sx={{ 
                  opacity: 0.8, 
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': { 
                    opacity: 1,
                    textDecoration: 'none'
                  }
                }}
              >
                Terms of Service
              </Link>
              <Link 
                href="/contact" 
                color="inherit" 
                sx={{ 
                  opacity: 0.8, 
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': { 
                    opacity: 1,
                    textDecoration: 'none'
                  }
                }}
              >
                Contact
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <IconButton 
                color="inherit" 
                sx={{ 
                  opacity: 0.8,
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': { 
                    opacity: 1 
                  }
                }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                sx={{ 
                  opacity: 0.8,
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': { 
                    opacity: 1 
                  }
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                sx={{ 
                  opacity: 0.8,
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': { 
                    opacity: 1 
                  }
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                sx={{ 
                  opacity: 0.8,
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': { 
                    opacity: 1 
                  }
                }}
              >
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ 
          borderTop: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          mt: 8,
          pt: 4,
          pb: 4,
          textAlign: 'center'
        }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Mindmodel. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
