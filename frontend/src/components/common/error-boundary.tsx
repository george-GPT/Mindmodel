// src/components/Common/errorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';

import AlertIcon from '@mui/icons-material/ReportProblem'; // MUI Icon for alert
import { Box, Button, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const FallbackContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const FallbackPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: '#FFFFFF',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  textAlign: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  backgroundColor: '#3442DA',
  color: '#FFFFFF',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#486DDB',
  },
}));

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Update state to display fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <FallbackContainer>
          <FallbackPaper>
            <AlertIcon color="error" sx={{ fontSize: 60, marginBottom: 2 }} />
            <Typography variant="h5" gutterBottom>
              Oops! Something went wrong.
            </Typography>
            <Typography variant="body1" gutterBottom>
              We're sorry for the inconvenience. Please try refreshing the page.
            </Typography>
            <StyledButton variant="contained" onClick={this.handleReload}>
              Reload Page
            </StyledButton>
          </FallbackPaper>
        </FallbackContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
