import React from 'react';
import { ColorDots } from '@m2c2kit/assessment-color-dots';
import GenericGame from './generic-game';

const ColorDotsGame: React.FC = () => {
  const GAME_ID = 'colorDots';
  const CONTAINER_ID = 'color-dots-container';

  const initializeGame = (containerId: string, callbacks: any) => {
    const game = new ColorDots({
      containerId,
      onComplete: callbacks.onComplete,
      onLoad: callbacks.onLoad
    });
    game.start();
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
      title="Color Dots Assessment"
    />
  );
};

export default ColorDotsGame; 