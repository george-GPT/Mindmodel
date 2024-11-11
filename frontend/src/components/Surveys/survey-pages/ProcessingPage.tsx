// src/surveys/surveyPages/ProcessingPage.tsx

import React from 'react';
import GenericSurvey from '../generic-survey';

const ProcessingPage: React.FC = () => {
  const surveyId = 'ProcessingSurvey'; 

  return <GenericSurvey surveyId={surveyId} />;
};

export default ProcessingPage;
