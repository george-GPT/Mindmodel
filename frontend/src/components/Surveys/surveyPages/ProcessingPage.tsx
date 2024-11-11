// src/Surveys/surveyPages/ProcessingPage.tsx

import React from 'react';
import GenericSurvey from '../GenericSurvey';

const ProcessingPage: React.FC = () => {
  const surveyId = 'ProcessingSurvey'; // Corresponds to ProcessingSurvey.json

  return <GenericSurvey surveyId={surveyId} />;
};

export default ProcessingPage;
