import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  Grid,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  onSubmit: (data: FormData) => Promise<void>;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        maxWidth: 600,
        mx: 'auto',
        p: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      {status.type && (
        <Alert 
          severity={status.type} 
          sx={{ mb: 3 }}
          onClose={() => setStatus({ type: null, message: '' })}
        >
          {status.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              height: 48,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ContactForm;