import React from 'react';
import { Box, Typography } from '@mui/material';
import GenericSurvey from './generic-survey';
import ErrorBoundary from '../../dashboard/common/error-boundary';
import { surveys } from '../surveyJson';

const MemoryInstructions = () => (
  <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
    This assessment evaluates different aspects of memory, including short-term recall, 
    working memory, and pattern recognition. Take your time with each task and try to 
    maintain focus throughout the assessment.
  </Typography>
);

const MemoryPage: React.FC = () => {
  const surveyId = 'MemorySurvey';
  const survey = surveys[surveyId];

  if (!survey) {
    throw new Error('Memory survey configuration not found');
  }

  return (
    <ErrorBoundary>
      <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
          Memory Assessment
        </Typography>
        <MemoryInstructions />
        <GenericSurvey surveyId={surveyId} />
      </Box>
    </ErrorBoundary>
  );
};

export default MemoryPage;