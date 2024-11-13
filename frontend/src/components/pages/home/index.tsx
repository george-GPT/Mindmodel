import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  Psychology,
  Speed,
  Analytics,
  AutoGraph,
  Lightbulb,
  Security,
  School,
  AccountTree,
  Memory,
  Visibility,
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
  Construction,
  Language as LanguageIcon,
} from '@mui/icons-material';

import { RootState } from '../../../store/store';
import BrainIcon from '../../assets/icons/brainIconwhite';
import BackgroundGraphics from '../../dashboard/common/background-graphics';
import PuzzleImage from '../../assets/images/puzzle.png';
import VisionImage from '../../assets/images/vision.png';
import ProcessImage from '../../assets/images/process.png';
import LogoText from '../../assets/images/logo_text.svg';
import PuzzleIcon from '../../assets/icons/flaticon/puzzle.svg';
import ProcessIcon from '../../assets/icons/process.svg';
import IdeaIcon from '../../assets/icons/idea.svg';
import VisionIcon from '../../assets/icons/vision.svg';
import InnovationIcon from '../../assets/icons/innovation.svg';
import SolutionIcon from '../../assets/icons/solution.svg';
import BrainFlatIcon from '../../assets/icons/flaticon/brain.svg';
import CreativityIcon from '../../assets/icons/flaticon/creativity.svg';
import NeuralIcon from '../../assets/icons/flaticon/neural.svg';
import ArtificialIntelligenceIcon from '../../assets/icons/flaticon/artificial-intelligence.svg';
import DiagramIcon from '../../assets/icons/flaticon/diagram.svg';
import GoalIcon from '../../assets/icons/flaticon/goal.svg';
import KnowledgeIcon from '../../assets/icons/flaticon/knowledge.svg';
import ScholarshipIcon from '../../assets/icons/flaticon/scholarship.svg';

export const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Cognitive Assessment",
      description: "Discover your unique cognitive patterns through scientifically designed assessments and engaging interactive games."
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your performance to provide personalized insights and recommendations."
    },
    {
      icon: <AutoGraph sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Performance Tracking",
      description: "Monitor your cognitive development with detailed analytics and track your progress over time."
    }
  ];

  const assessmentTypes = [
    {
      icon: PuzzleImage,
      title: "Cognitive Profile",
      description: "Understand your unique mental strengths and natural thinking patterns.",
      alt: "Puzzle pieces representing cognitive connections"
    },
    {
      icon: VisionImage,
      title: "Learning Style",
      description: "Discover how you naturally absorb and process new information.",
      alt: "Vision diagram representing learning pathways"
    },
    {
      icon: ProcessImage,
      title: "Working Style",
      description: "Reveal your natural approach to problem-solving and decision-making.",
      alt: "Process flow representing work patterns"
    }
  ];

  const HeroSection = () => (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 14, md: 16 },
        pb: { xs: 14, md: 16 },
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.08,
          zIndex: 0,
          '& img': {
            position: 'absolute',
            opacity: 0.7,
            transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
            filter: 'grayscale(100%)',
            '&:hover': {
              opacity: 0.9,
              transform: 'scale(1.1) rotate(5deg)',
            }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.main, 0.05)} 0%, 
              ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            zIndex: -1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '120%',
            background: `radial-gradient(circle, 
              ${alpha(theme.palette.background.paper, 0)} 0%, 
              ${alpha(theme.palette.background.paper, 0.1)} 100%)`,
            zIndex: -2,
          }
        }}
      >
        <img 
          src={PuzzleIcon} 
          alt=""
          style={{
            position: 'absolute',
            top: '8%',
            left: '8%',
            width: '80px',
            transform: 'rotate(-15deg)',
            animation: 'float 4s ease-in-out infinite',
            animationDelay: '0s',
          }}
        />
        <img 
          src={BrainFlatIcon} 
          alt=""
          style={{
            position: 'absolute',
            top: '12%',
            right: '12%',
            width: '70px',
            transform: 'rotate(15deg)',
            animation: 'float 4.5s ease-in-out infinite',
            animationDelay: '0.5s',
          }}
        />
        <img 
          src={CreativityIcon} 
          alt=""
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '18%',
            width: '65px',
            transform: 'rotate(-10deg)',
            animation: 'float 3.5s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />
        <img 
          src={IdeaIcon} 
          alt=""
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '75px',
            transform: 'rotate(12deg)',
            animation: 'float 4s ease-in-out infinite',
            animationDelay: '1.5s',
          }}
        />
        <img 
          src={ProcessIcon} 
          alt=""
          style={{
            position: 'absolute',
            top: '45%',
            left: '5%',
            width: '60px',
            transform: 'rotate(-8deg)',
            animation: 'float 3.8s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />
        <img 
          src={InnovationIcon} 
          alt=""
          style={{
            position: 'absolute',
            top: '30%',
            right: '8%',
            width: '70px',
            transform: 'rotate(15deg)',
            animation: 'float 4.2s ease-in-out infinite',
            animationDelay: '1.2s',
          }}
        />
        
        <img 
          src={DiagramIcon} 
          alt=""
          style={{
            top: '28%',
            right: '28%',
            width: '65px',
            transform: 'rotate(-15deg)',
            animation: 'float 9s ease-in-out infinite',
            animationDelay: '3.5s',
          }}
        />
        
        <img 
          src={GoalIcon} 
          alt=""
          style={{
            bottom: '32%',
            left: '35%',
            width: '60px',
            transform: 'rotate(15deg)',
            animation: 'float 7s ease-in-out infinite',
            animationDelay: '1.5s',
          }}
        />
        
        <img 
          src={KnowledgeIcon} 
          alt=""
          style={{
            bottom: '25%',
            right: '32%',
            width: '75px',
            transform: 'rotate(-10deg)',
            animation: 'float 10s ease-in-out infinite',
            animationDelay: '4.5s',
          }}
        />
        
        <img 
          src={ScholarshipIcon} 
          alt=""
          style={{
            top: '18%',
            left: '42%',
            width: '68px',
            transform: 'rotate(12deg)',
            animation: 'float 8.5s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            maxWidth: 800,
            mx: 'auto',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              component="img"
              src={LogoText}
              alt="Mindmodel"
              sx={{
                height: { xs: 80, md: 100 },
                width: 'auto',
                mb: 4,
                backgroundColor: 'transparent',
              }}
            />
          </Box>

          <Typography 
            variant="h5" 
            sx={{ 
              mb: 6,
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
            }}
          >
            Discover your cognitive profile, receive AI driven insight and strategy personalized for you.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 8 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/about')}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                borderColor: 'divider',
                color: 'text.primary',
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'background.default',
                  borderColor: 'primary.main',
                },
              }}
            >
              Learn More
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/sign-up')}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: 'none',
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  boxShadow: 1,
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );

  const cognitiveItems = [
    { icon: <Memory />, text: "Memory" },
    { icon: <Visibility />, text: "Attention" },
    { icon: <Speed />, text: "Processing" },
    { icon: <Psychology />, text: "Reasoning" },
    { icon: <LanguageIcon />, text: "Language" },
    { icon: <Assignment />, text: "Executive Function" },
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
      <HeroSection />

      {/* What We Assess Section */}
      <Box sx={{ 
        py: { xs: 6, md: 8 }, 
        bgcolor: theme.palette.primary.dark,
        color: 'white'
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            align="center" 
            sx={{ 
              fontWeight: 700,
              mb: 8,
              color: 'white',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            What We Assess
          </Typography>
          <Grid container spacing={10}>
            {/* Cognitive Profile Card & Items - Updated with modern styling */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  height: '100%',
                }}
              >
                <Box 
                  className="icon-wrapper"
                  sx={{
                    width: 100,
                    height: 100,
                    mb: 4,
                    transition: 'all 0.3s ease-in-out',
                    alignSelf: 'center',
                    '& img': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      opacity: 0.9,
                      transition: 'transform 0.3s ease-in-out',
                    },
                    '&:hover img': {
                      transform: 'scale(1.15)',
                    }
                  }}
                >
                  <img src={PuzzleImage} alt="Cognitive Profile" />
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 3,
                    color: 'white',
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}
                >
                  Cognitive Profile
                </Typography>
                <Typography 
                  sx={{ 
                    mb: 4,
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'left',
                    lineHeight: 1.6,
                  }}
                >
                  Discover your unique cognitive profile through engaging, research-based assessments.
                </Typography>
                
                {/* Cognitive Items */}
                <Box sx={{ width: '100%', px: 8 }}>
                  {cognitiveItems.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 2,
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.02)',
                          transform: 'translateX(4px)',
                        }
                      }}
                    >
                      {React.cloneElement(item.icon, { 
                        sx: { 
                          fontSize: 38,
                          color: 'rgba(255, 255, 255, 0.9)',
                          transition: 'all 0.15s ease-in-out',
                          minWidth: 38,
                          flexShrink: 0,
                        } 
                      })}
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontSize: '1.1rem',
                          fontWeight: 500,
                          color: 'rgba(255, 255, 255, 0.9)',
                          transition: 'color 0.15s ease-in-out',
                          lineHeight: 1.4,
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Learning Style Card & Items */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  height: '100%',
                }}
              >
                <Box 
                  className="icon-wrapper"
                  sx={{
                    width: 100,
                    height: 100,
                    mb: 4,
                    transition: 'all 0.3s ease-in-out',
                    alignSelf: 'center',
                    '& img': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      opacity: 0.9,
                      transition: 'transform 0.3s ease-in-out',
                    },
                    '&:hover img': {
                      transform: 'scale(1.15)',
                    }
                  }}
                >
                  <img src={VisionImage} alt="Learning Style" />
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 3,
                    color: 'white',
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}
                >
                  Learning Style
                </Typography>
                <Typography 
                  sx={{ 
                    mb: 4,
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'left',
                    lineHeight: 1.6,
                  }}
                >
                  Unlock your optimal learning approaches and strategies based on your strengths.
                </Typography>
                
                {/* Learning Items */}
                <Box sx={{ width: '100%', px: 8 }}>
                  {learningItems.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 2,
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.02)',
                          transform: 'translateX(4px)',
                        }
                      }}
                    >
                      {React.cloneElement(item.icon, { 
                        sx: { 
                          fontSize: 38,
                          color: 'rgba(255, 255, 255, 0.9)',
                          transition: 'all 0.15s ease-in-out',
                          minWidth: 38,
                          flexShrink: 0,
                        } 
                      })}
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontSize: '1.1rem',
                          fontWeight: 500,
                          color: 'rgba(255, 255, 255, 0.9)',
                          transition: 'color 0.15s ease-in-out',
                          lineHeight: 1.4,
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Working Style Card & Items */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <Box 
                  className="icon-wrapper"
                  sx={{
                    width: 100,
                    height: 100,
                    mb: 4,
                    transition: 'all 0.3s ease-in-out',
                    alignSelf: 'center',
                    transform: 'translateX(-8px)',
                    '& img': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      opacity: 0.9,
                      transition: 'transform 0.3s ease-in-out',
                    },
                    '&:hover img': {
                      transform: 'scale(1.15)',
                    }
                  }}
                >
                  <img src={ProcessImage} alt="Working Style" />
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 3,
                    color: 'white',
                    alignSelf: 'center',
                    textAlign: 'center',
                    width: '100%',
                    transform: 'translateX(-8px)',
                  }}
                >
                  Working Style
                </Typography>
                <Typography 
                  sx={{ 
                    mb: 4,
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'left',
                    lineHeight: 1.6,
                  }}
                >
                  Enhance workplace performance by understanding your decision-making and problem-solving preferences.
                </Typography>
                
                {/* Working Items */}
                <Box sx={{ width: '100%', px: 8 }}>
                  {workingItems.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 2,
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.02)',
                          transform: 'translateX(4px)',
                        }
                      }}
                    >
                      {React.cloneElement(item.icon, { 
                        sx: { 
                          fontSize: 38,
                          color: 'rgba(255, 255, 255, 0.9)',
                          transition: 'all 0.15s ease-in-out',
                          minWidth: 38,
                          flexShrink: 0,
                        } 
                      })}
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontSize: '1.1rem',
                          fontWeight: 500,
                          color: 'rgba(255, 255, 255, 0.9)',
                          transition: 'color 0.15s ease-in-out',
                          lineHeight: 1.4,
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};
