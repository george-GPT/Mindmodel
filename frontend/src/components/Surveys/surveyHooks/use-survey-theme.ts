import { useEffect } from 'react';
import { StylesManager } from 'survey-core';
import SurveyTheme from './survey-theme';

export const useSurveyTheme = () => {
  useEffect(() => {
    // Apply theme globally once
    StylesManager.applyTheme(SurveyTheme.themeName);
    
    // Apply CSS variables
    Object.entries(SurveyTheme.cssVariables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value as string);
    });

    // Apply custom CSS
    const style = document.createElement("style");
    style.innerHTML = SurveyTheme.customCSS;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return {
    surveyRootClass: [
      'sv-root-modern',
      `sv-${SurveyTheme.themeName}`,
      `colorPalette-${SurveyTheme.colorPalette}`,
      SurveyTheme.isPanelless ? 'isPanelless' : '',
    ].join(' ')
  };
}; 