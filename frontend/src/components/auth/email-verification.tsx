import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
    Box, 
    Paper, 
    Typography, 
    Alert, 
    CircularProgress,
    Fade,
    useTheme
} from '@mui/material';
import { CheckCircleOutline, ErrorOutline, MailOutline } from '@mui/icons-material';
import { AppDispatch } from '../../store/store';
import { authAPI } from '../../services/api/authPath';
import Button from '../button/button';
import { 
    VerificationResponse,
    ResendVerificationResponse,
    ErrorResponse 
} from '../../types';

const EmailVerification: React.FC = () => {
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();

    useEffect(() => {
        const verifyEmail = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (!token) {
                setError('Verification token is missing');
                setVerifying(false);
                return;
            }

            try {
                await authAPI.verifyEmail(token);
                setSuccess(true);
            } catch (err) {
                setError('Email verification failed. Please try again.');
            } finally {
                setVerifying(false);
            }
        };

        verifyEmail();
    }, [location]);

    const handleResendVerification = async () => {
        setVerifying(true);
        try {
            const email = localStorage.getItem('pendingVerificationEmail');
            if (!email) {
                setError('Email not found. Please try signing up again.');
                return;
            }
            await authAPI.resendVerification(email);
            setError(null);
            setSuccess(true);
        } catch (err) {
            setError('Failed to resend verification email. Please try again.');
        } finally {
            setVerifying(false);
        }
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
            <Fade in={true} timeout={800}>
                <Box 
                    sx={{ 
                        maxWidth: 400, 
                        p: 4,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        textAlign: 'center'
                    }}
                >
                    {verifying ? (
                        <>
                            <CircularProgress 
                                size={60}
                                sx={{ 
                                    mb: 3,
                                    color: theme.palette.primary.main 
                                }}
                            />
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Verifying your email...
                            </Typography>
                            <Typography color="text.secondary">
                                This will only take a moment
                            </Typography>
                        </>
                    ) : success ? (
                        <>
                            <CheckCircleOutline 
                                sx={{ 
                                    fontSize: 60, 
                                    color: 'success.main',
                                    mb: 3 
                                }}
                            />
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Email Verified Successfully!
                            </Typography>
                            <Button 
                                variant="primary" 
                                fullWidth 
                                onClick={() => navigate('/login')}
                                sx={{ mt: 2 }}
                            >
                                Proceed to Login
                            </Button>
                        </>
                    ) : (
                        <>
                            {error && (
                                <>
                                    <ErrorOutline 
                                        sx={{ 
                                            fontSize: 60, 
                                            color: 'error.main',
                                            mb: 3 
                                        }}
                                    />
                                    <Alert 
                                        severity="error" 
                                        sx={{ 
                                            mb: 3,
                                            borderRadius: 2
                                        }}
                                    >
                                        {error}
                                    </Alert>
                                </>
                            )}
                            <Button 
                                variant="primary" 
                                fullWidth
                                onClick={handleResendVerification}
                                startIcon={<MailOutline />}
                                sx={{ mt: 2 }}
                            >
                                Resend Verification Email
                            </Button>
                            <Button 
                                variant="neutral" 
                                fullWidth
                                onClick={() => navigate('/login')}
                                sx={{ mt: 2 }}
                            >
                                Back to Login
                            </Button>
                        </>
                    )}
                </Box>
            </Fade>
        </Paper>
    );
};

export default EmailVerification;