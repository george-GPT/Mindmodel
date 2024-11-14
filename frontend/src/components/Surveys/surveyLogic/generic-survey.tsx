import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Model as SurveyModel } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { Box, Typography, Alert, Button } from '@mui/material';
import { StylesManager } from 'survey-core';

// Import SurveyJS CSS
import "survey-core/defaultV2.min.css";

import { RootState } from '../../../store/store';
import { submitSurveyResponse } from '../../../store/surveySlice';
import { completeSurvey } from '../../../store/progressSlice';
import type { 
  SurveyJSON, 
  SurveyResponse, 
  SurveyAnalytics,
  Survey as SurveyType,
  SurveyPage,
  SurveyAnalyticsDisplayProps
} from '@/types/survey';
import { useSurveyAnalytics } from '../surveyHooks/use-survey-analytics';
import { useSurveyTheme } from '../surveyHooks/use-survey-theme';
import SurveyAnalyticsDisplay from './survey-endscreen-analytics';
import ErrorBoundary from '../../dashboard/common/error-boundary';
import Loading from '../../dashboard/common/loading';

// Import surveys from a centralized location
import { surveys } from '../surveyJson';

// Import survey API
import { surveyAPI } from '../surveyApi/endpoints';

// Apply SurveyJS theme
StylesManager.applyTheme('modern');

interface GenericSurveyProps {
  surveyId: string;
  surveyJson?: SurveyJSON;
}

const GenericSurvey: React.FC<GenericSurveyProps> = ({ surveyId, surveyJson }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isMember } = useSelector((state: RootState) => state.auth);
  const [loadedSurveyJson, setLoadedSurveyJson] = useState<SurveyJSON | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<SurveyAnalytics | null>(null);
  
  const { generateAnalytics } = useSurveyAnalytics();
  const { surveyRootClass } = useSurveyTheme();

  // Auth check effect
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isMember) {
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, isMember, navigate]);

  // Survey loading effect
  useEffect(() => {
    const loadSurvey = async () => {
      try {
        if (surveyJson) {
          setLoadedSurveyJson(surveyJson);
        } else {
          const response = await surveyAPI.getSurveyDetails(parseInt(surveyId, 10));
          const surveyData: SurveyJSON = {
            ...response.data.data,
            pages: response.data.data.questions as SurveyPage[]
          };
          setLoadedSurveyJson(surveyData);
        }
      } catch (err) {
        setError('Failed to load survey');
        console.error('Survey load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSurvey();
  }, [surveyId, surveyJson]);

  const onComplete = async (survey: SurveyModel) => {
    setIsSubmitting(true);
    try {
      const responses = survey.data;
      
      if (surveyId !== 'BaselineSurvey') {
        const analytics = await generateAnalytics(
          loadedSurveyJson as SurveyType, 
          responses as SurveyResponse
        );
        setAnalyticsData(analytics);
      }

      const response = await surveyAPI.submitSurveyResponse({
        survey_id: Number(surveyId),
        responses: survey.data,
        completed: true,
        completion_rate: 100,
        submitted_at: new Date().toISOString()
      });

      if (!response.data.success) {
        throw new Error('Survey submission failed');
      }

      dispatch(submitSurveyResponse({
        survey_id: Number(surveyId),
        responses: survey.data,
        completed: true,
        completion_rate: 100,
        submitted_at: new Date().toISOString()
      }));
      dispatch(completeSurvey(surveyId));

      if (surveyId === 'BaselineSurvey') {
        navigate('/dashboard');
      } else {
        setShowAnalytics(true);
      }
    } catch (err) {
      setError('Failed to submit survey. Please try again.');
      console.error('Error submitting survey:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (loading || isSubmitting) {
    return <Loading />;
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()} 
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box p={4}>
        {!showAnalytics ? (
          <>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              {loadedSurveyJson?.title || 'Survey'}
            </Typography>
            {loadedSurveyJson && (
              <Survey
                model={new SurveyModel(loadedSurveyJson)}
                onComplete={onComplete}
                showCompletedPage={false}
                css={surveyRootClass}
              />
            )}
          </>
        ) : (
          <>
            <SurveyAnalyticsDisplay 
              survey={loadedSurveyJson as SurveyType}
              response={analyticsData}
              completionRate={100}
            />
            <Box mt={4} display="flex" justifyContent="center">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleContinue}
              >
                Continue to Dashboard
              </Button>
            </Box>
          </>
        )}
      </Box>
    </ErrorBoundary>
  );
};

export default GenericSurvey;