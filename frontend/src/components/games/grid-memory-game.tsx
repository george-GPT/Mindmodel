// src/Components/Games/GridMemoryGame.tsx

import React from 'react';
import { GridMemory } from '@m2c2kit/assessment-grid-memory';
import GenericGame from './generic-game';

const GridMemoryGame: React.FC = () => {
  const GAME_ID = 'gridMemory';
  const CONTAINER_ID = 'grid-memory-container';

  const initializeGame = (containerId: string, callbacks: any) => {
    const game = new GridMemory({
      containerId,
      onComplete: callbacks.onComplete,
      onLoad: callbacks.onLoad,
      onError: callbacks.onError
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
      title="Grid Memory Assessment"
    />
  );
};

export default GridMemoryGame;
