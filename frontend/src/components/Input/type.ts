// src/components/common/Input/Input.types.ts
import { TextFieldProps as MuiTextFieldProps } from '@mui/material';

export type InputVariant = "outlined" | "filled" | "standard"; // Add any other variants you want to support

export interface InputProps extends Omit<MuiTextFieldProps, "variant"> {
  variant?: InputVariant; // Custom variant prop
  isLoading?: boolean; // Example of a custom prop, if you want to include it in the future
}
