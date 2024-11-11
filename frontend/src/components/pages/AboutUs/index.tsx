import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { 
  EmojiObjects as InsightIcon,
  Psychology as BrainIcon,
  School as LearningIcon,
  Extension as ProblemSolvingIcon,
  Explore as CuriosityIcon,
  Visibility as PerceptionIcon,
  AutoFixHigh as CreativeIcon,
  FitnessCenter as FocusIcon,
  AccountTree as ConnectionsIcon,
  Biotech as ScienceIcon,
  Analytics,
  AutoGraph,
  TrendingUp,
} from '@mui/icons-material';

const AboutUsPage = () => {
  const sections = [
    {
      title: "Innovative Integration",
      content: "We unite established cognitive science with advanced AI technology, creating a unique platform that provides deeper insights than traditional methods alone could achieve.",
      icon: <ConnectionsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: "Growth-Focused Approach",
      content: "Our mission extends beyond assessment - we empower individuals with self-understanding and actionable strategies for personal development and cognitive enhancement.",
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: "Educational Foundation",
      content: "Developed by experts in cognitive psychology, neuroscience, and machine learning, ensuring a robust scientific foundation for all our assessments.",
      icon: <LearningIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      icon: <BrainIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Cognitive Assessment",
      content: "Discover your unique cognitive patterns through scientifically designed assessments and engaging interactive games."
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "AI-Powered Analysis",
      content: "Advanced machine learning algorithms analyze your performance to provide personalized insights and recommendations."
    },
    {
      icon: <AutoGraph sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Performance Tracking",
      content: "Monitor your cognitive development with detailed analytics and track your progress over time."
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: 'primary.dark',
            mb: 3
          }}
        >
          About Mindmodel
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary"
          sx={{ 
            maxWidth: '800px', 
            mx: 'auto', 
            mb: 6,
            lineHeight: 1.6
          }}
        >
          Mindmodel provides research-backed cognitive assessments and AI-driven insights to help individuals and organizations unlock their full potential. Our platform delivers personalized strategies for enhanced cognitive performance and professional growth.
        </Typography>
      </Box>

      {/* All Sections in Grid */}
      <Grid container spacing={4} sx={{ mb: 12 }}>
        {sections.map((section, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[4],
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {section.icon}
                <Box>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {section.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {section.content}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Vision Section - Updated spacing */}
      <Box sx={{ textAlign: 'center', mt: 12, mb: 12 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Our Vision
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.8 }}
        >
          We envision a future where everyone has access to advanced cognitive assessment tools 
          and personalized insights, enabling them to better understand and optimize their mental 
          capabilities. Through continuous innovation and research, we strive to make this vision 
          a reality.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUsPage;