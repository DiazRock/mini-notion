from unittest.mock import MagicMock
import pytest
from app.dep_container import get_tasks_service
from app.models import Task, User
from app.schemas import TaskDTO


@pytest.fixture
def mock_tasks_repository():
    """
    Creates a mock TasksRepository.
    """
    return MagicMock()


@pytest.fixture
def mock_logger():
    """
    Creates a mock logger.
    """
    return MagicMock()


@pytest.fixture
def mock_config():
    """
    Mock for the Config class.
    """
    return MagicMock()


@pytest.fixture
def task_service(mock_tasks_repository, mock_logger, mock_config):
    """
    Fixture that provides the TaskService with mock dependencies.
    """
    return get_tasks_service(
        tasks_repository=mock_tasks_repository,
        logger=mock_logger,
        config=mock_config,
    )


@pytest.fixture
def test_task():
    """
    Returns a test Task object.
    """
    class Status:
        name = "Pending"

    return Task(
        id=1,
        title="Test Task",
        description="This is a test task",
        priority="High",
        due_date="2023-12-15",
        user_id=1,
        status=Status(),
    )


@pytest.fixture
def test_user():
    """
    Returns a test User object.
    """
    return User(
        id=1,
        username="test_user",
        hashed_password="hashed_password",
    )


@pytest.fixture
def test_task_dto():
    """
    Returns a test TaskDTO object.
    """
    return TaskDTO(
        id = 1,
        title="New Task",
        description="This is a new task",
        priority="Medium",
        due_date="2024-01-01",
        status="Pending",
    )


def test_create_task(task_service, mock_tasks_repository, mock_logger, test_task_dto, test_user, test_task):
    """
    Test TaskService.create_task.
    """
    # Mock the repository method
    mock_tasks_repository.create_task.side_effect = lambda task_content, user: test_task

    created_task = task_service.create_task(task_content=test_task_dto, user=test_user)

    # Validate repository method was called correctly
    mock_tasks_repository.create_task.assert_called()

    # Validate logger calls
    mock_logger.info.assert_called_with(f"New task created for user {test_user.username}: {test_task_dto}")

    # Validate returned task
    assert created_task.id == test_task.id
    assert created_task.title == test_task.title


def test_get_task_by_id(task_service, mock_tasks_repository, mock_logger, test_task):
    """
    Test TaskService.get_task_by_id.
    """
    # Mock the repository method
    mock_tasks_repository.get_task_by_id.side_effect = lambda task_id: test_task if task_id == 1 else None


    task = task_service.get_task_by_id(task_id=test_task.id)

    # Validate repository method was called correctly
    mock_tasks_repository.get_task_by_id.assert_called_once_with(test_task.id)

    # Validate logger calls
    mock_logger.info.assert_called_with(f"Getting task {test_task.id}")

    # Validate returned task
    assert task.id == test_task.id
    assert task.title == test_task.title


def test_get_tasks_by_user_id(task_service, mock_tasks_repository, mock_logger, test_task):
    """
    Test TaskService.get_tasks_by_user_id.
    """
    # Mock the repository method
    mock_tasks_repository.get_tasks_by_user_id.side_effect = lambda user_id: [test_task] if user_id == 1 else None

    tasks = task_service.get_tasks_by_user_id(user_id=test_task.user_id)

    # Validate repository method was called correctly
    mock_tasks_repository.get_tasks_by_user_id.assert_called_once_with(test_task.user_id)

    # Validate logger calls
    mock_logger.info.assert_called_with(f"Getting tasks for user {test_task.user_id}")

    # Validate returned tasks
    assert len(tasks) == 1
    assert tasks[0].id == test_task.id


def test_delete_task_success(task_service, mock_tasks_repository, mock_logger, test_task):
    """
    Test TaskService.delete_task (success case).
    """
    # Mock the repository method
    mock_tasks_repository.delete_task.side_effect = lambda task_id: task_id == 1

    result = task_service.delete_task(task_id=test_task.id)

    # Validate repository method was called correctly
    mock_tasks_repository.delete_task.assert_called_once_with(test_task.id)

    # Validate logger calls
    mock_logger.info.assert_any_call(f"Deleting note {test_task.id}")
    mock_logger.info.assert_any_call(f"Note {test_task.id} deleted")

    # Validate result
    assert result is True


def test_delete_task_failure(task_service, mock_tasks_repository, mock_logger, test_task):
    """
    Test TaskService.delete_task (failure case).
    """
    # Mock the repository method
    mock_tasks_repository.delete_task.side_effect = lambda _: False

    result = task_service.delete_task(task_id=test_task.id)

    # Validate repository method was called correctly
    mock_tasks_repository.delete_task.assert_called_once_with(test_task.id)

    # Validate logger calls
    mock_logger.info.assert_called_with(f"Deleting note {test_task.id}")
    mock_logger.error.assert_called_with(f"Failed to delete note {test_task.id}")

    # Validate result
    assert result is False


def test_update_status_task_success(task_service, mock_tasks_repository, mock_logger, test_task):
    """
    Test TaskService.update_status_task (success case).
    """
    # Mock the repository method
    mock_tasks_repository.update_task.side_effect = lambda _, __ : True

    result = task_service.update_status_task(task_id=test_task.id, status="Completed")

    # Validate repository method was called correctly
    mock_tasks_repository.update_task.assert_called_once_with(test_task.id, {"status": "Completed"})

    # Validate logger calls
    mock_logger.info.assert_any_call(f"Updating task {test_task.id} with status Completed")
    mock_logger.info.assert_any_call(f"Task {test_task.id} updated")

    # Validate result
    assert result is True


def test_update_status_task_failure(task_service, mock_tasks_repository, mock_logger, test_task):
    """
    Test TaskService.update_status_task (failure case).
    """
    # Mock the repository method
    mock_tasks_repository.update_task.side_effect = lambda _, __: False

    result = task_service.update_status_task(task_id=test_task.id, status="Completed")

    # Validate repository method was called correctly
    mock_tasks_repository.update_task.assert_called_once_with(test_task.id, {"status": "Completed"})

    # Validate logger calls
    mock_logger.info.assert_called_with(f"Updating task {test_task.id} with status Completed")
    mock_logger.error.assert_called_with(f"Failed to update task {test_task.id}")

    # Validate result
    assert result is False
