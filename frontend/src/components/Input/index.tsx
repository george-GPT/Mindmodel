import React from 'react';

import { TextField } from '@mui/material';

import { InputProps } from './type';

export const Input: React.FC<InputProps> = ({
  variant = "outlined",
  sx,
  ...props
}) => {
  const inputStyles = {
    borderRadius: "8px",
    fontFamily: "Inter",
    transition: "all 0.2s ease-in-out",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "secondary.300",
      },
      "&:hover fieldset": {
        borderColor: "border.600",
      },
      "&.Mui-focused fieldset": {
        borderColor: "border.700", // Focus color
      },
    },
  };

  return (
    <TextField {...props} variant={variant} sx={{ ...inputStyles, ...sx }} />
  );
};

export default Input;
