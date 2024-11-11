// src/components/Dashboard/Dashboard.tsx

import './Dashboard.css'; // Import the CSS file

import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AssessmentIcon from '@mui/icons-material/Assessment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Box, Button, Grid, Tooltip, Typography, Alert } from '@mui/material';

import { RootState } from '../../store/store';

interface DashboardSection {
  icon: JSX.Element;
  title: string;
  progress: number;
  total: number;
  buttonText: string;
  route: string;
  tooltipText: string;
  color: 'primary' | 'secondary' | 'success';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Auth state
  const { isAuthenticated, isMember } = useSelector((state: RootState) => state.auth);
  
  // Progress state
  const { completedSurveys, completedGames } = useSelector(
    (state: RootState) => state.progress
  );
  const surveyResponses = useSelector((state: RootState) => state.surveys.responses);

  // Redirect if not authenticated or not a member
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isMember) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, isMember, navigate]);
  
  // Memoized calculations
  const { totalSurveys, totalGames, allCompleted } = useMemo(() => ({
    totalSurveys: Object.keys(surveyResponses).length,
    totalGames: 4,
    get allCompleted() {
      return completedSurveys.length === this.totalSurveys && 
             completedGames.length === this.totalGames;
    }
  }), [completedSurveys.length, completedGames.length, surveyResponses]);

  // Memoized sections data
  const sections: DashboardSection[] = useMemo(() => [
    {
      icon: <AssessmentIcon className="icon" color="primary" />,
      title: "Surveys Completed",
      progress: completedSurveys.length,
      total: totalSurveys,
      buttonText: "View Surveys",
      route: '/surveys',
      tooltipText: "View and complete surveys",
      color: 'primary'
    },
    {
      icon: <SportsEsportsIcon className="icon" color="secondary" />,
      title: "Games Completed",
      progress: completedGames.length,
      total: totalGames,
      buttonText: "View Games",
      route: '/games',
      tooltipText: "Play and complete games",
      color: 'secondary'
    }
  ], [completedSurveys.length, completedGames.length, totalSurveys, totalGames]);

  // If not authenticated or not a member, return null (useEffect will handle redirect)
  if (!isAuthenticated || !isMember) {
    return null;
  }

  return (
    <Box className="dashboard-container">
      <Typography variant="h4" gutterBottom className="dashboard-header">
        Assessments Dashboard
      </Typography>
      
      {/* Progress Alert */}
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