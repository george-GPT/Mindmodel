import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Psychology as CognitiveIcon,
  Refresh as PlanIcon,
  FormatListBulleted as AssessmentIcon,
  Security as SecurityIcon,
  Lock as PrivacyIcon,
  Language as GlobalIcon,
} from '@mui/icons-material';
import { RootState } from '../../../store/store';

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const sections = [
    {
      id: 'cognitive-profile',
      title: 'Cognitive Profile',
      subtitle: 'Placeholder Text',
      icon: <CognitiveIcon />,
      onClick: () => navigate('/cognitive-profile'),
    },
    {
      id: 'personalized-plan',
      title: 'Personalized Plan',
      subtitle: 'Placeholder Text',
      icon: <PlanIcon />,
      onClick: () => navigate('/personalized-plan'),
    },
    {
      id: 'assessment-results',
      title: 'Assessment Results',
      subtitle: 'Placeholder Text',
      icon: <AssessmentIcon />,
      onClick: () => navigate('/assessment-results'),
    },
    {
      id: 'login-security',
      title: 'Login & security',
      subtitle: 'Update your account information',
      icon: <SecurityIcon />,
      onClick: () => navigate('/security'),
    },
    {
      id: 'privacy',
      title: 'Privacy',
      subtitle: 'Manage your personal data',
      icon: <PrivacyIcon />,
      onClick: () => navigate('/privacy'),
    },
    {
      id: 'global-preferences',
      title: 'Global preferences',
      subtitle: 'Set your default language and timezone',
      icon: <GlobalIcon />,
      onClick: () => navigate('/preferences'),
    },
  ];

  return (
    <Box sx={{ 
      p: 4, 
      maxWidth: 1200, 
      margin: '0 auto',
      bgcolor: 'background.default' 
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: 'primary.600',
          fontWeight: 700,
          mb: 1
        }}
      >
        Account
      </Typography>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          color: 'text.secondary',
          mb: 4
        }}
      >
        {user?.username || 'Test Account'}
      </Typography>

      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.id}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                bgcolor: 'background.paper',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                  borderColor: 'primary.200',
                  '& .MuiIconButton-root': {
                    bgcolor: 'primary.100',
                    color: 'primary.600',
                    transform: 'scale(1.1)',
                  },
                  '& .section-title': {
                    color: 'primary.600',
                  }
                },
              }}
              onClick={section.onClick}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <IconButton
                  sx={{
                    bgcolor: 'primary.50',
                    color: 'primary.400',
                    mr: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: 'primary.100',
                      color: 'primary.600',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {section.icon}
                </IconButton>
                <Box>
                  <Typography 
                    variant="h6" 
                    className="section-title"
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.primary',
                      transition: 'color 0.2s ease-in-out',
                      mb: 0.5
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.875rem'
                    }}
                  >
                    {section.subtitle}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'error.main',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          <Tooltip title="This action cannot be undone">
            <span>Want to deactivate your account?</span>
          </Tooltip>
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            display: 'block',
            mt: 0.5
          }}
        >
          Take care of that now
        </Typography>
      </Box>
    </Box>
  );
};

export default AccountPage;