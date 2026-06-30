# BlogPage

A full-stack blog application built using **React**, **FastAPI**, and **PostgreSQL**. The application allows users to create, read, update, and delete blog posts through a modern and responsive interface.

## Live Demo

* **Frontend:** [https://blog-page-seven-rho.vercel.app](https://blog-page-seven-rho.vercel.app)
* **Backend API docs:** [https://blogpage-vcev.onrender.com/docs](https://blogpage-vcev.onrender.com/docs)

## Features

* Create, edit, and delete blog posts
* View all published blogs with pagination
* Responsive React-based user interface
* FastAPI-powered REST API
* PostgreSQL database integration
* Material-UI (MUI) components for modern UI
* Form validation and error handling
* Clean and scalable project structure
* CORS-enabled for cross-origin requests

## Tech Stack

### Frontend

* **React.js** - UI framework
* **Material-UI (MUI)** - React component library
* **JavaScript (ES6+)** - Programming language
* **CSS** - Styling

### Backend

* **FastAPI** - Modern Python web framework
* **SQLAlchemy** - SQL toolkit and ORM
* **Pydantic** - Data validation using Python type annotations
* **Uvicorn** - ASGI server

### Database

* **PostgreSQL** - Relational database
* **psycopg2-binary** - PostgreSQL adapter for Python
* **Neon** - Managed PostgreSQL hosting (production)

## Installation

### Prerequisites

* Node.js (v14 or higher)
* Python (v3.8 or higher)
* PostgreSQL database

### Clone the repository

```bash
git clone https://github.com/your-username/blogPage.git
cd blogPage
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment (recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Configure environment variables:

Create a `.env` file in the backend directory with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

> **Note:** Never commit `.env` files. In production, environment variables are set directly in the hosting platform's dashboard (see Deployment section below).

5. Run the backend server:

```bash
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the frontend directory with the following variables:

```env
REACT_APP_API_URL=http://localhost:8000
```

4. Start the development server:

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Documentation

After starting the backend, visit:

```text
http://localhost:8000/docs
```

to access the interactive Swagger API documentation.

### API Endpoints

* `GET /` - Health check endpoint
* `GET /blogs` - Retrieve all blogs with pagination support
* `POST /blogs` - Create a new blog post
* `PUT /blogs/{id}` - Update an existing blog post
* `DELETE /blogs/{id}` - Delete a blog post

## Project Structure

```text
blogPage/
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── blog-display/
│   │   │   ├── blogs/
│   │   │   └── inputForm/
│   │   ├── App.js        # Main application component
│   │   ├── App.css       # Application styles
│   │   └── index.js      # Application entry point
│   ├── package.json      # Frontend dependencies
│   └── .env              # Frontend environment variables (gitignored)
├── backend/
│   ├── database.py       # Database configuration
│   ├── main.py           # FastAPI application entry point
│   ├── model/            # Database models
│   ├── routes/           # API route definitions
│   ├── schema/           # Pydantic schemas
│   ├── requirements.txt  # Python dependencies
│   ├── runtime.txt       # Pinned Python version for deployment
│   └── .env              # Backend environment variables (gitignored)
└── README.md              # This file
```

## Usage

1. Start the PostgreSQL database
2. Configure the backend `.env` file with your database credentials
3. Start the backend server
4. Configure the frontend `.env` file with the backend API URL
5. Start the frontend development server
6. Open `http://localhost:3000` in your browser

## Development

### Running Tests

**Frontend:**
```bash
cd frontend
npm test
```

**Backend:**
```bash
cd backend
pytest
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `frontend/build` directory.

## Deployment

### Backend Deployment (Render)

The backend is deployed on [Render](https://render.com).

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Environment Variables | `DATABASE_URL`, `PYTHON_VERSION=3.11.9` |

Live URL: `https://blogpage-vcev.onrender.com`

### Frontend Deployment (Vercel)

The frontend is deployed on [Vercel](https://vercel.com).

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Environment Variables | `REACT_APP_API_URL` |

Live URL: `https://blog-page-seven-rho.vercel.app`

### Database (Production)

The production database is hosted on [Neon](https://neon.tech) (managed PostgreSQL). Local development can use any PostgreSQL instance.

### CORS Configuration

The backend CORS middleware is configured to allow requests only from the deployed frontend URL. Update `allow_origins` in `backend/main.py` when deploying to a different domain.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
