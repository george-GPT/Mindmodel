// src/components/common/Input/Input.types.ts
import { TextFieldProps } from '@mui/material';
import { components } from '../../types/api';

// Use consistent casing with our API types
export type InputVariant = "outlined" | "filled" | "standard";

// Extend from API types where possible
export interface InputProps extends Omit<TextFieldProps, "variant"> {
    variant?: InputVariant;
    isLoading?: boolean;
    // Add validation from our API validation rules
    validation?: {
        pattern?: RegExp;
        minLength?: number;
        maxLength?: number;
        required?: boolean;
    };
    // Add error handling consistent with our API error structure
    error?: {
        message?: string;
        code?: string;
    };
}

// Add type guards for validation
export const isPasswordInput = (name: string): boolean => 
    name === 'password' || name === 'newPassword' || name === 'oldPassword';

export const isEmailInput = (name: string): boolean => 
    name === 'email' || name === 'newEmail';
