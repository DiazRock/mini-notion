import pytest
from unittest.mock import MagicMock
from sqlalchemy.orm import Session
from app.models import User
from app.dep_container import UsersRepository


@pytest.fixture
def mock_session():
    """Fixture for a mocked SQLAlchemy session."""
    return MagicMock(spec=Session)


@pytest.fixture
def users_repository(mock_session):
    """Fixture for UsersRepository instance with mocked session."""
    return UsersRepository(db=mock_session)


@pytest.fixture
def test_user():
    """Fixture for a mock User."""
    return User(
        id=1,
        username="test_user",
        hashed_password="hashed_password"
    )


def test_get_user_by_username_found(users_repository, mock_session, test_user):
    """Test retrieving a user by username when the user exists."""
    # Mock query behavior
    mock_session.query().filter().first.side_effect = lambda: test_user

    result = users_repository.get_user_by_username(username="test_user")

    mock_session.query.assert_called_with(User)
    mock_session.query().filter.assert_called()
    mock_session.query().filter().first.assert_called()
    assert result == test_user


def test_get_user_by_username_not_found(users_repository, mock_session):
    """Test retrieving a user by username when the user does not exist."""
    # Mock query behavior
    mock_session.query().filter().first.side_effect = lambda: None

    result = users_repository.get_user_by_username(username="non_existent_user")

    mock_session.query.assert_called_with(User)
    mock_session.query().filter.assert_called()
    mock_session.query().filter().first.assert_called()
    assert result is None


def test_create_user(users_repository, mock_session, test_user):
    """Test creating a user."""
    mock_session.refresh = MagicMock()
    mock_session.commit = MagicMock()
    mock_session.add = MagicMock()

    def mock_refresh(instance):
        instance.id = test_user.id

    mock_session.refresh.side_effect = mock_refresh

    result = users_repository.create_user(
        username=test_user.username,
        hashed_password=test_user.hashed_password
    )

    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once()
    assert result.username == test_user.username
    assert result.hashed_password == test_user.hashed_password
