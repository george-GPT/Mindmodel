import React from 'react';
import { Box, Typography } from '@mui/material';
import GenericSurvey from './generic-survey';
import ErrorBoundary from '../../dashboard/common/error-boundary';
import { surveys } from '../surveyJson';

const AttentionInstructions = () => (
  <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
    This assessment measures different aspects of attention and focus. Take your time 
    and maintain concentration throughout the tasks. There are no right or wrong answers.
  </Typography>
);

const AttentionPage: React.FC = () => {
  const surveyId = 'AttentionSurvey';
  const survey = surveys[surveyId];

  if (!survey) {
    throw new Error('Attention survey configuration not found');
  }

  return (
    <ErrorBoundary>
      <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
          Attention Assessment
        </Typography>
        <AttentionInstructions />
        <GenericSurvey surveyId={surveyId} />
      </Box>
    </ErrorBoundary>
  );
};

export default AttentionPage;