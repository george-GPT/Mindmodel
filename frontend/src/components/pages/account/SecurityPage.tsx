import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { authApi, API_PATHS } from '@/services';
import { validatePassword, validatePasswordMatch } from '../../../utils/validation';
import EmailInput from '@/components/Input/email-input';
import { clearError } from '../../../store/authSlice';
import { axiosInstance } from '@/services';
import type { components } from '@/types/api';

type ChangeEmailRequest = {
  new_email: string;
  password: string;
};

const SecurityPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password2: '',
  });

  // Email change state
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: '',
  });

  const [isEmailValid, setIsEmailValid] = useState(false);

  const handlePasswordChange = async (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const newPasswordError = validatePassword(passwordData.new_password);
    const passwordMatchError = validatePasswordMatch(
      passwordData.new_password, 
      passwordData.new_password2
    );

    const firstError = newPasswordError || passwordMatchError;
    if (firstError) {
      setError(firstError);
      return;
    }

    try {
      await authApi.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      });
      setSuccess('Password updated successfully');
      setShowPasswordDialog(false);
      setPasswordData({ 
        old_password: '', 
        new_password: '', 
        new_password2: '' 
      });
    } catch (err) {
      setError('Failed to update password');
    }
  };

  const handleEmailChange = async (e: React.MouseEvent) => {
    e.preventDefault();
    const emailError = validatePassword(emailData.newEmail);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      await axiosInstance.post<components['schemas']['SuccessResponse']>(
        API_PATHS.AUTH.CHANGE_EMAIL,
        {
          new_email: emailData.newEmail,
          password: emailData.password
        } as ChangeEmailRequest
      );
      setSuccess('Email update request sent. Please check your new email for verification.');
      setShowEmailDialog(false);
      setEmailData({ newEmail: '', password: '' });
    } catch (err) {
      setError('Failed to update email');
    }
  };

  const handleTwoFactorToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const endpoint = !twoFactorEnabled ? 
        API_PATHS.AUTH.TWO_FACTOR.ENABLE :
        API_PATHS.AUTH.TWO_FACTOR.DISABLE;
        
      await axiosInstance.post(endpoint);
      setTwoFactorEnabled(!twoFactorEnabled);
    } catch (err) {
      setError('Failed to update 2FA settings');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/account')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SecurityIcon color="primary" />
          Security Settings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <List>
          <ListItem>
            <ListItemText
              primary="Password"
              secondary="Last changed 30 days ago"
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setShowPasswordDialog(true)}
              >
                Change
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Email Address"
              secondary="Used for account recovery and notifications"
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setShowEmailDialog(true)}
              >
                Change
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Two-Factor Authentication"
              secondary="Add an extra layer of security to your account"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={twoFactorEnabled}
                onChange={(e) => void handleTwoFactorToggle(e)}
                onClick={(e) => e.stopPropagation()}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Current Password"
              type="password"
              value={passwordData.old_password}
              onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
              fullWidth
            />
            <TextField
              label="New Password"
              type="password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              fullWidth
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={passwordData.new_password2}
              onChange={(e) => setPasswordData({ ...passwordData, new_password2: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button onClick={(e) => void handlePasswordChange(e)} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Email Change Dialog */}
      <Dialog open={showEmailDialog} onClose={() => setShowEmailDialog(false)}>
        <DialogTitle>Change Email</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <EmailInput
              label="New Email Address"
              value={emailData.newEmail}
              onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
              onValidationChange={setIsEmailValid}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={emailData.password}
              onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEmailDialog(false)}>Cancel</Button>
          <Button 
            onClick={(e) => void handleEmailChange(e)} 
            variant="contained"
            disabled={!isEmailValid}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SecurityPage; 