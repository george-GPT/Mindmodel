# Survey Integration Documentation

## Overview
Integration of SurveyJS and survey-analytics for comprehensive survey functionality:
- Dynamic survey rendering (SurveyJS)
- Real-time analytics (survey-analytics)
- WebSocket progress updates
- Dashboard integration

## Survey Analytics Integration

### Package Setup
```typescript
// Import survey-analytics components
import { VisualizationPanel } from 'survey-analytics';
import { PlotlyChart } from 'survey-analytics/plot';
import 'survey-analytics/survey.analytics.css';

// Register visualizers
VisualizationPanel.registerVisualizer('chart', PlotlyChart);
```

### Analytics Component
```typescript
interface SurveyAnalyticsProps {
    surveyData: Survey;
    responses: SurveyResponse[];
    visualizers?: string[];
}

const SurveyAnalytics: React.FC<SurveyAnalyticsProps> = ({
    surveyData,
    responses,
    visualizers = ['frequency', 'numeric', 'text', 'datatable']
}) => {
    const options = {
        allowHideQuestions: false,
        allowDynamicLayout: true,
        allowShowPercentages: true,
        allowShowMean: true,
        allowShowMedian: true
    };

    return (
        <VisualizationPanel
            survey={surveyData}
            data={responses}
            options={options}
            visualizers={visualizers}
        />
    );
};
```

### Real-time Updates
```typescript
// WebSocket connection for live updates
const useSurveyWebSocket = (surveyId: string) => {
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket(
            `ws://${window.location.host}/ws/survey/${surveyId}/`
        );

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'new_response') {
                setResponses(prev => [...prev, data.response]);
            }
        };

        return () => ws.current?.close();
    }, [surveyId]);

    return responses;
};
```

## Survey Types & Analytics

### Baseline Survey
- No immediate analytics
- Data stored for comparison
- Used in AI analysis

### Progress Surveys
```typescript
interface ProgressAnalytics {
    completion_rate: number;
    time_spent: number;
    question_scores: Record<string, number>;
    improvement_areas: string[];
}

const ProgressAnalytics: React.FC<{surveyId: string}> = ({ surveyId }) => {
    const responses = useSurveyWebSocket(surveyId);
    
    return (
        <SurveyAnalytics
            surveyData={surveyData}
            responses={responses}
            visualizers={['frequency', 'numeric', 'chart']}
        />
    );
};
```

### Game-Related Surveys
```typescript
interface GameSurveyAnalytics extends ProgressAnalytics {
    pre_game_state: Record<string, any>;
    post_game_performance: GameMetrics;
    correlation_analysis: Record<string, number>;
}
```

## Analytics Dashboard Integration

### Real-time Visualization
```typescript
const SurveyDashboard: React.FC = () => {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>();
    
    useEffect(() => {
        const ws = new WebSocket(`ws://${window.location.host}/ws/analytics/`);
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setAnalyticsData(data);
        };
        return () => ws.close();
    }, []);

    return (
        <DashboardLayout>
            <ResponseRateChart data={analyticsData?.responseRates} />
            <CompletionTimeChart data={analyticsData?.completionTimes} />
            <QuestionAnalysisGrid data={analyticsData?.questionAnalysis} />
        </DashboardLayout>
    );
};
```

### Analytics Storage
```typescript
interface AnalyticsData {
    survey_id: string;
    response_count: number;
    completion_rate: number;
    average_time: number;
    question_stats: {
        [questionId: string]: {
            response_distribution: Record<string, number>;
            average_score?: number;
            completion_time: number;
        };
    };
}
```

## Performance Optimizations

### Data Loading
```typescript
const useAnalyticsData = (surveyId: string) => {
    return useQuery(['survey-analytics', surveyId], 
        () => fetchAnalytics(surveyId),
        {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 30 * 60 * 1000, // 30 minutes
            refetchOnWindowFocus: false
        }
    );
};
```

### Visualization Optimization
```typescript
const LazyVisualizationPanel = lazy(() => 
    import('survey-analytics').then(module => ({
        default: module.VisualizationPanel
    }))
);

const OptimizedAnalytics: React.FC<SurveyAnalyticsProps> = (props) => {
    return (
        <Suspense fallback={<AnalyticsLoader />}>
            <LazyVisualizationPanel {...props} />
        </Suspense>
    );
};
```

### WebSocket Management
```typescript
class AnalyticsWebSocket {
    private static instance: WebSocket;
    private static subscribers: Set<(data: any) => void> = new Set();

    static connect() {
        if (!this.instance) {
            this.instance = new WebSocket(
                `ws://${window.location.host}/ws/analytics/`
            );
            this.instance.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.subscribers.forEach(callback => callback(data));
            };
        }
        return this.instance;
    }

    static subscribe(callback: (data: any) => void) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
}