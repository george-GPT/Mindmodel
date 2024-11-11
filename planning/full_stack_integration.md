# Full Stack Integration Guide

## Overview
Documentation of integration points between frontend React components and backend Django services.

## Authentication Flow

### Frontend Implementation
```typescript
// services/auth/authService.ts
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/api/users/auth/login', credentials);
    tokenService.setTokens(response.data);
    return response.data;
};
```

### Backend Implementation
```python
# Apps/Users/views.py
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(**serializer.validated_data)
            tokens = generate_tokens(user)
            return Response(tokens)
```

## Survey Integration

### Frontend Components
```typescript
// components/Surveys/SurveyRenderer.tsx
const SurveyRenderer: React.FC<SurveyProps> = ({ surveyId }) => {
    const { data: survey } = useQuery(['survey', surveyId], getSurvey);
    
    const handleComplete = async (result: any) => {
        await submitSurveyResponse({
            surveyId,
            responses: result.data,
            metadata: {
                completionTime: result.timeSpent,
                platform: navigator.platform
            }
        });
    };

    return (
        <Survey.Survey
            json={survey.questions}
            onComplete={handleComplete}
            onPartialSave={handlePartialSave}
        />
    );
};
```

### Backend Processing
```python
# Apps/Surveys/views.py
class SurveyResponseView(APIView):
    def post(self, request):
        serializer = SurveyResponseSerializer(data=request.data)
        if serializer.is_valid():
            response = serializer.save(user=request.user)
            trigger_analysis.delay(response.id)
            return Response(status=201)
```

## Game Integration

### Frontend Game Loading
```typescript
// components/Games/GameLoader.tsx
const GameLoader: React.FC<GameProps> = ({ gameId }) => {
    const { game, metrics } = useM2C2Game(gameId);
    
    const handleGameComplete = async (result: GameResult) => {
        await submitGameScore({
            gameId,
            score: result.score,
            metrics: {
                accuracy: metrics.accuracy,
                reactionTime: metrics.reactionTime,
                completionTime: metrics.totalTime
            }
        });
    };

    return (
        <M2C2GameWrapper
            game={game}
            onComplete={handleGameComplete}
            onMetricsUpdate={handleMetricsUpdate}
        />
    );
};
```

### Backend Game Processing
```python
# Apps/Games/views.py
class GameScoreView(APIView):
    def post(self, request):
        serializer = GameScoreSerializer(data=request.data)
        if serializer.is_valid():
            score = serializer.save(user=request.user)
            update_user_progress.delay(request.user.id)
            return Response(status=201)
```

## AI Analysis Integration

### Frontend Trigger
```typescript
// components/Analysis/AnalysisTrigger.tsx
const AnalysisTrigger: React.FC = () => {
    const mutation = useMutation(triggerAnalysis);
    
    const handleAnalysis = async () => {
        const result = await mutation.mutateAsync({
            surveyData: await getSurveyResponses(),
            gameData: await getGameScores()
        });
        
        updateDashboard(result);
    };
};
```

### Backend Processing
```python
# Apps/AI/tasks.py
@shared_task
def process_analysis(data):
    analysis = analyze_user_data(data)
    generate_insights(analysis)
    update_recommendations(analysis)
    return analysis
```

## State Management

### Redux Toolkit Configuration
```typescript
// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { api } from './api';
import authReducer from './slices/authSlice';
import surveyReducer from './slices/surveySlice';
import gameReducer from './slices/gameSlice';
import analysisReducer from './slices/analysisSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'surveys', 'games']
};

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: persistReducer(persistConfig, authReducer),
        surveys: persistReducer(persistConfig, surveyReducer),
        games: persistReducer(persistConfig, gameReducer),
        analysis: analysisReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(api.middleware)
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);
```

### RTK Query Endpoints
```typescript
// store/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // Survey endpoints
        getSurveys: builder.query<Survey[], void>({
            query: () => 'surveys',
            providesTags: ['Surveys']
        }),
        submitSurvey: builder.mutation<void, SurveyResponse>({
            query: (data) => ({
                url: `surveys/${data.surveyId}/submit`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Surveys']
        }),

        // Game endpoints
        getGames: builder.query<Game[], void>({
            query: () => 'games',
            providesTags: ['Games']
        }),
        submitGameScore: builder.mutation<void, GameScore>({
            query: (data) => ({
                url: `games/${data.gameId}/score`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Games']
        }),

        // Analysis endpoints
        getAnalysis: builder.query<Analysis, string>({
            query: (id) => `analysis/${id}`,
            providesTags: ['Analysis']
        })
    })
});
```

## WebSocket Integration

### WebSocket Manager
```typescript
// services/websocket/WebSocketManager.ts
export class WebSocketManager {
    private static instance: WebSocketManager;
    private connections: Map<string, WebSocket> = new Map();
    private reconnectTimeouts: Map<string, NodeJS.Timeout> = new Map();

    static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }

    connect(path: string, handlers: WebSocketHandlers): WebSocket {
        const ws = new WebSocket(`ws://${window.location.host}/ws/${path}`);
        
        ws.onopen = () => {
            console.log(`Connected to ${path}`);
            handlers.onOpen?.();
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handlers.onMessage?.(data);
        };

        ws.onclose = () => {
            console.log(`Disconnected from ${path}`);
            this.handleReconnect(path, handlers);
            handlers.onClose?.();
        };

        ws.onerror = (error) => {
            console.error(`WebSocket error for ${path}:`, error);
            handlers.onError?.(error);
        };

        this.connections.set(path, ws);
        return ws;
    }

    private handleReconnect(path: string, handlers: WebSocketHandlers) {
        const timeout = setTimeout(() => {
            console.log(`Attempting to reconnect to ${path}`);
            this.connect(path, handlers);
        }, 5000);
        this.reconnectTimeouts.set(path, timeout);
    }

    disconnect(path: string) {
        const ws = this.connections.get(path);
        if (ws) {
            ws.close();
            this.connections.delete(path);
        }
        const timeout = this.reconnectTimeouts.get(path);
        if (timeout) {
            clearTimeout(timeout);
            this.reconnectTimeouts.delete(path);
        }
    }
}
```

### WebSocket Hooks
```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';
import { WebSocketManager } from '../services/websocket/WebSocketManager';

export const useWebSocket = (path: string, handlers: WebSocketHandlers) => {
    const wsManager = useRef(WebSocketManager.getInstance());

    useEffect(() => {
        const ws = wsManager.current.connect(path, handlers);
        return () => wsManager.current.disconnect(path);
    }, [path]);
};
```

## Integration Examples

### Survey with Real-time Updates
```typescript
const SurveyComponent: React.FC<{ surveyId: string }> = ({ surveyId }) => {
    const { data: survey } = api.useGetSurveyQuery(surveyId);
    const [submitResponse] = api.useSubmitSurveyMutation();
    
    useWebSocket(`survey/${surveyId}`, {
        onMessage: (data) => {
            if (data.type === 'update') {
                // Handle real-time updates
            }
        }
    });

    return (
        <Survey
            json={survey?.questions}
            onComplete={async (result) => {
                await submitResponse({
                    surveyId,
                    responses: result.data
                });
            }}
        />
    );
};
```

### Game with State Management
```typescript
const GameComponent: React.FC<{ gameId: string }> = ({ gameId }) => {
    const dispatch = useDispatch();
    const gameState = useSelector((state: RootState) => state.games[gameId]);
    const [submitScore] = api.useSubmitGameScoreMutation();

    useWebSocket(`game/${gameId}`, {
        onMessage: (data) => {
            dispatch(updateGameState({ gameId, data }));
        }
    });

    return (
        <M2C2Game
            config={gameState.config}
            onComplete={async (result) => {
                await submitScore({
                    gameId,
                    score: result.score,
                    metrics: result.metrics
                });
            }}
        />
    );
};
```

### Analysis Integration
```typescript
const AnalysisComponent: React.FC = () => {
    const [startAnalysis] = api.useStartAnalysisMutation();
    const dispatch = useDispatch();

    useWebSocket('analysis', {
        onMessage: (data) => {
            if (data.status === 'completed') {
                dispatch(updateAnalysisResults(data.results));
            }
        }
    });

    return (
        <Button
            onClick={() => startAnalysis()}
            disabled={analysisInProgress}
        >
            Start Analysis
        </Button>
    );
};
```

## Error Handling
```typescript
// utils/errorHandler.ts
export const handleApiError = (error: any) => {
    if (error.status === 401) {
        store.dispatch(logout());
        return;
    }

    if (error.status === 403) {
        store.dispatch(showError('Permission denied'));
        return;
    }

    store.dispatch(showError(error.data?.message || 'An error occurred'));
};
``` 