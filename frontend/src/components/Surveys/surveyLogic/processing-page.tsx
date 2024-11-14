import React from 'react';
import { Box, Typography } from '@mui/material';
import GenericSurvey from './generic-survey';
import ErrorBoundary from '../../dashboard/common/error-boundary';
import { surveys } from '../surveyJson';

const ProcessingInstructions = () => (
  <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
    This assessment evaluates how you process and respond to different types of information. 
    Take your time with each question and focus on providing accurate responses that reflect 
    your typical information processing style.
  </Typography>
);

const ProcessingPage: React.FC = () => {
  const surveyId = 'ProcessingSurvey';
  const survey = surveys[surveyId];

  if (!survey) {
    throw new Error('Processing survey configuration not found');
  }

  return (
    <ErrorBoundary>
      <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
          Processing Assessment
        </Typography>
        <ProcessingInstructions />
        <GenericSurvey surveyId={surveyId} />
      </Box>
    </ErrorBoundary>
  );
};

export default ProcessingPage;