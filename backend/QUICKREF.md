# Mindmodel Quick Reference

## Django Commands

### Server
- `python manage.py runserver` - Start dev server

### Database
- `python manage.py makemigrations` - Create migrations
- `python manage.py migrate` - Apply migrations
- `python manage.py showmigrations` - Check status

### Testing
- `pytest` - Run all tests
- `pytest path/to/test.py` - Run specific test
- `pytest -k "test_name"` - Run tests by name
- `pytest -v` - Verbose output
- `pytest --cov` - Coverage report

### Admin
- `python manage.py createsuperuser` - Create admin user
- `python manage.py shell` - Django shell

## React Commands
- `npm start` - Dev server
- `npm test` - Run tests
- `npm run build` - Production build

## API Documentation
- Frontend Swagger: `http://localhost:3000/api/docs/`
- Backend Swagger: `http://localhost:8000/api/docs/`
- Raw Schema: `http://localhost:8000/api/schema/`

## API Routes
- Admin: `/admin/`
- Auth: `/api/users/auth/`
- Games: `/api/games/`
- Surveys: `/api/surveys/`
- AI: `/api/ai/`

## Common Issues
### Module not found
- Check imports use 'mindmodel.core'
- Verify settings.py paths

