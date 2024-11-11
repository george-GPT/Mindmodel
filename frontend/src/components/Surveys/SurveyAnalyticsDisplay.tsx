import React, { useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import 'survey-analytics/survey.analytics.min.css';
import { VisualizationPanel, VisualizationManager } from 'survey-analytics';
import { Model } from 'survey-core';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

interface SurveyAnalyticsDisplayProps {
  surveyJson: any;
  surveyData: any[];
  insights: string[];
}

const SurveyAnalyticsDisplay: React.FC<SurveyAnalyticsDisplayProps> = ({
  surveyJson,
  surveyData,
  insights
}) => {
  useEffect(() => {
    const survey = new Model(surveyJson);
    
    const vizOptions = {
      allowHideQuestions: false,
      allowShowPercentages: true,
      chartTypes: ['bar', 'pie', 'scatter', 'gauge', 'bullet']
    };

    const vizPanel = new VisualizationPanel(
      survey.getAllQuestions(),
      surveyData,
      vizOptions
    );

    vizPanel.render('surveyVizContainer');

    return () => {
      vizPanel.clear();
    };
  }, [surveyJson, surveyData]);

  return (
    <StyledPaper>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Survey Analytics
      </Typography>

      <Box id="surveyVizContainer" sx={{ mb: 4 }} />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Key Insights
        </Typography>
        {insights.map((insight, index) => (
          <Typography 
            key={index} 
            variant="body1" 
            sx={{ 
              mb: 1,
              p: 2,
              bgcolor: 'rgba(75, 95, 204, 0.1)',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'rgba(75, 95, 204, 0.15)',
              }
            }}
          >
            {insight}
          </Typography>
        ))}
      </Box>
    </StyledPaper>
  );
};

export default SurveyAnalyticsDisplay; 