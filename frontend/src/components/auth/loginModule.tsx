import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box, Divider, IconButton, InputAdornment, Paper, styled, Typography, Alert
} from '@mui/material';

import { AppDispatch, RootState } from '@/store/store';
import { authApi } from '@/services/api/authApi';
import GoogleIcon from '@/components/assets/icons/google-Icon';
import Button from '@/components/button/button';
import Input from '@/components/Input';
import { setError, clearError, login } from '@/store/authSlice';
import { validateEmail, validatePassword } from '@/utils/validation';
import EmailInput from '@/components/Input/email-input';
import BrainIconPurple from '@/components/assets/icons/brainIconPurlple';
import type { AuthProvider } from '@/types/auth';
import { isApiError } from '@/types/error';
import { useAuth } from '@/hooks/useAuth';

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

export const LoginModule = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  
  const authError = useSelector((state: RootState) => state.auth.error);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { login } = useAuth();

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
      await login({ email, password });
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      if (isApiError(error)) {
        dispatch(setError(error));
      } else {
        dispatch(setError('Login failed. Please try again.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = () => {
    // Initialize Google OAuth
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
          onClick={handleGoogleClick}
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
