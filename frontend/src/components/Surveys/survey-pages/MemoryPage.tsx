// src/surveys/surveyPages/MemoryPage.tsx

import React from 'react';
import GenericSurvey from '../generic-survey';

const MemoryPage: React.FC = () => {
  const surveyId = 'MemorySurvey'; // Corresponds to MemorySurvey.json

  return <GenericSurvey surveyId={surveyId} />;
};

export default MemoryPage;
