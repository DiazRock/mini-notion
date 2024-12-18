import pytest
from unittest.mock import MagicMock
from sqlalchemy.orm import Session
from app.models import Note, User
from app.schemas import NoteDTO
from app.repositories import NotesRepository

@pytest.fixture
def mock_session():
    """Fixture to provide a mocked SQLAlchemy session."""
    return MagicMock(spec=Session)

@pytest.fixture
def notes_repository(mock_session):
    """Fixture to provide NotesRepository instance with mocked session."""
    return NotesRepository(db=mock_session)

@pytest.fixture
def test_user():
    """Fixture for a mock user."""
    return User(id=1, username="test_user", hashed_password="hashed_password")

@pytest.fixture
def test_note_dto():
    """Fixture for a NoteDTO input."""
    return NoteDTO(title="Test Note", content="This is a test note", tags=["tag1", "tag2"])

@pytest.fixture
def test_note():
    """Fixture for a mock Note."""
    return Note(id=1, title="Test Note", content="This is a test note", user_id=1, tags=["tag1", "tag2"])

def test_get_notes_by_user_id(notes_repository, mock_session, test_user, test_note):
    """Test retrieving notes for a user."""
    mock_session.query().filter().all.side_effect = lambda: [test_note]

    result = notes_repository.get_notes_by_user_id(test_user.id)

    mock_session.query.assert_called()
    mock_session.query().filter.assert_called()
    mock_session.query().filter().all.assert_called()
    assert result == [test_note]

def test_create_note(notes_repository, mock_session, test_user, test_note_dto, test_note):
    """Test creating a note."""
    mock_session.refresh = MagicMock()
    mock_session.commit = MagicMock()
    mock_session.add = MagicMock()

    # Use lambda with side_effect to set the ID during refresh
    def mock_refresh(instance):
        instance.id = test_note.id

    mock_session.refresh.side_effect = mock_refresh

    new_note = notes_repository.create_note(test_note_dto, test_user)

    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once_with(new_note)
    assert new_note.title == test_note_dto.title
    assert new_note.content == test_note_dto.content
    assert new_note.tags == test_note_dto.tags
    assert new_note.user_id == test_user.id

def test_search_notes(notes_repository, mock_session, test_user, test_note):
    """Test searching for notes."""
    query_string = "Test"
    mock_session.query().filter().filter().all.side_effect = lambda: [test_note]

    result = notes_repository.search_notes(query=query_string, user_id=test_user.id)

    mock_session.query.assert_called()
    mock_session.query().filter().filter.assert_called()
    assert result == [test_note]

def test_delete_note_found(notes_repository, mock_session, test_note):
    """Test deleting a note when it exists."""
    mock_session.query().filter().first.side_effect = lambda: test_note
    mock_session.delete.side_effect = lambda test_note: True
    mock_session.commit.side_effect = lambda: None

    success = notes_repository.delete_note(note_id=test_note.id)

    mock_session.query.assert_called()
    mock_session.query().filter.assert_called()
    mock_session.delete.assert_called_with(test_note)
    mock_session.commit.assert_called()
    assert success is True

def test_delete_note_not_found(notes_repository, mock_session):
    """Test deleting a note when it does not exist."""
    mock_session.query().filter().first.side_effect = lambda: None
    mock_session.delete = MagicMock()
    mock_session.commit = MagicMock()

    success = notes_repository.delete_note(note_id=999)

    mock_session.query.assert_called()
    mock_session.query().filter.assert_called()
    mock_session.delete.assert_not_called()
    mock_session.commit.assert_not_called()
    assert success is False
