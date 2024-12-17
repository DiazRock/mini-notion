import pytest
from fastapi.testclient import TestClient
from app.dep_container import get_db
from app.main import app

@pytest.fixture(scope='module')
def mock_db():
    from sqlalchemy.orm import sessionmaker
    from sqlalchemy import create_engine
    from sqlalchemy.ext.declarative import declarative_base

    # In-memory SQLite for testing
    engine = create_engine("sqlite:///:memory:")
    SessionLocal = sessionmaker(bind=engine)

    # Base model setup
    Base = declarative_base()

    # Mock `User`, `Note`, and `Task` tables in the database
    Base.metadata.create_all(bind=engine)

    session = SessionLocal()
    yield session
    session.close()


@pytest.fixture
def client(mock_db):

    def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    #app.dependency_overrides.clear()


def test_user_flow(client):

    # Register User
    response = client.post(
        "/auth/register",
        json={"username": "test_user", "password": "test_pass"},
    )
    assert response.status_code == 201
    assert response.json() == {"message": "User registered successfully"}

    # Login User
    response = client.post(
        "/auth/login",
        json={"username": "test_user", "password": "test_pass"},
    )
    assert response.status_code == 200
    token = response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # Create Note
    note_data = {
            "title": "Test Note", 
            "content": "This is a test.", 
            "tags": ["tag1"]
        }
    
    response = client.post("/notes/", json=note_data, headers=headers)
    assert response.status_code == 200
    note = response.json()
    assert note["title"] == "Test Note"

    # Create Task
    task_data = {
        "id": 1,
        "title": "Test Task",
        "description": "A simple task",
        "priority": "High",
        "due_date": "2024-12-31",
        "status": "Pending",
    }
    response = client.post("/tasks/", json=task_data, headers=headers)
    assert response.status_code == 200
    task = response.json()
    assert task["title"] == "Test Task"

    # Search for Note and Task
    search_query = "Test"
    response = client.get(f"/search/?query={search_query}", headers=headers)
    assert response.status_code == 200
    search_results = response.json()
    assert any(item["title"] == "Test Note" for item in search_results)
    assert any(item["title"] == "Test Task" for item in search_results)
