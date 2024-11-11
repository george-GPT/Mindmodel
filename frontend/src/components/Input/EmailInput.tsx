import React, { useState, useEffect } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { validateEmail } from '../../utils/validation';

interface EmailInputProps extends Omit<TextFieldProps, 'error'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  onValidationChange,
  ...props
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isDirty) {
      const validationError = validateEmail(value);
      setError(validationError);
      onValidationChange?.(!validationError);
    }
  }, [value, isDirty, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isDirty) setIsDirty(true);
    onChange(e);
  };

  return (
    <TextField
      {...props}
      value={value}
      onChange={handleChange}
      error={!!error}
      helperText={isDirty ? error : undefined}
      onBlur={() => setIsDirty(true)}
    />
  );
};

export default EmailInput; 