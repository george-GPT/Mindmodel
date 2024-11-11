# API Documentation

## Authentication
POST /api/auth/login/
- Request: { username, password }
- Response: { access, refresh, user }

## Surveys
GET /api/surveys/
- Headers: Authorization: Bearer <token>
- Response: List of surveys with completion status

## Games
GET /api/games/
- Headers: Authorization: Bearer <token>
- Response: List of games with progress

## AI Analysis
POST /api/ai/aggregate/
- Headers: Authorization: Bearer <token>
- Response: Analysis task ID and status