import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import PasswordChange from '../password-change';
import { AuthService } from '../../../services';
import authReducer from '../../../store/authSlice';

// Mock the auth service
jest.mock('../../../services/auth/authService');

describe('PasswordChange Component', () => {
    const mockStore = configureStore({
        reducer: {
            auth: authReducer
        }
    });

    const renderComponent = () => {
        return render(
            <Provider store={mockStore}>
                <BrowserRouter>
                    <PasswordChange />
                </BrowserRouter>
            </Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows validation errors for weak password', async () => {
        renderComponent();
        
        const oldPasswordInput = screen.getByLabelText(/current password/i);
        const newPasswordInput = screen.getByLabelText(/new password/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
        const submitButton = screen.getByRole('button', { name: /change password/i });

        fireEvent.change(oldPasswordInput, { target: { value: 'oldpass123' } });
        fireEvent.change(newPasswordInput, { target: { value: 'weak' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'weak' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
        });
    });

    it('handles successful password change', async () => {
        // Mock successful password change
        (AuthService.changePassword as jest.Mock).mockResolvedValueOnce({
            message: 'Password changed successfully'
        });

        renderComponent();
        
        const oldPasswordInput = screen.getByLabelText(/current password/i);
        const newPasswordInput = screen.getByLabelText(/new password/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
        const submitButton = screen.getByRole('button', { name: /change password/i });

        fireEvent.change(oldPasswordInput, { target: { value: 'oldpass123' } });
        fireEvent.change(newPasswordInput, { target: { value: 'NewPass123!' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'NewPass123!' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/password changed successfully/i)).toBeInTheDocument();
        });
    });

    it('handles API errors', async () => {
        // Mock API error
        (AuthService.changePassword as jest.Mock).mockRejectedValueOnce(
            new Error('Invalid old password')
        );

        renderComponent();
        
        const oldPasswordInput = screen.getByLabelText(/current password/i);
        const newPasswordInput = screen.getByLabelText(/new password/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
        const submitButton = screen.getByRole('button', { name: /change password/i });

        fireEvent.change(oldPasswordInput, { target: { value: 'wrongpass' } });
        fireEvent.change(newPasswordInput, { target: { value: 'NewPass123!' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'NewPass123!' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/invalid old password/i)).toBeInTheDocument();
        });
    });
}); 