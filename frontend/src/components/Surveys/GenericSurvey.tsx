// src/Surveys/GenericSurvey.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SurveyModel } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { StylesManager } from 'survey-core';
import axios from 'axios';

import { RootState } from '../../store/store';
import { submitSurveyResponse } from '../../store/surveySlice';
import { completeSurvey } from '../../store/progress-slice';
import { SurveyJSON } from '../../types/survey';
import { useSurveyAnalytics } from './surveyHooks/useSurveyAnalytics';
import { useSurveyTheme } from './surveyHooks/useSurveyTheme';
import SurveyAnalyticsDisplay from './SurveyAnalyticsDisplay';
import ErrorBoundary from '../common/errorBoundary';

// Import all survey JSON files
import AttentionSurvey from './AttentionSurvey.json';
import BaselineSurvey from './BaselineSurvey.json';
import ExecutiveFunctionSurvey from './ExecutiveFunctionSurvey.json';
import MemorySurvey from './MemorySurvey.json';
import PersonalitySurvey from './PersonalitySurvey.json';
import ProcessingSurvey from './ProcessingSurvey.json';

// Apply SurveyJS theme
StylesManager.applyTheme('modern');

const surveys: { [key: string]: SurveyJSON } = {
  AttentionSurvey,
  BaselineSurvey,
  ExecutiveFunctionSurvey,
  MemorySurvey,
  PersonalitySurvey,
  ProcessingSurvey,
};

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
  const [error, setError] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  
  const { generateAnalytics, getChartData } = useSurveyAnalytics();
  const { surveyRootClass } = useSurveyTheme();

  // Check auth and membership
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

  // Load survey
  useEffect(() => {
    try {
      if (surveyJson) {
        setLoadedSurveyJson(surveyJson);
      } else if (surveys[surveyId]) {
        setLoadedSurveyJson(surveys[surveyId]);
      } else {
        throw new Error('Survey not found');
      }
    } catch (err) {
      setError('Failed to load survey');
      console.error('Survey load error:', err);
    } finally {
      setLoading(false);
    }
  }, [surveyId, surveyJson]);

  const onComplete = async (survey: SurveyModel) => {
    try {
      const responses = survey.data;
      
      // Generate analytics for non-baseline surveys
      if (surveyId !== 'BaselineSurvey') {
        const analytics = generateAnalytics({
          responses,
          questions: loadedSurveyJson?.pages.flatMap(page => page.elements) || []
        });
        setAnalyticsData(analytics);
      }

      // Submit to backend
      await axios.post(
        '/api/surveys/',
        { surveyId, responses },
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
          },
        }
      );

      // Update Redux state
      dispatch(submitSurveyResponse({ surveyId, responses }));
      dispatch(completeSurvey(surveyId));

      // Show analytics or navigate
      if (surveyId === 'BaselineSurvey') {
        navigate('/dashboard');
      } else {
        setShowAnalytics(true);
      }

    } catch (err) {
      console.error('Error submitting survey:', err);
      setError('Failed to submit survey. Please try again.');
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
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
              surveyJson={loadedSurveyJson}
              surveyData={[analyticsData]}
              insights={analyticsData?.insightSummary || []}
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
