export interface StandardError {
  code: string;
  message: string;
  details?: Record<string, any>;
  status: number;
  timestamp: string;
}

export interface ValidationError extends StandardError {
  fieldErrors: Record<string, string[]>;
}

export const ErrorCodes = {
  UNAUTHORIZED: 'AUTH_001',
  INVALID_CREDENTIALS: 'AUTH_002',
  TOKEN_EXPIRED: 'AUTH_003',
  VALIDATION_ERROR: 'VAL_001',
  NOT_FOUND: 'REQ_001',
  SERVER_ERROR: 'SRV_001',
  NETWORK_ERROR: 'NET_001',
} as const; 