import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ASSESSMENT_TOTALS } from '@/utils/constants';

// Align with progressSlice state shape
interface ProgressState {
  completedSurveys: string[];
  completedGames: string[];
}

export const useProgress = () => {
  // Get state from progressSlice
  const { completedSurveys, completedGames } = useSelector(
    (state: RootState) => state.progress
  );

  const allCompleted = 
    completedSurveys.length === ASSESSMENT_TOTALS.SURVEYS && 
    completedGames.length === ASSESSMENT_TOTALS.GAMES;

  return {
    completedSurveys,
    completedGames,
    totalSurveys: ASSESSMENT_TOTALS.SURVEYS,
    totalGames: ASSESSMENT_TOTALS.GAMES,
    allCompleted
  };
}; 