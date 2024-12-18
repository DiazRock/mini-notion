from unittest.mock import MagicMock
import pytest
from app.dep_container import get_notes_service
from app.models import User, Note
from app.schemas import NoteDTO

@pytest.fixture
def mock_notes_repository():
    """
    Creates a mock NotesRepository.
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
def note_service(mock_notes_repository, mock_logger, mock_config):
    """
    Fixture that provides the NoteService with mock dependencies.
    """
    return get_notes_service(
        notes_repository=mock_notes_repository,
        logger=mock_logger,
        config=mock_config
    )


@pytest.fixture
def test_user():
    """
    Returns a test User object.
    """
    return User(id=1, username="test_user", hashed_password="hashed_password")


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
def test_note_dto():
    """
    Returns a NoteDTO for creating notes.
    """
    return NoteDTO(title="Test Note", content="This is a test note", tags=["test", "note"])


def test_create_note(note_service, mock_notes_repository, mock_logger, test_note_dto, test_user, test_note):
    """
    Test NoteService.create_note.
    """
    mock_notes_repository.create_note.return_value = test_note

    created_note = note_service.create_note(test_note_dto, test_user)

    mock_notes_repository.create_note.assert_called_once_with(test_note_dto, test_user)
    mock_logger.info.assert_called_once_with(f"New note created for user {test_user.username}: {test_note_dto}")
    assert created_note == test_note


def test_get_notes_by_user_id(note_service, mock_notes_repository, mock_logger, test_user, test_note):
    """
    Test NoteService.get_notes_by_user_id.
    """
    mock_notes_repository.get_notes_by_user_id.return_value = [test_note]

    notes = note_service.get_notes_by_user_id(test_user.id)

    mock_notes_repository.get_notes_by_user_id.assert_called_once_with(test_user.id)
    mock_logger.info.assert_called_once_with(f"Getting notes for user {test_user.id}")
    assert notes == [test_note]


def test_delete_note_success(note_service, mock_notes_repository, mock_logger):
    """
    Test NoteService.delete_note when the note exists and is successfully deleted.
    """
    note_id = 1
    mock_notes_repository.delete_note.return_value = True

    result = note_service.delete_note(note_id)

    mock_notes_repository.delete_note.assert_called_once_with(note_id)
    mock_logger.info.assert_any_call(f"Deleting note {note_id}")
    mock_logger.info.assert_any_call(f"Note {note_id} deleted")
    assert result is True


def test_delete_note_failure(note_service, mock_notes_repository, mock_logger):
    """
    Test NoteService.delete_note when the note does not exist or cannot be deleted.
    """
    note_id = 1
    mock_notes_repository.delete_note.return_value = False

    result = note_service.delete_note(note_id)

    mock_notes_repository.delete_note.assert_called_once_with(note_id)
    mock_logger.info.assert_called_once_with(f"Deleting note {note_id}")
    mock_logger.error.assert_called_once_with(f"Failed to delete note {note_id}")
    assert result is False
