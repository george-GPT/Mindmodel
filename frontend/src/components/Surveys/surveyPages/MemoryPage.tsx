// src/Surveys/surveyPages/MemoryPage.tsx

import React from 'react';
import GenericSurvey from '../GenericSurvey';

const MemoryPage: React.FC = () => {
  const surveyId = 'MemorySurvey'; // Corresponds to MemorySurvey.json

  return <GenericSurvey surveyId={surveyId} />;
};

export default MemoryPage;
