// src/components/dashboard/Dashboard.tsx
import './dashboard.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Tooltip, Typography, Alert } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isMember } = useAuth();
  const { sections, allCompleted } = useDashboard();

  if (!isAuthenticated || !isMember) {
    return null;
  }

  return (
    <Box className="dashboard-container">
      <Typography variant="h4" gutterBottom className="dashboard-header">
        Assessments Dashboard
      </Typography>
      
      {!allCompleted && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Complete all surveys and games to unlock your final AI-generated insights.
        </Alert>
      )}
      
      <Grid container spacing={4}>
        {sections.map((section, index) => (
          <Grid key={index} item xs={12} md={6} className="dashboard-grid-item">
            <Box className="dashboard-paper">
              <Box className="section-header">
                {section.icon}
                <Typography variant="h6" className="section-title">
                  {section.title}
                </Typography>
              </Box>
              <Typography className="progress-number">
                {section.progress} / {section.total}
              </Typography>
              <Tooltip title={section.tooltipText} arrow>
                <Button
                  variant="contained"
                  className="view-button"
                  startIcon={section.icon}
                  onClick={() => navigate(section.route)}
                >
                  {section.buttonText}
                </Button>
              </Tooltip>
            </Box>
          </Grid>
        ))}

        {allCompleted && (
          <Grid item xs={12} className="dashboard-grid-item">
            <Box className="dashboard-paper">
              <Box className="section-header">
                <EmojiEventsIcon className="icon" color="success" />
                <Typography variant="h6" className="section-title">
                  Final Results Ready!
                </Typography>
              </Box>
              <Tooltip title="View your final AI-generated insights" arrow>
                <Button
                  variant="contained"
                  className="final-results-button"
                  startIcon={<EmojiEventsIcon />}
                  onClick={() => navigate('/final-results')}
                >
                  View Final Results
                </Button>
              </Tooltip>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;