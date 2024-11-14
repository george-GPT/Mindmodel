import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Model } from 'survey-core';
import { VisualizationPanel } from 'survey-analytics';
import 'survey-analytics/survey.analytics.min.css';
import type { Survey, SurveyResponse } from '../surveyApi/survey';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: theme.shadows[2]
}));

interface SurveyAnalyticsDisplayProps {
  survey: Survey;
  response: SurveyResponse;
  completionRate: number;
}

const SurveyAnalyticsDisplay: React.FC<SurveyAnalyticsDisplayProps> = ({
  survey,
  response,
  completionRate
}) => {
  React.useEffect(() => {
    const surveyModel = new Model(survey);
    
    const vizOptions = {
      allowHideQuestions: false,
      allowShowPercentages: true,
      chartTypes: ['bar', 'pie'] // Simplified chart types as per documentation
    };

    const vizPanel = new VisualizationPanel(
      surveyModel.getAllQuestions(),
      [response], // Single response as per our streamlined approach
      vizOptions
    );

    vizPanel.render('surveyVizContainer');
    return () => vizPanel.clear();
  }, [survey, response]);

  const insights = [
    `Survey completion rate: ${completionRate}%`,
    `Total questions answered: ${Object.keys(response.responses || {}).length}`,
    `Survey type: ${survey.metadata?.type || 'Standard'}`
  ];

  return (
    <StyledPaper>
      <Typography variant="h5" gutterBottom>
        Survey Results
      </Typography>

      <Box id="surveyVizContainer" sx={{ mb: 4 }} />

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Key Insights
        </Typography>
        {insights.map((insight, index) => (
          <Typography 
            key={index} 
            variant="body1" 
            sx={{ mb: 1, p: 1 }}
          >
            {insight}
          </Typography>
        ))}
      </Box>
    </StyledPaper>
  );
};

export default SurveyAnalyticsDisplay;