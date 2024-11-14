// src/routes/surveyRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import GenericSurvey from '../components/Surveys/surveyLogic/generic-survey';

const SurveyRoutes = () => {
  const location = useLocation();
  const { completedSurveys } = useSelector((state: RootState) => state.progress);
  const baselineCompleted = completedSurveys.includes('BaselineSurvey');

  // Survey type mapping
  const surveyPaths = {
    'AttentionSurvey': 'attention',
    'BaselineSurvey': 'baseline',
    'ExecutiveFunctionSurvey': 'executive-function',
    'MemorySurvey': 'memory',
    'PersonalitySurvey': 'personality',
    'ProcessingSurvey': 'processing'
  };

  // Redirect to baseline if not completed
  if (!baselineCompleted && location.pathname !== '/app/surveys/baseline') {
    return <Navigate to="/app/surveys/baseline" replace />;
  }

  return (
    <Routes>
      <Route index element={<Navigate to={baselineCompleted ? "/app" : "baseline"} replace />} />
      
      {/* Baseline Survey - Always Available */}
      <Route 
        path="baseline" 
        element={<GenericSurvey surveyId="BaselineSurvey" />} 
      />

      {/* Other Surveys - Only Available After Baseline */}
      {baselineCompleted && (
        <>
          <Route path="attention" element={<GenericSurvey surveyId="AttentionSurvey" />} />
          <Route path="executive-function" element={<GenericSurvey surveyId="ExecutiveFunctionSurvey" />} />
          <Route path="memory" element={<GenericSurvey surveyId="MemorySurvey" />} />
          <Route path="personality" element={<GenericSurvey surveyId="PersonalitySurvey" />} />
          <Route path="processing" element={<GenericSurvey surveyId="ProcessingSurvey" />} />
        </>
      )}

      {/* Catch invalid survey paths */}
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
};

export default SurveyRoutes;


//  graph TD
//    A[Dashboard] -->|Select Survey| B[Generic Survey]
//    B -->|Load Survey JSON| C[Survey Type Pages]
//    C -->|Complete Survey| D[Survey Analytics]
//    D -->|Baseline Survey| A
//    D -->|Other Surveys| E[Show Analytics]
//    E -->|Continue| A
