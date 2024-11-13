// src/Components/Games/GenericGame.tsx

import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { submitGameScore } from '../../store/gameSlice';
import { completeGame } from '../../store/progressSlice';
import { gamesAPI } from '../../services';
import ErrorBoundary from '../common/error-boundary';
import Loading from '../common/loading';
import { useSurveyAnalytics } from '../surveys/survey-hooks/use-survey-analytics';

interface GameData {
  score: number;
  metrics: {
    accuracy?: number;
    speed?: number;
    completion_time?: number;
    [key: string]: any;
  };
}

interface GenericGameProps<T extends GameData = GameData> {
  gameId: string;
  initializeGame: (
    containerId: string,
    callbacks: {
      onComplete: (data: T) => void;
      onLoad: () => void;
      onError?: (error: any) => void;
    }
  ) => void;
  destroyGame: (containerId: string) => void;
  title: string;
  containerId: string;
}

const GenericGame = <T extends GameData>({
  gameId,
  initializeGame,
  destroyGame,
  title,
  containerId,
}: GenericGameProps<T>) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isMember } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const { generateAnalytics, getChartData } = useSurveyAnalytics();

  // Check auth and membership
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isMember) {
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, isMember, navigate]);

  useEffect(() => {
    const handleComplete = async (data: T) => {
      try {
        // Submit game score
        dispatch(submitGameScore({ gameId, score: data.score }));
        dispatch(completeGame(gameId));

        // Send data to backend
        await gamesAPI.submitScore(gameId, data.score);

        // Generate analytics for display
        const analytics = generateAnalytics({
          responses: data.metrics,
          questions: [] // Games don't have questions
        });

        setShowResults(true);
        setLoading(false);

      } catch (err) {
        console.error(`Error submitting game score for ${gameId}:`, err);
        setError('Failed to submit game score. Please try again.');
        setLoading(false);
      }
    };

    const handleLoad = () => {
      setLoading(false);
    };

    const handleError = (err: any) => {
      console.error(`Error loading game ${gameId}:`, err);
      setError('Failed to load the game. Please try again.');
      setLoading(false);
    };

    // Initialize the game
    initializeGame(containerId, {
      onComplete: handleComplete,
      onLoad: handleLoad,
      onError: handleError,
    });

    // Cleanup on unmount
    return () => {
      destroyGame(containerId);
    };
  }, [dispatch, gameId, initializeGame, destroyGame, containerId, generateAnalytics]);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Loading />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()} 
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box
        sx={{
          padding: 4,
          backgroundColor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: 'primary.main', 
            fontWeight: 'bold',
            mb: 3
          }}
        >
          {title}
        </Typography>

        {!showResults ? (
          <Box
            sx={{
              width: '100%',
              maxWidth: 800,
              height: 600,
              backgroundColor: 'background.paper',
              boxShadow: (theme) => theme.shadows[4],
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div id={containerId} style={{ width: '100%', height: '100%' }}></div>
          </Box>
        ) : (
          <>
            {getChartData() && (
              <Box sx={{ width: '100%', maxWidth: 800 }}>
                {/* Display game performance analytics */}
                <Typography variant="h5" gutterBottom>
                  Game Performance
                </Typography>
                {/* Add visualization components here */}
                <Button 
                  variant="contained" 
                  onClick={handleContinue}
                  sx={{ mt: 4 }}
                >
                  Continue to Dashboard
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </ErrorBoundary>
  );
};

export default GenericGame;
