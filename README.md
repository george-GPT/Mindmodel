# **MindModel**

## **Project Overview**
MindModel is a full-stack application with a React + TypeScript frontend and a Django-based backend. The project includes AI-driven cognitive profiling tools, API endpoints, and a structured frontend architecture to support scalable and maintainable development.

## **Folder Structure Summary**

### **Frontend: `frontend/mindmodel_frontend/`**
- **Initialize npm**: Pre-configured with React and TypeScript.
- **Install Dependencies**: Follow the steps in the frontend setup guide.
- **Environment Configuration**: Add API URLs and other frontend variables in `.env`.
- **Component Development**: Organize React components in `src/components/`.
- **Testing**: Set up and run Jest with React Testing Library.
- **Integrations**: Implement Sentry for error tracking and Google Analytics for analytics.

### **Backend: `backend/mindmodel_backend/`**
- **Set Up Virtual Environment**: Create and activate a `venv` for Python dependencies.
- **Install Dependencies**: Use `requirements.txt` to install Django and related packages.
- **API & AI Development**: Build Django apps, define API endpoints, and integrate AI models.
- **Environment Configuration**: Secure environment variables in `.env`.
- **Testing**: Write and run tests using pytest and Django's Testing Framework.

### **Documentation: `docs/`**
- **Documentation Setup**: Start writing and structuring docs.
- **Tools**: Optionally integrate Sphinx for backend docs, and Storybook for frontend components.

### **Root Directory**
- **`.gitignore`**: Ensures necessary files like `node_modules/`, `env/`, and `.env` are excluded.
- **`README.md`**: Overview of the project, setup instructions, and structure summary.

## **Setup Instructions**
1. **Frontend**: Navigate to `frontend` and follow the steps in the setup guide.
2. **Backend**: Navigate to `backend`, activate the virtual environment, and install dependencies.
3. **Documentation**: Start by navigating to the `docs/` folder and running Sphinx or MkDocs to build the documentation.

## **Common Scripts & Commands**

### **Backend Commands**

Database migrations

python manage.py makemigrations

python manage.py migrate

Run development server

python manage.py runserver
Create superuser
python manage.py createsuperuser