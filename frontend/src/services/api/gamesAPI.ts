import axios from './axios';
import { API_PATHS } from '../../constants/api-path-two';
import { GameScore, GameConfig, GameProgress } from '../../types/game-config-types';

export const gamesAPI = {
    submitScore: (gameId: string, score: number) => 
        axios.post<GameScore>(API_PATHS.GAMES.SCORES, { gameId, score }),
    
    getGameConfig: (gameId: string) => 
        axios.get<GameConfig>(API_PATHS.GAMES.DETAIL(gameId)),
    
    getUserScores: () => 
        axios.get<GameScore[]>(API_PATHS.GAMES.SCORES),
    
    getGameScores: (gameId: string) => 
        axios.get<GameScore[]>(`${API_PATHS.GAMES.SCORES}/${gameId}`),
    
    saveProgress: (gameId: string, progress: GameProgress) => 
        axios.post(`${API_PATHS.GAMES.PROGRESS}/${gameId}`, progress),
    
    getProgress: (gameId: string) => 
        axios.get<GameProgress>(`${API_PATHS.GAMES.PROGRESS}/${gameId}`),
    
    getAllGamesConfig: () => 
        axios.get<GameConfig[]>(API_PATHS.GAMES.CONFIG)
}; 