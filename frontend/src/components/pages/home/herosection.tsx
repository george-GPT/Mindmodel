import Button from '../../button/button';
import logo from '../../assets/logo.png';
import {
  Box,
  Container,
  Stack,
  Typography
  } from '@mui/material';
import { styled } from '@mui/material/styles';
//mui imports


//local imports

const HighlightedText = styled("span")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

export const HeroSection: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Stack
        spacing={10}
        alignItems="center"
        sx={{
          textAlign: "center",
          py: { xs: 6, md: 8 },
          px: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <img src={logo} alt="logo" width={80} height={80} />
          <Typography
            variant="h3"
            fontWeight="700"
            sx={{
              fontWeight: 600,
              color: "primary.500",
            }}
          >
            Mindmodel
          </Typography>
        </Stack>

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            fontWeight: 700,
            lineHeight: 1.2,
            color: "primary.400",
            mb: 3,
          }}
        >
          We don't measure IQ.
          <br />
          We're here to help.
        </Typography>

        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 300,
              color: "primary.400",
              opacity: 0.9,
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
            }}
          >
            Receive personalized <HighlightedText>AI insights</HighlightedText>{" "}
            and
            <br />
            <HighlightedText>research-based advice</HighlightedText>.
          </Typography>
        </Stack>

        <Box
          sx={{
            mt: 2,
          }}
        >
          <Button
            variant="success"
            size="large"
            sx={{
              bgcolor: "#2EAF5A",
              color: "white",
              px: 4,
              py: 1.5,
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "1.125rem",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "#249A4C",
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
