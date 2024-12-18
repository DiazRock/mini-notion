import pytest
from unittest.mock import MagicMock
from sqlalchemy.orm import Session
from app.models import Task, User
from app.schemas import TaskDTO
from app.repositories import TasksRepository


@pytest.fixture
def mock_session():
    """Fixture to provide a mocked SQLAlchemy session."""
    return MagicMock(spec=Session)


@pytest.fixture
def tasks_repository(mock_session):
    """Fixture to provide TasksRepository instance with mocked session."""
    return TasksRepository(db=mock_session)


@pytest.fixture
def test_user():
    """Fixture for a mock user."""
    return User(id=1, username="test_user", hashed_password="hashed_password")


@pytest.fixture
def test_task_dto():
    """Fixture for a TaskDTO input."""
    return TaskDTO(
        id = 1,
        title="Test Task",
        description="A test task description",
        priority="High",
        due_date="2024-12-31",
        status="Pending",
    )


@pytest.fixture
def test_task():
    """Fixture for a mock Task."""
    return Task(
        id=1,
        title="Test Task",
        description="A test task description",
        priority="HIGH",
        due_date="2024-12-31",
        status="PENDING",
        user_id=1,
    )


def test_get_tasks_by_user_id(tasks_repository, mock_session, test_user, test_task):
    """Test retrieving tasks for a user."""
    mock_session.query(Task).filter().all.side_effect = lambda : [test_task]

    result = tasks_repository.get_tasks_by_user_id(test_user.id)

    mock_session.query.assert_called_with(Task)
    mock_session.query().filter.assert_called()
    mock_session.query().filter().all.assert_called()
    assert result == [test_task]


def test_create_task(tasks_repository, mock_session, test_user, test_task_dto, test_task):
    """Test creating a task."""
    mock_session.refresh = MagicMock()
    mock_session.commit = MagicMock()
    mock_session.add = MagicMock()

    def mock_refresh(instance):
        instance.id = test_task.id

    mock_session.refresh.side_effect = mock_refresh

    new_task = tasks_repository.create_task(test_task_dto, test_user)

    mock_session.add.assert_called_once_with(new_task)
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once_with(new_task)
    assert new_task.title == test_task_dto.title
    assert new_task.description == test_task_dto.description
    assert new_task.priority == test_task_dto.priority
    assert new_task.due_date == test_task_dto.due_date
    assert new_task.status == test_task_dto.status
    assert new_task.user_id == test_user.id


def test_delete_task_found(tasks_repository, mock_session, test_task):
    """Test deleting a task when it exists."""
    mock_session.query(Task).filter().first.side_effect = lambda: test_task
    mock_session.delete.side_effect = lambda test_task: None
    mock_session.commit = MagicMock()

    success = tasks_repository.delete_task(test_task.id)

    mock_session.query.assert_called_with(Task)
    mock_session.query().filter.assert_called()
    mock_session.delete.assert_called_once_with(test_task)
    mock_session.commit.assert_called_once()
    assert success is True


def test_delete_task_not_found(tasks_repository, mock_session):
    """Test deleting a task when it does not exist."""
    mock_session.query(Task).filter().first.side_effect = lambda: None
    mock_session.delete = MagicMock()
    mock_session.commit = MagicMock()

    success = tasks_repository.delete_task(task_id=999)

    mock_session.query.assert_called_with(Task)
    mock_session.query().filter.assert_called()
    mock_session.delete.assert_not_called()
    mock_session.commit.assert_not_called()
    assert success is False


def test_update_task_found(tasks_repository, mock_session, test_task):
    """Test updating a task when it exists."""
    new_info = {"status": "Completed"}
    mock_session.query().filter().first.side_effect = lambda: test_task
    mock_session.commit = MagicMock()

    success = tasks_repository.update_task(test_task.id, new_info)

    mock_session.query.assert_called_with(Task)
    mock_session.query().filter.assert_called()
    mock_session.commit.assert_called_once()
    assert test_task.status == "Completed"
    assert success is True


def test_update_task_not_found(tasks_repository, mock_session):
    """Test updating a task when it does not exist."""
    new_info = {"status": "Completed"}
    mock_session.query().filter().first.side_effect = lambda: None
    mock_session.commit = MagicMock()

    success = tasks_repository.update_task(task_id=999, new_info=new_info)

    mock_session.query.assert_called_with(Task)
    mock_session.query().filter.assert_called()
    mock_session.commit.assert_not_called()
    assert success is False


def test_get_task_by_id(tasks_repository, mock_session, test_task):
    """Test retrieving a task by ID."""
    mock_session.query().filter().first.side_effect = lambda: test_task

    result = tasks_repository.get_task_by_id(test_task.id)

    mock_session.query.assert_called_with(Task)
    mock_session.query().filter.assert_called()
    assert result == test_task


def test_search_tasks(tasks_repository, mock_session, test_user, test_task):
    """Test searching for tasks."""
    query_string = "Test"
    mock_session.query().filter().filter().all.side_effect = lambda: [test_task]

    result = tasks_repository.search_tasks(query=query_string, user_id=test_user.id)

    mock_session.query.assert_called_with(Task)
    mock_session.query().filter.assert_any_call()
    mock_session.query().filter.assert_any_call()
    mock_session.query().filter().filter().all.assert_called()
    assert result == [test_task]
