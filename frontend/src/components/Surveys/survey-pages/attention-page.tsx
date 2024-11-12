// src/surveys/surveyPages/AttentionPage.tsx

import React from 'react';
import GenericSurvey from '../generic-survey';

const AttentionPage: React.FC = () => {
  const surveyId = 'AttentionSurvey'; // Corresponds to attention-survey.json

  return <GenericSurvey surveyId={surveyId} />;
};

export default AttentionPage;
