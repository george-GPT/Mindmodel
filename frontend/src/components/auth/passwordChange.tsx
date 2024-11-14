import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    Alert,
} from '@mui/material';
import type { AppDispatch, RootState } from '@/store/store';
import authService from '@/services/auth/authService';
import Button from '@/components/button/button';
import Input from '@/components/input';
import { validatePassword, validatePasswordMatch } from '@/utils/validation';
import { setError, clearError } from '@/store/authSlice';
import type { ApiError } from '@/types';

interface PasswordChangeRequest {
    old_password: string;
    new_password: string;
    new_password2: string;
}

const PasswordChange = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const authError = useSelector((state: RootState) => state.auth.error);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearError());

        // Validate passwords
        const newPasswordError = validatePassword(newPassword);
        const passwordMatchError = validatePasswordMatch(newPassword, confirmPassword);

        if (newPasswordError || passwordMatchError) {
            dispatch(setError(newPasswordError || passwordMatchError));
            return;
        }

        setIsLoading(true);
        try {
            await authService.changePassword({
                old_password: oldPassword,
                new_password: newPassword,
                new_password2: confirmPassword
            });
            setSuccess(true);
            // Clear form
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Password change failed:', error);
            dispatch(setError(error as ApiError));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Change Password
            </Typography>

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Password changed successfully!
                </Alert>
            )}

            {authError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {authError.message || 'An error occurred'}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <Input
                    type="password"
                    label="Current Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <Input
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <Input
                    type="password"
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    fullWidth
                    sx={{ mb: 3 }}
                />

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={isLoading}
                >
                    {isLoading ? 'Changing Password...' : 'Change Password'}
                </Button>
            </Box>
        </Paper>
    );
};

export default PasswordChange; 