export const EMAIL_REGEX = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (email.length > 254) return 'Email is too long';
  if (email.length < 6) return 'Email is too short';
  
  if (!EMAIL_REGEX.test(email)) {
    if (!email.includes('@')) return 'Email must contain @';
    if (!email.includes('.')) return 'Email must contain a domain (e.g., .com)';
    if (email.startsWith('@')) return 'Email cannot start with @';
    if (email.endsWith('@')) return 'Email must have a domain after @';
    if (/\.{2,}/.test(email)) return 'Email cannot contain consecutive dots';
    if (/[<>()[\]\\,;:\s@"]/.test(email)) return 'Email contains invalid characters';
    return 'Please enter a valid email address';
  }

  const [localPart, domain] = email.split('@');
  
  if (localPart.length > 64) return 'Email username is too long';
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return 'Email username cannot start or end with a dot';
  }

  const domainParts = domain.split('.');
  if (domainParts.some(part => part.length > 63)) {
    return 'Email domain part is too long';
  }
  if (domainParts[domainParts.length - 1].length < 2) {
    return 'Email must have a valid top-level domain';
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username) return 'Username is required';
  if (!USERNAME_REGEX.test(username)) {
    return 'Username must be 3-30 characters and can only contain letters, numbers, and underscores';
  }
  return null;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

export const validatePasswordStrength = (password: string): string | null => {
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    
    if (!/\d/.test(password)) {
        return 'Password must contain at least one number';
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Password must contain at least one special character';
    }
    
    return null;
}; 