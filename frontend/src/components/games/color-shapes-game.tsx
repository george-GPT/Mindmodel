import React from 'react';
import { ColorShapes } from '@m2c2kit/assessment-color-shapes';
import GenericGame from './generic-game';

interface ColorShapesConfig {
  containerId: string;
  config?: {
    numTrials?: number;
    stimulusDuration?: number;
    fixationDuration?: number;
    feedbackDuration?: number;
    interTrialInterval?: number;
  };
  onComplete?: (result: any) => void;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

const ColorShapesGame: React.FC = () => {
  const GAME_ID = 'colorShapes';
  const CONTAINER_ID = 'color-shapes-container';

  const initializeGame = (containerId: string, callbacks: any) => {
    const game = new ColorShapes({
      containerId,
      numTrials: 10,
      stimulusDuration: 1000,
      fixationDuration: 500,
      feedbackDuration: 500,
      interTrialInterval: 1000,
      onComplete: callbacks.onComplete,
      onLoad: callbacks.onLoad,
      onError: callbacks.onError
    });
    game.start();
    return game;
  };

  const destroyGame = (containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
    }
  };

  return (
    <GenericGame
      gameId={GAME_ID}
      containerId={CONTAINER_ID}
      initializeGame={initializeGame}
      destroyGame={destroyGame}
      title="Color Shapes Assessment"
    />
  );
};

export default ColorShapesGame;