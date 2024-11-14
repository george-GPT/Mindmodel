import React from 'react';
import { Box, Typography } from '@mui/material';
import GenericSurvey from './generic-survey';
import ErrorBoundary from '../../dashboard/common/error-boundary';
import { surveys } from '../surveyJson';

const ExecutiveFunctionInstructions = () => (
  <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
    This assessment evaluates different aspects of executive function, including planning, 
    organization, and decision-making. Please consider each scenario carefully and answer 
    based on your typical behavior.
  </Typography>
);

const ExecutiveFunctionPage: React.FC = () => {
  const surveyId = 'ExecutiveFunctionSurvey';
  const survey = surveys[surveyId];

  if (!survey) {
    throw new Error('Executive function survey configuration not found');
  }

  return (
    <ErrorBoundary>
      <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
          Executive Function Assessment
        </Typography>
        <ExecutiveFunctionInstructions />
        <GenericSurvey surveyId={surveyId} />
      </Box>
    </ErrorBoundary>
  );
};

export default ExecutiveFunctionPage;