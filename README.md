# BlogPage

A full-stack blog application built using **React**, **FastAPI**, and **MySQL**. The application allows users to create, read, update, and delete blog posts through a modern and responsive interface.

## Features

* Create, edit, and delete blog posts
* View all published blogs
* Responsive React-based user interface
* FastAPI-powered REST API
* MySQL database integration
* Form validation and error handling
* Clean and scalable project structure

## Tech Stack

### Frontend

* React.js
* JavaScript
* HTML/CSS

### Backend

* FastAPI
* Python
* SQLAlchemy

### Database

* MySQL

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd blogPage
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

## API Documentation

After starting the backend, visit:

```text
http://localhost:8000/docs
```

to access the interactive Swagger API documentation.

## Project Structure

```text
blogPage/
├── frontend/
├── backend/
├── README.md
└── database/
```
