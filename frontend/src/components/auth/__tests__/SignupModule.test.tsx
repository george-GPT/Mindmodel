import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import SignupModule from '../signup-module';
import { AuthService } from '../../../services';
import authReducer from '../../../store/authSlice';

jest.mock('../../../services/auth/authService');

describe('SignupModule', () => {
    const mockStore = configureStore({
        reducer: {
            auth: authReducer
        }
    });

    const renderComponent = () => {
        return render(
            <Provider store={mockStore}>
                <BrowserRouter>
                    <SignupModule />
                </BrowserRouter>
            </Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('handles successful registration', async () => {
        (AuthService.registerUser as jest.Mock).mockResolvedValueOnce({
            message: 'Registration successful'
        });

        renderComponent();

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'testuser' }
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText(/^password$/i), {
            target: { value: 'Password123!' }
        });
        fireEvent.change(screen.getByLabelText(/confirm password/i), {
            target: { value: 'Password123!' }
        });

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(AuthService.registerUser).toHaveBeenCalledWith({
                username: 'testuser',
                email: 'test@example.com',
                password: 'Password123!',
                password2: 'Password123!'
            });
        });

        expect(localStorage.getItem('pendingVerificationEmail')).toBe('test@example.com');
    });

    it('shows validation errors', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'te' }  // Too short
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'invalid-email' }
        });
        fireEvent.change(screen.getByLabelText(/^password$/i), {
            target: { value: 'weak' }
        });
        fireEvent.change(screen.getByLabelText(/confirm password/i), {
            target: { value: 'different' }
        });

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/username must be/i)).toBeInTheDocument();
        });
    });

    it('handles Google signup', async () => {
        (AuthService.googleLogin as jest.Mock).mockResolvedValueOnce({
            user: { email_verified: true }
        });

        renderComponent();

        // Mock Google's callback
        const mockGoogleResponse = {
            credential: 'mock-token'
        };

        // Simulate Google sign-in
        window.google.accounts.id.initialize({
            client_id: 'mock-client-id',
            callback: (response: any) => {
                AuthService.googleLogin(response.credential);
            }
        });

        // Trigger Google sign-in
        fireEvent.click(screen.getByText(/sign up with google/i));

        await waitFor(() => {
            expect(AuthService.googleLogin).toHaveBeenCalled();
        });
    });
}); 