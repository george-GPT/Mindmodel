import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid,
  useTheme
} from '@mui/material';
import { 
  Psychology,
  AccountTree as Hub,
  TrendingUp,
  Memory,
  Visibility,
  Speed,
  Language as LanguageIcon,
  Assignment,
  AccessibilityNew,
  Folder,
  Settings,
  Create,
  Shuffle,
  PersonOutline,
  Groups,
  Bolt,
  RemoveRedEye,
  Hearing,
  DirectionsRun,
  School,
  Construction,
  Lightbulb,
  Security,
  Analytics,
} from '@mui/icons-material';

const OurApproachPage = () => {
  const theme = useTheme();

  const cognitiveItems = [
    { icon: <Memory />, text: "Memory" },
    { icon: <Visibility />, text: "Attention" },
    { icon: <Speed />, text: "Processing Speed" },
    { icon: <Psychology />, text: "Reasoning Skills" },
    { icon: <LanguageIcon />, text: "Language Skills" },
    { icon: <Assignment />, text: "Executive Functioning" },
    { icon: <AccessibilityNew />, text: "Perceptual-Motor" },
  ];

  const learningItems = [
    { icon: <Folder />, text: "Structured" },
    { icon: <Settings />, text: "Methodical" },
    { icon: <Create />, text: "Creative" },
    { icon: <Shuffle />, text: "Flexible" },
    { icon: <PersonOutline />, text: "Independent" },
    { icon: <Groups />, text: "Collaborative" },
    { icon: <Bolt />, text: "Spontaneous" },
  ];

  const workingItems = [
    { icon: <RemoveRedEye />, text: "Visual" },
    { icon: <Hearing />, text: "Auditory" },
    { icon: <DirectionsRun />, text: "Kinesthetic" },
    { icon: <School />, text: "Experiential" },
    { icon: <Assignment />, text: "Instructional" },
    { icon: <Construction />, text: "Logical" },
    { icon: <Lightbulb />, text: "Intuitive" },
  ];

  return (
    <Box>
      {/* Enhanced Hero Section */}
      <Box
        sx={{
          background: theme.palette.primary.dark,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 12, md: 16 },
          pb: { xs: 14, md: 18 },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={10} sx={{ mx: 'auto' }}>
              <Typography 
                variant="h1"
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 4,
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                Understanding Your Mind
              </Typography>
              
              <Typography 
                variant="h5"
                sx={{ 
                  fontWeight: 400,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: '800px',
                  lineHeight: 1.8,
                  mx: 'auto',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                We believe every mind is unique, shaped by countless experiences and patterns. 
                Our approach celebrates this individuality, using advanced technology to illuminate 
                the diverse ways your mind works, learns, and grows.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Bridge Section with staggered layout */}
      <Box 
        sx={{ 
          py: { xs: 10, md: 16 },
          background: theme.palette.primary.dark,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={16}>
            {/* Understanding Your Mind's Unique Blueprint - Left Side, Top Position */}
            <Grid item xs={12} md={6} sx={{ mt: { md: 0 } }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  mb: 6,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                What We Offer
              </Typography>
              
              {/* Blueprint items */}
              {[
                {
                  title: "Interactive Surveys",
                  description: "Complete engaging questionnaires designed to map your cognitive patterns and preferences.",
                  icon: <Assignment sx={{ fontSize: 32 }} />,
                },
                {
                  title: "Cognitive Games",
                  description: "Play through scientifically designed games that measure different aspects of your thinking.",
                  icon: <Psychology sx={{ fontSize: 32 }} />,
                },
                {
                  title: "AI Insight",
                  description: "Receive personalized analysis and recommendations powered by advanced machine learning.",
                  icon: <Analytics sx={{ fontSize: 32 }} />,
                },
              ].map((item, index) => (
                <Box 
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 3,
                    mb: 4,
                  }}
                >
                  <Box 
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      flexShrink: 0,
                    }}
                  >
                    {React.cloneElement(item.icon, { 
                      sx: { 
                        fontSize: 32, 
                        color: 'white',
                      }
                    })}
                  </Box>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        mb: 0.5,
                        color: 'white',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>

            {/* What We Offer - Right Side, Lower Position */}
            <Grid item xs={12} md={6} sx={{ mt: { md: 20 } }}>  {/* Added margin top for staggered effect */}
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 700,
                  mb: 4,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: 'white',
                }}
              >
                Our Benefits
              </Typography>
              
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}>
                {[
                  {
                    title: "Personal Growth",
                    content: "Gain valuable insights to enhance your cognitive abilities and performance.",
                    icon: <Lightbulb sx={{ fontSize: 40 }} />
                  },
                  {
                    title: "Engaging Experience",
                    content: "Interactive games and surveys designed to be both informative and enjoyable.",
                    icon: <Speed sx={{ fontSize: 40 }} />
                  },
                  {
                    title: "Secure & Private",
                    content: "Your data is protected with enterprise-grade security and encryption.",
                    icon: <Security sx={{ fontSize: 40 }} />
                  }
                ].map((benefit, index) => (
                  <Box 
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    <Box 
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        flexShrink: 0,
                      }}
                    >
                      {React.cloneElement(benefit.icon, { 
                        sx: { 
                          fontSize: 32, 
                          color: 'white'
                        }
                      })}
                    </Box>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 0.5,
                          color: 'white',
                        }}
                      >
                        {benefit.title}
                      </Typography>
                      <Typography 
                        sx={{ 
                          fontSize: '1rem',
                          lineHeight: 1.6,
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {benefit.content}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default OurApproachPage;