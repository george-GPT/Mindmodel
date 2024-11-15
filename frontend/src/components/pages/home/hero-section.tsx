import Button from '../../button/button';
import logo from '../../assets/logo.png';
import {
  Box,
  Container,
  Stack,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

const HighlightedText = styled("span")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -2,
    left: 0,
    width: '100%',
    height: '2px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}00, ${theme.palette.primary.main}40, ${theme.palette.primary.main}00)`,
    transform: 'scaleX(0)',
    transition: 'transform 0.3s ease',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
  },
}));

// Update the FloatingIcon animation
const FloatingIcon = styled("img")(({ theme }) => ({
  position: 'absolute',
  opacity: 0.15,
  animation: 'float 16s infinite linear',
  '@keyframes float': {
    '0%': {
      transform: 'translate(0, 0) rotate(0deg)',
    },
    '25%': {
      transform: 'translate(100px, -50px) rotate(90deg)',
    },
    '50%': {
      transform: 'translate(180px, 80px) rotate(180deg)',
    },
    '75%': {
      transform: 'translate(-50px, 100px) rotate(270deg)',
    },
    '100%': {
      transform: 'translate(0, 0) rotate(360deg)',
    },
  },
}));

// Add this after your existing imports
const BrainIcon2 = styled(FloatingIcon)({
  top: '15%',
  left: '15%',
  width: '60px',
  height: '60px',
  zIndex: 0,
});

const ProcessIcon2 = styled(FloatingIcon)({
  top: '25%',
  right: '18%',
  width: '55px',
  height: '55px',
  zIndex: 0,
  animationDelay: '-3s',
});

const IdeaIcon2 = styled(FloatingIcon)({
  bottom: '20%',
  left: '22%',
  width: '50px',
  height: '50px',
  zIndex: 0,
  animationDelay: '-6s',
});

const InnovationIcon2 = styled(FloatingIcon)({
  bottom: '25%',
  right: '15%',
  width: '58px',
  height: '58px',
  zIndex: 0,
  animationDelay: '-9s',
});

const KnowledgeIcon2 = styled(FloatingIcon)({
  top: '40%',
  left: '8%',
  width: '52px',
  height: '52px',
  zIndex: 0,
  animationDelay: '-12s',
});

// Add these two new styled icons
const CenterBottomIcon = styled(FloatingIcon)({
  bottom: '15%',
  left: '50%',
  transform: 'translateX(-50%)',  // Center horizontally
  width: '54px',
  height: '54px',
  zIndex: 0,
  animationDelay: '-8s',
});

const UpLeftCenterIcon = styled(FloatingIcon)({
  top: '30%',
  left: '35%',
  width: '56px',
  height: '56px',
  zIndex: 0,
  animationDelay: '-15s',
});

export const HeroSection: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ position: 'relative', overflow: 'hidden' }}>
      <BrainIcon2 src={logo} alt="" />
      <ProcessIcon2 src={logo} alt="" />
      <IdeaIcon2 src={logo} alt="" />
      <InnovationIcon2 src={logo} alt="" />
      <KnowledgeIcon2 src={logo} alt="" />
      <CenterBottomIcon src={logo} alt="" />
      <UpLeftCenterIcon src={logo} alt="" />
      <Stack
        spacing={8}
        alignItems="center"
        sx={{
          textAlign: "center",
          py: { xs: 8, md: 12 },
          px: 2,
        }}
      >
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center" 
          sx={{ 
            mb: 2,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)'
            }
          }}
        >
          <img src={logo} alt="logo" width={80} height={80} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "primary.500",
              letterSpacing: '-0.02em',
            }}
          >
            Mindmodel
          </Typography>
        </Stack>

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2.75rem", md: "4rem" },
            fontWeight: 700,
            lineHeight: 1.2,
            color: "primary.400",
            mb: 3,
            letterSpacing: '-0.03em',
          }}
        >
          We don't measure IQ.
          <br />
          We're here to help.
        </Typography>

        <Stack spacing={3} sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 300,
              color: "primary.400",
              opacity: 0.9,
              letterSpacing: '-0.01em',
            }}
          >
            Discover your <HighlightedText>cognitive profile</HighlightedText>.
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 300,
              color: "primary.400",
              opacity: 0.9,
              letterSpacing: '-0.01em',
            }}
          >
            Receive personalized <HighlightedText>AI insights</HighlightedText>{" "}
            and
            <br />
            <HighlightedText>research-based advice</HighlightedText>.
          </Typography>
        </Stack>

        <Box>
          <Button
            variant="success"
            size="large"
            sx={{
              bgcolor: "#2EAF5A",
              color: "white",
              px: 6,
              py: 2,
              borderRadius: "14px",
              textTransform: "none",
              fontSize: "1.25rem",
              fontWeight: 500,
              letterSpacing: '-0.01em',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(46, 175, 90, 0.25)',
              "&:hover": {
                bgcolor: "#249A4C",
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(46, 175, 90, 0.3)',
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};
