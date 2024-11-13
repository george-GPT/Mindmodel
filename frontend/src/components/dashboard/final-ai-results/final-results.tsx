import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Alert,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { startProcessing, processingSuccess, processingFailure } from '../../../store/analysisSlice';
import { aiAPI } from '../../../services';

const FinalResults: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    
    // Get state from Redux
    const auth = useSelector((state: RootState) => state.auth);
    const { processingStatus, results } = useSelector((state: RootState) => state.analysis);
    const surveys = useSelector((state: RootState) => state.surveys.responses);
    const games = useSelector((state: RootState) => state.games.scores);

    // WebSocket connection for real-time updates
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        return () => {
            // Cleanup WebSocket connection
            if (ws) {
                ws.close();
            }
        };
    }, [ws]);

    const handleGetResults = async () => {
        try {
            setError(null);
            dispatch(startProcessing());

            // Trigger analysis
            const response = await aiAPI.aggregateResults(auth.user?.id || 0);

            // If successful, set up WebSocket connection to monitor progress
            if (response.data.task_id) {
                const wsUrl = `ws://${window.location.host}/ws/ai/analysis/${response.data.task_id}/`;
                const newWs = new WebSocket(wsUrl);

                newWs.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    
                    if (data.status === 'completed') {
                        dispatch(processingSuccess(data.results));
                        newWs.close();
                    } else if (data.status === 'failed') {
                        dispatch(processingFailure(data.error));
                        setError(data.error);
                        newWs.close();
                    }
                };

                newWs.onerror = () => {
                    dispatch(processingFailure('WebSocket connection failed'));
                    setError('Connection error occurred');
                };

                setWs(newWs);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'An error occurred while processing your request';
            dispatch(processingFailure(errorMessage));
            setError(errorMessage);
        }
    };

    const renderContent = () => {
        if (processingStatus === 'loading') {
            return (
                <Box display="flex" alignItems="center" gap={2}>
                    <CircularProgress size={24} />
                    <Typography>Analyzing your data...</Typography>
                </Box>
            );
        }

        if (results) {
            return (
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>Your Analysis Results:</Typography>
                    {results.insights && (
                        <Box mb={3}>
                            <Typography variant="subtitle1" gutterBottom>Insights:</Typography>
                            <Typography>{results.insights}</Typography>
                        </Box>
                    )}
                    {results.charts && (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>Visualizations:</Typography>
                            {/* Render charts here */}
                        </Box>
                    )}
                </Box>
            );
        }

        return null;
    };

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Final Results
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleGetResults} 
                disabled={processingStatus === 'loading'}
            >
                {processingStatus === 'loading' ? 'Processing...' : 'Get Analysis'}
            </Button>

            {renderContent()}
        </Box>
    );
};

export default FinalResults;