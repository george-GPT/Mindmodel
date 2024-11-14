import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LoginModule from '../loginModule';
import { AuthService } from '../../../services';
import authReducer from '../../../store/authSlice';

jest.mock('../../../services/auth/authService');

describe('LoginModule', () => {
    const mockStore = configureStore({
        reducer: {
            auth: authReducer
        }
    });

    const renderComponent = () => {
        return render(
            <Provider store={mockStore}>
                <BrowserRouter>
                    <LoginModule />
                </BrowserRouter>
            </Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('handles successful login', async () => {
        (AuthService.loginUser as jest.Mock).mockResolvedValueOnce({
            user: { email_verified: true }
        });

        renderComponent();

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'Password123!' }
        });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(AuthService.loginUser).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'Password123!'
            });
        });
    });

    it('shows validation errors', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'invalid-email' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'weak' }
        });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
        });
    });

    it('handles unverified email', async () => {
        (AuthService.loginUser as jest.Mock).mockResolvedValueOnce({
            user: { email_verified: false }
        });

        renderComponent();

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'Password123!' }
        });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(localStorage.getItem('pendingVerificationEmail')).toBe('test@example.com');
        });
    });
}); 