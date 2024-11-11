# Analytics and Results Documentation

## Overview
Comprehensive analytics system integrating:
- Real-time survey analytics
- Game performance metrics
- AI-driven analysis
- WebSocket updates

## AI Analysis Process

### Data Collection
```typescript
interface AnalysisData {
    userId: string;
    data: {
        surveys: {
            baseline: SurveyResponse;
            progress: SurveyResponse[];
            gameSpecific: SurveyResponse[];
        };
        games: {
            scores: GameScore[];
            metrics: GameMetrics[];
            progression: GameProgress[];
        };
    };
}
```

### Analysis Pipeline
```python
# Apps/AI/services/analysis_service.py
class AnalysisService:
    def __init__(self, user_id: int):
        self.user = User.objects.get(id=user_id)
        self.channel_layer = get_channel_layer()

    async def process_analysis(self):
        try:
            # 1. Data Collection
            data = await self.aggregate_user_data()
            
            # 2. Initial Processing
            await self.update_status('processing', 0.2)
            initial_results = await self.process_initial_metrics(data)
            
            # 3. AI Analysis
            await self.update_status('analyzing', 0.4)
            ai_insights = await self.generate_ai_insights(initial_results)
            
            # 4. Final Processing
            await self.update_status('finalizing', 0.8)
            final_results = await self.compile_results(initial_results, ai_insights)
            
            # 5. Save Results
            await self.save_results(final_results)
            await self.update_status('completed', 1.0)
            
            return final_results
        except Exception as e:
            await self.update_status('failed', error=str(e))
            raise
```

### WebSocket Integration

#### Backend Consumer
```python
# Apps/AI/consumers.py
class AnalysisConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.analysis_id = self.scope['url_route']['kwargs']['analysis_id']
        self.group_name = f'analysis_{self.analysis_id}'
        
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def analysis_update(self, event):
        await self.send(text_data=json.dumps({
            'type': event['type'],
            'status': event['status'],
            'progress': event['progress'],
            'data': event.get('data')
        }))
```

#### Frontend Integration
```typescript
// hooks/useAnalysis.ts
const useAnalysis = (analysisId: string) => {
    const [status, setStatus] = useState<AnalysisStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<AnalysisResults | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ws = new WebSocket(
            `ws://${window.location.host}/ws/analysis/${analysisId}/`
        );

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case 'status_update':
                    setStatus(data.status);
                    setProgress(data.progress);
                    break;
                case 'results_update':
                    setResults(data.results);
                    break;
                case 'error':
                    setError(data.error);
                    break;
            }
        };

        return () => ws.close();
    }, [analysisId]);

    return { status, progress, results, error };
};
```

## Error Handling

### Analysis Errors
```typescript
interface AnalysisError {
    type: 'data_collection' | 'processing' | 'ai_analysis' | 'connection';
    message: string;
    details?: any;
    recoverable: boolean;
}

const handleAnalysisError = async (error: AnalysisError) => {
    if (error.recoverable) {
        await retryAnalysis();
    } else {
        notifyUser(error.message);
        logError(error);
    }
};
```

### WebSocket Error Recovery
```typescript
class AnalysisWebSocket {
    private ws: WebSocket | null = null;
    private retryCount = 0;
    private maxRetries = 3;

    connect(analysisId: string) {
        this.ws = new WebSocket(
            `ws://${window.location.host}/ws/analysis/${analysisId}/`
        );

        this.ws.onerror = this.handleError.bind(this);
        this.ws.onclose = this.handleClose.bind(this);
    }

    private handleError(error: Event) {
        console.error('WebSocket error:', error);
        this.attemptReconnect();
    }

    private handleClose() {
        if (this.retryCount < this.maxRetries) {
            this.attemptReconnect();
        } else {
            this.handleFinalFailure();
        }
    }

    private attemptReconnect() {
        setTimeout(() => {
            this.retryCount++;
            this.connect(this.analysisId);
        }, Math.min(1000 * Math.pow(2, this.retryCount), 10000));
    }
}
```

## Results Display

### Progress Indicator
```typescript
const AnalysisProgress: React.FC<{
    status: AnalysisStatus;
    progress: number;
}> = ({ status, progress }) => (
    <Box>
        <LinearProgress 
            variant="determinate" 
            value={progress * 100} 
        />
        <Typography>
            {getStatusMessage(status)}
        </Typography>
    </Box>
);
```

### Results Visualization
```typescript
const AnalysisResults: React.FC<{
    results: AnalysisResults;
}> = ({ results }) => (
    <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
            <CognitiveProfile data={results.cognitive} />
        </Grid>
        <Grid item xs={12} md={6}>
            <PerformanceMetrics data={results.performance} />
        </Grid>
        <Grid item xs={12}>
            <RecommendationsPanel 
                recommendations={results.recommendations} 
            />
        </Grid>
    </Grid>
);
```

## Performance Optimization

### Data Caching
```typescript
const useAnalysisCache = (analysisId: string) => {
    return useQuery(
        ['analysis', analysisId],
        () => fetchAnalysis(analysisId),
        {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 30 * 60 * 1000, // 30 minutes
            refetchOnWindowFocus: false
        }
    );
};
```

### Progressive Loading
```typescript
const AnalysisView: React.FC = () => {
    const { results } = useAnalysis(analysisId);
    
    return (
        <Suspense fallback={<ProgressIndicator />}>
            <DeferredComponent>
                <AnalysisResults results={results} />
            </DeferredComponent>
        </Suspense>
    );
};