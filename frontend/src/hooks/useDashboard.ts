// src/hooks/useDashboard.ts
import { useMemo } from 'react';
import { useProgress } from './useProgress';
import { useSelector } from 'react-redux';
import { DashboardSection } from '@/types/dashboard';
import { RootState } from '@/store/store';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import type { SvgIconTypeMap } from '@mui/material';
import type { OverridableComponent } from '@mui/material/OverridableComponent';

export const useDashboard = () => {
  const { 
    completedSurveys, 
    completedGames, 
    totalSurveys, 
    totalGames,
    allCompleted 
  } = useProgress();

  const surveyAnalytics = useSelector((state: RootState) => state.surveys?.analytics ?? null);

  const sections = useMemo<DashboardSection[]>(() => [
    {
      icon: AssessmentIcon as unknown as DashboardSection['icon'],
      title: "Surveys Completed",
      progress: completedSurveys.length,
      total: totalSurveys,
      buttonText: completedSurveys.includes('BaselineSurvey') ? 
        "View All Surveys" : "Start Baseline Survey",
      route: '/app/surveys',
      tooltipText: completedSurveys.includes('BaselineSurvey') ? 
        "View and complete remaining surveys" : 
        "Complete baseline survey to unlock all assessments",
      color: 'primary' as const,
      analytics: surveyAnalytics
    },
    {
      icon: SportsEsportsIcon as unknown as DashboardSection['icon'],
      title: "Games Completed",
      progress: completedGames.length,
      total: totalGames,
      buttonText: "View Games",
      route: '/app/games',
      tooltipText: "Play and complete games",
      color: 'secondary' as const
    }
  ], [completedSurveys, completedGames, totalSurveys, totalGames, surveyAnalytics]);

  return {
    sections,
    allCompleted
  };
};