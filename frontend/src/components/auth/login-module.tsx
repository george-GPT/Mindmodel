import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box, Divider, IconButton, InputAdornment, Paper, styled, Typography, Alert
} from '@mui/material';

import { AppDispatch, RootState } from '../../store/store';
import { AuthService } from '../../services';
import GoogleIcon from '../Assets/icons/google-Icon';
import Button from '../button/button';
import Input from '../Input';
import { 
  setError, 
  clearError 
} from '../../store/auth-slice';
import { validateEmail, validatePassword } from '../../utils/validation';
import EmailInput from '../Input/EmailInput';
import BrainIconPurple from '../Assets/icons/brainIconPurlple';

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

    // If any validation fails, show the first error
    const firstError = emailError || passwordError;
    if (firstError) {
      dispatch(setError(firstError));
      return;
    }

    setIsLoading(true);
    try {
      const loginAction = AuthService.loginUser({ email, password });
      const response = await dispatch(loginAction);
      
      // Check if email is verified
      if (!response.user.email_verified) {
        localStorage.setItem('pendingVerificationEmail', email);
        navigate('/verify-email');
        return;
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google', accessToken: string) => {
    if (!accessToken) {
      dispatch(setError(`${provider} authentication failed: No access token`));
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(AuthService.googleLogin(accessToken));
      navigate('/dashboard');
    } catch (error) {
      console.error(`${provider} login failed:`, error);
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

        // Initialize Google OAuth client
        window.google?.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback
        });
      } catch (error) {
        console.error('Failed to initialize Google OAuth:', error);
      }
    };

    initGoogleAuth();
  }, []);

  const handleGoogleCallback = async (response: any) => {
    if (response?.credential) {
      try {
        await dispatch(AuthService.googleLogin(response.credential));
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
            {authError}
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
