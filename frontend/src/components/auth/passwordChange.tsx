import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    Alert,
} from '@mui/material';
import type { AppDispatch, RootState } from '@/store/store';
import { authApi } from '@/services/api/authApi';
import Button from '@/components/button/button';
import Input from '@/components/Input';
import { validatePassword, validatePasswordMatch } from '@/utils/validation';
import { setError, clearError } from '@/store/authSlice';
import { isApiError } from '@/types/error';
import { useAuth } from '@/hooks/useAuth';

const PasswordChange = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const authError = useSelector((state: RootState) => state.auth.error);
    const { changePassword, isLoading: authLoading } = useAuth();

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
            await changePassword({
                old_password: oldPassword,
                new_password: newPassword
            });
            setSuccess(true);
            // Clear form
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Password change failed:', error);
            if (isApiError(error)) {
                dispatch(setError(error));
            } else {
                dispatch(setError('Password change failed. Please try again.'));
            }
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