# Mindmodel.io Assessments Project

## Backend Setup

1. **Navigate to Backend Directory:**

    ```bash
    cd Backend
    ```

2. **Create Virtual Environment:**

    ```bash
    python3 -m venv env
    ```

3. **Activate Virtual Environment:**

    - **macOS/Linux:**

        ```bash
        source env/bin/activate
        ```

    - **Windows:**

        ```bash
        env\Scripts\activate
        ```

4. **Install Dependencies:**

    ```bash
    pip install -r requirements/base.txt
    ```

5. **Apply Migrations:**

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

6. **Create Superuser:**

    ```bash
    python manage.py createsuperuser
    ```

7. **Run Development Server:**

    ```bash
    python manage.py runserver
    ```

## API Endpoints

# API Documentation

## Authentication
- POST `/api/auth/login/` - User login
- POST `/api/auth/refresh/` - Refresh authentication token
- POST `/api/auth/logout/` - User logout

## User Management
- POST `/api/users/member/register/` - User registration
- GET `/api/users/member/me/` - Get user profile
- PATCH `/api/users/member/profile/` - Update user profile

## Games
- GET `/api/games/games/` - List all games
- POST `/api/games/games/` - Create new game
- GET `/api/games/games/{id}/` - Get specific game
- PUT `/api/games/games/{id}/` - Update game
- PATCH `/api/games/games/{id}/` - Partial update game
- DELETE `/api/games/games/{id}/` - Delete game

### Game Configuration
- GET `/api/games/config/` - List game configurations
- GET `/api/games/config/{id}/` - Get specific game configuration

### Game Progress
- GET `/api/games/progress/` - List user's game progress
- POST `/api/games/progress/` - Create game progress
- GET `/api/games/progress/{id}/` - Get specific progress
- PUT `/api/games/progress/{id}/` - Update progress
- PATCH `/api/games/progress/{id}/` - Partial update progress
- DELETE `/api/games/progress/{id}/` - Delete progress

### Game Scores
- GET `/api/games/scores/` - List game scores
- POST `/api/games/scores/` - Submit game score

## Surveys
- GET `/api/surveys/` - List all surveys
- GET `/api/surveys/{id}/` - Get specific survey
- POST `/api/surveys/{id}/submit/` - Submit survey response


## Authentication
All endpoints except login and register require JWT authentication:
- Header: `Authorization: Bearer <token>`
- Cookie: `sessionid`
pytest
