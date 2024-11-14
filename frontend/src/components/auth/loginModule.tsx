import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box, Divider, IconButton, InputAdornment, Paper, styled, Typography, Alert
} from '@mui/material';

import { AppDispatch, RootState } from '@/store/store';
import { AuthService } from '@/services';
import GoogleIcon from '@/components/assets/icons/google-Icon';
import Button from '@/components/button/button';
import Input from '@/components/input';
import { 
  setError, 
  clearError 
} from '@/store/authSlice';
import { validateEmail, validatePassword } from '../../utils/validation';
import EmailInput from '../input/email-input';
import BrainIconPurple from '../assets/icons/brainIconPurlple';
import { AuthProvider } from '../../types';
import type { AuthResponse } from '@/types/auth';
// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: "440px",
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",

  gap: theme.spacing(1),
  marginBottom: theme.spacing(4),
}));

const DividerContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  margin: `${theme.spacing(3)} 0`,
}));

const LoginModule = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  
  const authError = useSelector((state: RootState) => state.auth.error);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    // Validate fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      dispatch(setError(emailError || passwordError));
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthService.loginUser({ email, password });
      
      if (!response?.data?.user?.email_verified) {
        localStorage.setItem('pendingVerificationEmail', email);
        navigate('/verify-email');
        return;
      }

      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      dispatch(setError('Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: AuthProvider, token: string) => {
    if (!token) {
      dispatch(setError(`${provider} authentication failed: No token`));
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.googleLogin({ token });
      navigate('/dashboard');
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      dispatch(setError(`${provider} authentication failed`));
    } finally {
      setIsLoading(false);
    }
  };

  // Add Google OAuth initialization
  useEffect(() => {
    // Initialize Google OAuth
    const initGoogleAuth = async () => {
      try {
        // Load Google's OAuth script
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.onload = resolve;
          document.body.appendChild(script);
        });

        // Add null check and throw if missing
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
          throw new Error('Google client ID not configured');
        }

        window.google?.accounts.id.initialize({
          client_id: clientId, // Now TypeScript knows this is string
          callback: handleGoogleCallback
        });
      } catch (error) {
        console.error('Failed to initialize Google OAuth:', error);
        dispatch(setError('Google authentication configuration error'));
      }
    };

    initGoogleAuth();
  }, []);

  interface GoogleAuthResponse {
    credential?: string;
    select_by?: string;
  }

  const handleGoogleCallback = async (response: GoogleAuthResponse) => {
    if (response?.credential) {
      try {
        await AuthService.googleLogin({ token: response.credential });
        navigate('/dashboard');
      } catch (error) {
        console.error('Google auth failed:', error);
        dispatch(setError('Google authentication failed'));
      }
    }
  };

  const handleGoogleLogin = () => {
    window.google?.accounts.id.prompt();
  };

  return (
    <Paper
      elevation={24}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "secondary.200",
        p: 2,
      }}
    >
      <StyledPaper elevation={3} sx={{ borderRadius: "18px" }}>
        <LogoContainer>
          <BrainIconPurple sx={{ fontSize: 40 }} />
          <Typography variant="h4" sx={{ color: "primary.400", fontWeight: "700" }}>
            Mindmodel
          </Typography>
        </LogoContainer>

        {authError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {authError.message || 'An error occurred'}
          </Alert>
        )}

        <Button 
          variant="action" 
          fullWidth 
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          Sign in with Google
        </Button>

        <DividerContainer>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="body2" sx={{ mx: 2, color: "secondary.500" }}>
            or
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </DividerContainer>

        <Box
          component="form"
          onSubmit={handleEmailLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <EmailInput
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            variant="outlined"
            required
            disabled={isLoading}
            onValidationChange={setIsEmailValid}
          />

          <Input
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    size="small"
                    disabled={isLoading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button 
            type="submit"
            fullWidth 
            variant="primary" 
            size="large"
            disabled={isLoading || !isEmailValid}
          >
            {isLoading ? 'Signing in...' : 'Log In'}
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2" sx={{ color: "secondary.500" }}>
            Don't have an account?{' '}
            <Button 
              variant="neutral" 
              onClick={() => navigate('/sign-up')}
              disabled={isLoading}
              sx={{ 
                textDecoration: "none",
                minWidth: 'auto',
                p: '0 4px'
              }}
            >
              Sign Up
            </Button>
          </Typography>
        </Box>
      </StyledPaper>
    </Paper>
  );
};

export default LoginModule;
