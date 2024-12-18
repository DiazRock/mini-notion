from unittest.mock import MagicMock
import pytest
from app.dep_container import get_search_service
from app.models import Note, Task
from app.schemas import SearchResultDTO

@pytest.fixture
def mock_notes_repository():
    """
    Creates a mock NotesRepository.
    """
    return MagicMock()

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
def search_service(mock_notes_repository, mock_tasks_repository, mock_logger, mock_config):
    """
    Fixture that provides the SearchService with mock dependencies.
    """
    return get_search_service(
        note_repo=mock_notes_repository,
        task_repo=mock_tasks_repository,
        logger=mock_logger,
        config=mock_config,
    )

@pytest.fixture
def test_user_id():
    """
    Returns a test user ID.
    """
    return 1

@pytest.fixture
def test_note():
    """
    Returns a test Note object.
    """
    return Note(
        id=1,
        title="Test Note",
        content="This is a test note",
        tags=["test", "note"],
        user_id=1,
    )

@pytest.fixture
def test_task():
    """
    Returns a test Task object.
    """
    class Priority:
        name = "High"

    return Task(
        id=2,
        title="Test Task",
        description="This is a test task",
        priority=Priority(),
        due_date="2023-12-15",
        user_id=1,
    )

@pytest.fixture
def test_query():
    """
    Returns a test search query.
    """
    return "test"

def test_search_items(
        search_service,
        mock_notes_repository,
        mock_tasks_repository,
        mock_logger,
        test_note,
        test_task,
        test_query,
        test_user_id):
    """
    Test SearchService.search_items.
    """
    # Mock the repository methods
    mock_notes_repository.search_notes.return_value = [test_note]
    mock_tasks_repository.search_tasks.return_value = [test_task]

    results = search_service.search_items(query=test_query, user_id=test_user_id)

    # Validate NotesRepository and TasksRepository were called correctly
    mock_notes_repository.search_notes.assert_called_once_with(query=test_query, user_id=test_user_id)
    mock_tasks_repository.search_tasks.assert_called_once_with(query=test_query, user_id=test_user_id)

    # Validate logging
    mock_logger.info.assert_any_call(f"Searching for '{test_query}' in user {test_user_id}")
    mock_logger.info.assert_any_call("Tasks and notes found for user")

    # Validate returned results
    assert len(results) == 2

    # Validate note result
    note_result = next(item for item in results if item.type == "note")
    assert note_result.id == test_note.id
    assert note_result.title == test_note.title
    assert note_result.content == test_note.content
    assert note_result.tags == test_note.tags

    # Validate task result
    task_result = next(item for item in results if item.type == "task")
    assert task_result.id == test_task.id
    assert task_result.title == test_task.title
    assert task_result.content is None
    assert task_result.priority == test_task.priority.name
    assert task_result.tags == []
