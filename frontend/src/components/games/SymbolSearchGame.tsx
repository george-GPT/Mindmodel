import React from 'react';
import { SymbolSearch } from '@m2c2kit/assessment-symbol-search';
import GenericGame from './GenericGame';

const SymbolSearchGame: React.FC = () => {
  const GAME_ID = 'symbolSearch';
  const CONTAINER_ID = 'symbol-search-container';

  const initializeGame = (containerId: string, callbacks: any) => {
    const game = new SymbolSearch({
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
      title="Symbol Search Assessment"
    />
  );
};

export default SymbolSearchGame;
