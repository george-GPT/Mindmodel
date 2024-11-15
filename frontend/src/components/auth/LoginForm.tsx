import React, { useState } from 'react';
import { Box, TextField, Button, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import type { components } from '@/types/api';
import type { GoogleSDKResponse } from '@/types/auth';
import { GoogleLogin } from '@react-oauth/google';
import { isApiError } from '@/types/error';

type LoginCredentials = components['schemas']['LoginCredentials'];

const LoginForm: React.FC = () => {
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: '',
        rememberMe: false
    });

    const { login, socialLogin, isLoading } = useAuth({
        redirectTo: '/dashboard',
        requireAuth: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(credentials);
        } catch (error) {
            if (isApiError(error)) {
                console.error('Login failed:', error.message);
            } else {
                console.error('Unexpected error during login');
            }
        }
    };

    const handleGoogleSuccess = async (response: GoogleSDKResponse) => {
        try {
            await socialLogin('google', response.credential);
        } catch (error) {
            if (isApiError(error)) {
                console.error('Google login failed:', error.message);
            } else {
                console.error('Unexpected error during Google login');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: name === 'rememberMe' ? checked : value
        }));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={credentials.email}
                onChange={handleChange}
                disabled={isLoading}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                disabled={isLoading}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name="rememberMe"
                        checked={credentials.rememberMe}
                        onChange={handleChange}
                        color="primary"
                        disabled={isLoading}
                    />
                }
                label="Remember me"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
            >
                {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                    Or continue with
                </Typography>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.error('Google Login Failed')}
                />
            </Box>
        </Box>
    );
};

export default LoginForm; 