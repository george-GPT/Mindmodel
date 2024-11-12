// src/surveys/survey-pages/ExecutiveFunctionPage.tsx

import React from 'react';
import GenericSurvey from '../generic-survey';

const ExecutiveFunctionPage: React.FC = () => {
  const surveyId = 'ExecutiveFunctionSurvey'; // Corresponds to ExecutiveFunctionSurvey.json

  return <GenericSurvey surveyId={surveyId} />;
};

export default ExecutiveFunctionPage;
