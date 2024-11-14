// src/surveys/surveyPages/PersonalityPage.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import GenericSurvey from './generic-survey';
import ErrorBoundary from '../../dashboard/common/error-boundary';
import { surveys } from '../surveyJson';

const PersonalityInstructions = () => (
  <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
    This assessment explores different aspects of personality and behavioral preferences. 
    There are no right or wrong answers - please respond honestly based on how you typically 
    think, feel, and behave in different situations.
  </Typography>
);

const PersonalityPage: React.FC = () => {
  const surveyId = 'PersonalitySurvey';
  const survey = surveys[surveyId];

  if (!survey) {
    throw new Error('Personality survey configuration not found');
  }

  return (
    <ErrorBoundary>
      <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
          Personality Assessment
        </Typography>
        <PersonalityInstructions />
        <GenericSurvey surveyId={surveyId} />
      </Box>
    </ErrorBoundary>
  );
};

export default PersonalityPage;
