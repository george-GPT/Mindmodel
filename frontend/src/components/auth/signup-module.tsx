import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box, Divider, IconButton, InputAdornment, Paper, styled, Typography, Alert
} from '@mui/material';

import { AppDispatch, RootState } from '../../store/store';
import { AuthService } from '../../services';
import GoogleIcon from '../assets/icons/google-Icon';
import BrainIconPurple from '../assets/icons/brainIconPurlple';
import Button from '../button/button';
import Input from '../Input';
import { setError, clearError } from '../../store/auth-slice';
import { validateEmail, validatePassword, validateUsername, validatePasswordMatch } from '../../utils/validation';
import EmailInput from '../Input/EmailInput';

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

const SignupModule = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [name, setName] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  const authError = useSelector((state: RootState) => state.auth.error);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Initialize Google OAuth
  useEffect(() => {
    const initGoogleAuth = async () => {
      try {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.onload = resolve;
          document.body.appendChild(script);
        });

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

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    
    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const usernameError = validateUsername(name);
    const passwordMatchError = validatePasswordMatch(password, password2);

    // If any validation fails, show the first error
    const firstError = emailError || passwordError || usernameError || passwordMatchError;
    if (firstError) {
      dispatch(setError(firstError));
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(AuthService.registerUser({ 
        username: name, 
        email, 
        password, 
        password2 
      }));
      
      // Store email for verification resend
      localStorage.setItem('pendingVerificationEmail', email);
      setRegistrationComplete(true);
      
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCallback = async (response: any) => {
    try {
      const { credential } = response;
      if (!credential) {
        throw new Error('No credential received from Google');
      }
      await handleSocialAuth('google', credential);
    } catch (error) {
      dispatch(setError('Google authentication failed. Please try again.'));
      console.error('Google auth error:', error);
    }
  };

  const handleGoogleLogin = () => {
    window.google?.accounts.id.prompt();
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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // Show verification message after successful registration
  if (registrationComplete) {
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
        <Box sx={{ maxWidth: 400, p: 3 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Registration successful! Please check your email to verify your account.
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            A verification link has been sent to {email}. Please click the link to verify your account.
          </Typography>
          <Button 
            variant="primary" 
            fullWidth 
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </Box>
      </Paper>
    );
  }

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
          Sign up with Google
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
          onSubmit={handleEmailRegister}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Input
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            variant="outlined"
            required
            disabled={isLoading}
          />

          <EmailInput
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            disabled={isLoading}
            onValidationChange={setIsEmailValid}
          />

          <Input
            fullWidth
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            variant="outlined"
            required
            disabled={isLoading}
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

          <Input
            fullWidth
            label="Confirm Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            type={showPassword ? "text" : "password"}
            variant="outlined"
            required
            disabled={isLoading}
          />

          <Button 
            type="submit"
            fullWidth 
            variant="primary" 
            size="large"
            disabled={isLoading || !isEmailValid}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2" sx={{ color: "secondary.500" }}>
            Already have an account?{' '}
            <Button 
              variant="neutral" 
              onClick={() => navigate('/login')}
              sx={{ 
                textDecoration: "none",
                minWidth: 'auto',
                p: '0 4px'
              }}
            >
              Login
            </Button>
          </Typography>
        </Box>
      </StyledPaper>
    </Paper>
  );
};

export default SignupModule;
