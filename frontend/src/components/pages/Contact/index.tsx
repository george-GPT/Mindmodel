import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  Grid,
  IconButton,
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: '1px solid',
  borderColor: theme.palette.divider,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
}));

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'success', message: 'Message sent successfully!' });
    // Add your form submission logic here
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography 
        variant="h2" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 700,
          color: 'primary.dark',
          mb: 3,
          textAlign: 'center'
        }}
      >
        Contact Us
      </Typography>

      <Typography 
        variant="h5" 
        color="text.secondary"
        sx={{ 
          maxWidth: '800px', 
          mx: 'auto', 
          mb: 6,
          textAlign: 'center'
        }}
      >
        Have questions? We'd love to hear from you.
      </Typography>

      <Grid container justifyContent="center" sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <ContactCard>
            <IconButton 
              sx={{ 
                bgcolor: 'primary.50',
                color: 'primary.main',
                '&:hover': { bgcolor: 'primary.100' }
              }}
            >
              <EmailIcon />
            </IconButton>
            <Box>
              <Typography variant="h6" gutterBottom>
                Email
              </Typography>
              <Typography color="text.secondary">
                contact@mindmodel.io
              </Typography>
            </Box>
          </ContactCard>
        </Grid>
      </Grid>

      <Paper 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          maxWidth: 600, 
          mx: 'auto', 
          p: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
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
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Send Message
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ContactPage;