// src/components/common/Button/Button.types.ts
import { ButtonProps as MuiButtonProps } from '@mui/material';

export type ButtonVariant =
  | "solid"
  | "outlined"
  | "primary"
  | "neutral"
  | "success"
  | "info"
  | "action";

export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}
