// src/Surveys/surveyPages/AttentionPage.tsx

import React from 'react';
import GenericSurvey from '../generic-survey';

const AttentionPage: React.FC = () => {
  const surveyId = 'AttentionSurvey'; // Corresponds to AttentionSurvey.json

  return <GenericSurvey surveyId={surveyId} />;
};

export default AttentionPage;
