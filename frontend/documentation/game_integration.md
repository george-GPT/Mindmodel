# Game Integration Documentation

## Overview
Integration of M2C2Kit cognitive games via npm packages, with:
- Local game hosting and state management
- Custom data handling and persistence
- Performance tracking within our application
- Pre/post survey integrations

## M2C2Kit Integration

### Package Installation
```bash
# Install M2C2Kit packages
npm install @m2c2kit/core
npm install @m2c2kit/assessment-n-back
npm install @m2c2kit/assessment-symbol-search
npm install @m2c2kit/assessment-task-switching
```

### Game Component Wrapper
```typescript
// components/Games/M2C2GameWrapper.tsx
import { useEffect, useRef } from 'react';
import { M2C2Game, GameConfig } from '@m2c2kit/core';
import { useGameState } from 'hooks/useGameState';

interface M2C2WrapperProps {
    gameId: string;
    config: GameConfig;
    onComplete: (result: GameResult) => void;
    onProgress?: (metrics: GameMetrics) => void;
}

const M2C2GameWrapper: React.FC<M2C2WrapperProps> = ({
    gameId,
    config,
    onComplete,
    onProgress
}) => {
    const gameRef = useRef<HTMLDivElement>(null);
    const { saveState, loadState } = useGameState(gameId);

    useEffect(() => {
        if (!gameRef.current) return;

        // Initialize game locally
        const game = new M2C2Game({
            container: gameRef.current,
            config: {
                ...config,
                onStateChange: (state) => {
                    saveState(state);
                    onProgress?.(state.metrics);
                },
                onComplete: (result) => {
                    onComplete(result);
                }
            }
        });

        // Load saved state if exists
        const savedState = loadState();
        if (savedState) {
            game.loadState(savedState);
        }

        return () => game.destroy();
    }, [gameId]);

    return <div ref={gameRef} className="game-container" />;
};
```

## Game State Management

### Local State Storage
```typescript
// hooks/useGameState.ts
export const useGameState = (gameId: string) => {
    const saveState = (state: GameState) => {
        localStorage.setItem(`game_${gameId}`, JSON.stringify(state));
    };

    const loadState = (): GameState | null => {
        const saved = localStorage.getItem(`game_${gameId}`);
        return saved ? JSON.parse(saved) : null;
    };

    return { saveState, loadState };
};
```

### Performance Tracking
```typescript
interface GameMetrics {
    accuracy: number;
    reactionTime: number;
    completionTime: number;
    errorRate: number;
    level: number;
}

const useGameMetrics = (gameId: string) => {
    const [metrics, setMetrics] = useState<GameMetrics>({
        accuracy: 0,
        reactionTime: 0,
        completionTime: 0,
        errorRate: 0,
        level: 1
    });

    const updateMetrics = (newMetrics: Partial<GameMetrics>) => {
        setMetrics(prev => ({
            ...prev,
            ...newMetrics
        }));
    };

    return { metrics, updateMetrics };
};
```

## Game Implementation

### N-Back Task
```typescript
import { NBackGame } from '@m2c2kit/assessment-n-back';

const NBackWrapper: React.FC = () => {
    const { metrics, updateMetrics } = useGameMetrics('nback');
    const [submitScore] = useSubmitGameScoreMutation();

    const handleComplete = async (result: GameResult) => {
        await submitScore({
            gameId: 'nback',
            score: result.score,
            metrics: metrics
        });
    };

    return (
        <M2C2GameWrapper
            gameId="nback"
            config={NBackGame.defaultConfig}
            onComplete={handleComplete}
            onProgress={updateMetrics}
        />
    );
};
```

### Symbol Search
```typescript
import { SymbolSearchGame } from '@m2c2kit/assessment-symbol-search';

const SymbolSearchWrapper: React.FC = () => {
    // Similar implementation to N-Back
};
```

## Data Flow

### Game Session Flow
1. Load game component from npm package
2. Initialize with local configuration
3. Track performance metrics internally
4. Store state in local storage
5. Submit results to our backend

### Performance Data Structure
```typescript
interface GamePerformanceData {
    gameId: string;
    userId: string;
    session: {
        startTime: Date;
        endTime: Date;
        duration: number;
    };
    metrics: GameMetrics;
    state: GameState;
}
```

## Integration Points

### Pre-Game Survey
```typescript
const GameFlow: React.FC = () => {
    const [stage, setStage] = useState<'survey' | 'game' | 'complete'>('survey');
    
    return (
        <>
            {stage === 'survey' && (
                <PreGameSurvey onComplete={() => setStage('game')} />
            )}
            {stage === 'game' && (
                <M2C2GameWrapper
                    onComplete={() => setStage('complete')}
                />
            )}
            {stage === 'complete' && <GameResults />}
        </>
    );
};
```

### Performance Tracking
```typescript
const trackGamePerformance = async (metrics: GameMetrics) => {
    try {
        await api.post('/api/games/performance', {
            gameId,
            metrics,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        // Handle error
    }
};
```

## Error Handling

### Game-Specific Errors
```typescript
const handleGameError = (error: GameError) => {
    if (error.type === 'initialization') {
        // Handle initialization errors
    } else if (error.type === 'runtime') {
        // Handle runtime errors
    }
};
```

## Performance Optimization

### Resource Management
- Lazy load game components
- Unload resources on component unmount
- Cache game assets locally

### State Persistence
- Save game state periodically
- Handle interruptions gracefully
- Implement resume functionality