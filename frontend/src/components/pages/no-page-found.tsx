import { Container, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import NoPageFoundIcon from '../assets/icons/no-page-found-icon';
import Button from '../button/button';

export const NoPageFound: React.FC = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <NoPageFoundIcon sx={{ fontSize: 300 }} />
      <Stack sx={{ maxWidth: "400px" }} spacing={2}>
        <Typography variant="h3" color="primary.600" fontWeight="700">
          Oh No! Error 404
        </Typography>
        <Typography>
          Oops! That page seems to have taken a detour. Let us guide you back to
          your destination.
        </Typography>
        <Link component={RouterLink} to="/">
          <Button variant="info" fullWidth={false}>
            Back to Homepage
          </Button>
        </Link>
      </Stack>
    </Container>
  );
};
