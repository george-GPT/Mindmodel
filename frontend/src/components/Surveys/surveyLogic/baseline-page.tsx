import React from 'react';
import { Box, Typography } from '@mui/material';
import GenericSurvey from './generic-survey';
import ErrorBoundary from '../../dashboard/common/error-boundary';
import { surveys } from '../surveyJson';

const BaselineInstructions = () => (
  <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
    This baseline assessment helps us understand your starting point. Please answer all questions honestly 
    and to the best of your ability. Your responses will help us personalize your experience.
  </Typography>
);

const BaselinePage: React.FC = () => {
  const surveyId = 'BaselineSurvey';
  const survey = surveys[surveyId];

  if (!survey) {
    throw new Error('Baseline survey configuration not found');
  }

  return (
    <ErrorBoundary>
      <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
          Baseline Assessment
        </Typography>
        <BaselineInstructions />
        <GenericSurvey surveyId={surveyId} />
      </Box>
    </ErrorBoundary>
  );
};

export default BaselinePage;