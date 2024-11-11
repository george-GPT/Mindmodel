// src/Surveys/surveyPages/ExecutiveFunctionPage.tsx

import React from 'react';
import GenericSurvey from '../GenericSurvey';

const ExecutiveFunctionPage: React.FC = () => {
  const surveyId = 'ExecutiveFunctionSurvey'; // Corresponds to ExecutiveFunctionSurvey.json

  return <GenericSurvey surveyId={surveyId} />;
};

export default ExecutiveFunctionPage;
