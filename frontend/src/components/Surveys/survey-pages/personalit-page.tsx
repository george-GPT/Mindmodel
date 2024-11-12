// src/surveys/surveyPages/PersonalityPage.tsx

import React from 'react';
import GenericSurvey from '../generic-survey';

const PersonalityPage: React.FC = () => {
  const surveyId = 'PersonalitySurvey'; // Corresponds to PersonalitySurvey.json

  return <GenericSurvey surveyId={surveyId} />;
};

export default PersonalityPage;
