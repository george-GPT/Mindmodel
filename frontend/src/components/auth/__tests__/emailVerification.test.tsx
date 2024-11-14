import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import EmailVerification from '../emailVerification';
import { authAPI } from '../../../services/api/authPath';
import authReducer from '../../../store/authSlice';

// Mock the auth API
jest.mock('../../../services/api/auth');

describe('EmailVerification Component', () => {
    const mockStore = configureStore({
        reducer: {
            auth: authReducer
        }
    });

    const renderComponent = () => {
        return render(
            <Provider store={mockStore}>
                <BrowserRouter>
                    <EmailVerification />
                </BrowserRouter>
            </Provider>
        );
    };

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        // Clear all mocks
        jest.clearAllMocks();
    });

    it('shows loading state initially', () => {
        renderComponent();
        expect(screen.getByText(/verifying your email/i)).toBeInTheDocument();
    });

    it('handles successful verification', async () => {
        // Mock successful verification
        (authAPI.verifyEmail as jest.Mock).mockResolvedValueOnce({
            data: { message: 'Email verified successfully' }
        });

        // Mock URL params
        const searchParams = new URLSearchParams();
        searchParams.set('token', 'valid-token');
        Object.defineProperty(window, 'location', {
            value: {
                search: searchParams.toString()
            }
        });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/email verified successfully/i)).toBeInTheDocument();
        });
    });

    it('handles verification failure', async () => {
        // Mock failed verification
        (authAPI.verifyEmail as jest.Mock).mockRejectedValueOnce(
            new Error('Verification failed')
        );

        // Mock URL params
        const searchParams = new URLSearchParams();
        searchParams.set('token', 'invalid-token');
        Object.defineProperty(window, 'location', {
            value: {
                search: searchParams.toString()
            }
        });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/verification failed/i)).toBeInTheDocument();
        });
    });

    it('handles resend verification', async () => {
        // Mock failed verification to show resend button
        (authAPI.verifyEmail as jest.Mock).mockRejectedValueOnce(
            new Error('Verification failed')
        );

        // Mock successful resend
        (authAPI.resendVerification as jest.Mock).mockResolvedValueOnce({
            data: { message: 'Verification email sent' }
        });

        // Store email in localStorage
        localStorage.setItem('pendingVerificationEmail', 'test@example.com');

        renderComponent();

        // Wait for the resend button to appear
        await waitFor(() => {
            expect(screen.getByText(/resend verification email/i)).toBeInTheDocument();
        });

        // Click resend button
        fireEvent.click(screen.getByText(/resend verification email/i));

        await waitFor(() => {
            expect(authAPI.resendVerification).toHaveBeenCalledWith('test@example.com');
        });
    });
}); 