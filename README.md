# Mini-notion app in FastApi

This is a FastAPI-based application that allows users to perform the following operations:

1. User Authentication:
    * Register new users
    * Log in to obtain a JWT token

2. Notes Management:
   * Create, retrieve, and delete notes

3. Tasks Management:
   * Create, update, retrieve, and delete tasks

4. Search:
   * Search for notes and tasks by query strings


## Features

* Authentication using JWT tokens.
* Database Support via SQLAlchemy ORM (SQLite by default).
* Dependency Overrides for clean unit tests and mocks.
* Integration Tests using pytest and in-memory SQLite.


---

## Table of Contents

- [Mini-notion app in FastApi](#mini-notion-app-in-fastapi)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Backend installation](#backend-installation)
    - [Frontend installation](#frontend-installation)
  - [Running the application](#running-the-application)
  - [Running tests](#running-tests)
  - [Api documentation](#api-documentation)


## Installation

1. Clone repository

```bash
    git clone https://github.com/DiazRock/mini-notion.git
    cd mini-notion/
```

### Backend installation

1.1. **Go to the backend directory**

```bash
    cd ./backend
```

1.2. **Setup a virtual environment** (recommended):
   * For Linux
   ```bash
        python3 -m venv venv
        source /venv/bin/activate
   ```
   * For Windows
   ```bash
        python -m venv venv
        .\.venv\Scripts\activate

   ```

1.3. **Install dependencies**:
   
   ```bash
        pip install -r requirements.txt
   ```

### Frontend installation

1.1. Go to frontend directory

```bash
    cd ./frontend
```

1.2. Install dependencies

```bash
    npm i

```

## Running the application

The recommend way to run the application is using the `docker-compose.yaml` manifest the application has in the root directory

```bash
    docker-compose up --build # Use --build if it is the first time you run the application
```

## Running tests

For running the tests in backend, you must be sure of having `pytest`. Then from the root of the app:

```bash
    cd ./backend
    pytest

```

For running the tests in frontend, you just can execute:

```bash
    cd ./frontend
    npm run test
```

## Api documentation

This application uses **Swagger UI** for  for interactive API documentation. Once the app is running, you can access the API documentation here:

* Swagger UI: http://127.0.0.1:8000/docs
* ReDoc: http://127.0.0.1:8000/redoc