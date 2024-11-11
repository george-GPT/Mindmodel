// src/surveys/surveyPages/BaselinePage.tsx

import React from 'react';
import GenericSurvey from '../generic-survey';

const BaselinePage: React.FC = () => {
  const surveyId = 'BaselineSurvey'; // Corresponds to BaselineSurvey.json

  return <GenericSurvey surveyId={surveyId} />;
};

export default BaselinePage;
