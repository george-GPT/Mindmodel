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

### Authentication
- POST `/api/users/auth/login/` - User login
- POST `/api/users/auth/logout/` - User logout
- POST `/api/users/auth/token/` - Obtain JWT token
- POST `/api/users/auth/token/refresh/` - Refresh JWT token
- POST `/api/users/auth/social-auth/` - Social authentication

### User Management
- POST `/api/users/member/register/` - User registration
- GET `/api/users/member/me/` - Get user profile
- PATCH `/api/users/member/profile/` - Update user profile

### Surveys
- GET `/api/surveys/` - List Surveys
- POST `/api/surveys/` - Create Survey
- GET `/api/surveys/<id>/` - Retrieve Survey
- PUT `/api/surveys/<id>/` - Update Survey
- DELETE `/api/surveys/<id>/` - Delete Survey
- GET `/api/surveys/responses/` - List Survey Responses
- POST `/api/surveys/responses/` - Submit Survey Response

### Games
- GET `/api/games/` - List Games
- POST `/api/games/` - Create Game
- GET `/api/games/<id>/` - Retrieve Game
- PUT `/api/games/<id>/` - Update Game
- DELETE `/api/games/<id>/` - Delete Game
- GET `/api/games/scores/` - List Game Scores
- POST `/api/games/scores/` - Submit Game Score

### AI
- POST `/api/ai/generate-analysis/` - Generate AI Analysis

## Frontend Setup

- **Navigate to Frontend Directory:**

    ```bash
    cd Frontend
    ```

- **Install Dependencies:**

    ```bash
    npm install
    ```

- **Run Frontend Development Server:**

    ```bash
    npm start
    ```

## Testing

- **Run Backend Tests:**

    ```bash
    cd Backend
    pytest
    ```

# Backend Testing

## Running Tests

To run all tests:

```bash
# Run all tests
pytest

# Run tests with detailed output
pytest -v

# Run tests in a specific file
pytest path/to/test_file.py

# Run a specific test function
pytest path/to/test_file.py::test_function_name

# Run tests matching a pattern
pytest -k "test_pattern"
```

### Test Categories
```bash
# Run unit tests only
pytest -m unit

# Run integration tests only
pytest -m integration

# Run all tests except slow ones
pytest -m "not slow"
```

### Coverage Reports
```bash
# Generate coverage report
pytest --cov=apps

# Generate detailed HTML coverage report
pytest --cov=apps --cov-report=html

# Generate coverage with missing lines
pytest --cov=apps --cov-report=term-missing
```

### Debugging
```bash
# Show print statements in tests
pytest -s

# Stop on first failure
pytest -x

# Show local variables in failures
pytest -l

# Enter PDB on first failure
pytest --pdb
```

### Parallel Testing
```bash
# Run tests in parallel
pytest -n auto

# Run tests in parallel with 4 processes
pytest -n 4
```

### Additional Options
```bash
# Show slowest test durations
pytest --durations=10

# Rerun only failed tests
pytest --lf

# Clear test cache
pytest --cache-clear
```

To install all testing dependencies:
```bash
pip install pytest pytest-django pytest-cov pytest-xdist
```

## Testing Commands

### Basic Commands
```bash
# Run all tests
pytest

# Run tests with detailed output
pytest -v

# Run tests in a specific file
pytest path/to/test_file.py

# Run a specific test function
pytest path/to/test_file.py::test_function_name

# Run tests matching a pattern
pytest -k "test_pattern"
```

### Test Categories
```bash
# Run unit tests only
pytest -m unit

# Run integration tests only
pytest -m integration

# Run all tests except slow ones
pytest -m "not slow"
```

### Coverage Reports
```bash
# Generate coverage report
pytest --cov=apps

# Generate detailed HTML coverage report
pytest --cov=apps --cov-report=html

# Generate coverage with missing lines
pytest --cov=apps --cov-report=term-missing
```

### Debugging
```bash
# Show print statements in tests
pytest -s

# Stop on first failure
pytest -x

# Show local variables in failures
pytest -l

# Enter PDB on first failure
pytest --pdb
```

### Parallel Testing
```bash
# Run tests in parallel
pytest -n auto

# Run tests in parallel with 4 processes
pytest -n 4
```

### Additional Options
```bash
# Show slowest test durations
pytest --durations=10

# Rerun only failed tests
pytest --lf

# Clear test cache
pytest --cache-clear
```

To install all testing dependencies:
```bash
pip install pytest pytest-django pytest-cov pytest-xdist
```