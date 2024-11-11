// src/Surveys/surveyPages/PersonalityPage.tsx

import React from 'react';
import GenericSurvey from '../GenericSurvey';

const PersonalityPage: React.FC = () => {
  const surveyId = 'PersonalitySurvey'; // Corresponds to PersonalitySurvey.json

  return <GenericSurvey surveyId={surveyId} />;
};

export default PersonalityPage;
