from jose import JWTError
import passlib
import passlib.exc
import pytest
from unittest import mock
from app.dep_container import get_auth_service
from app.dep_container import UsersRepository
from app.models import User
from app.schemas import UserDTO
from app.dep_container.config import Config
from fastapi import HTTPException
from datetime import timedelta

# Mocking dependencies
@pytest.fixture
def mock_users_repository():
    return mock.Mock(UsersRepository)

@pytest.fixture
def mock_logger():
    return mock.Mock()

@pytest.fixture
def mock_config():
    config = mock.Mock(Config)
    config.SECRET_KEY = "testsecretkey"
    config.ENCRYPT_ALGORITHM = "HS256"
    return config

@pytest.fixture
def auth_service(mock_users_repository, mock_logger, mock_config):
    return get_auth_service(
        users_repository=mock_users_repository,
        logger=mock_logger,
        config=mock_config
    )


def test_register_user(auth_service, mock_users_repository):
    user_data = UserDTO(username="newuser", password="password123")

    # Simulate no existing user
    mock_users_repository.get_user_by_username.side_effect = lambda username: None
    mock_users_repository.create_user.side_effect = lambda username, password_hash: None

    # Test user registration success
    result = auth_service.register_user(user_data)
    assert result is True
    mock_users_repository.create_user.assert_called_once_with(
        user_data.username, mock.ANY  # password hash
    )


def test_register_existing_user(auth_service, mock_users_repository):
    user_data = UserDTO(username="existinguser", password="password123")

    # Simulate existing user
    mock_users_repository.get_user_by_username.side_effect = lambda username: User(username="existinguser")

    # Test user registration failure (user already exists)
    result = auth_service.register_user(user_data)
    assert result is False
    mock_users_repository.create_user.assert_not_called()


def test_verify_jwt_token_valid(auth_service, mock_config):
    mock_credentials = mock.Mock()
    mock_credentials.credentials = "valid-token"

    mock_payload = {"username": "user1"}
    with mock.patch("app.services.jwt.decode", side_effect=lambda token, key, algorithms: mock_payload):
        payload = auth_service.verify_jwt_token(mock_credentials)
    
    assert payload == mock_payload


def test_verify_jwt_token_invalid(auth_service, mock_config):
    mock_credentials = mock.Mock()
    mock_credentials.credentials = "invalid-token"
    
    with mock.patch("app.services.jwt.decode", side_effect=JWTError):
        with pytest.raises(HTTPException):
            auth_service.verify_jwt_token(mock_credentials)


def test_create_access_token(auth_service, mock_config):
    data = {"username": "user1"}
    token = auth_service.create_access_token(data=data, expires_delta=timedelta(days=1))
    assert isinstance(token, str)  # Ensure it returns a string token


def test_get_current_user_success(auth_service, mock_users_repository):
    mock_users_repository.get_user_by_username.side_effect = lambda username: User(username="user1")
    user = auth_service.get_current_user("user1")
    assert user.username == "user1"


def test_get_current_user_not_found(auth_service, mock_users_repository):
    mock_users_repository.get_user_by_username.side_effect = lambda username: None
    with pytest.raises(HTTPException):
        auth_service.get_current_user("nonexistentuser")


def test_login_success(auth_service, mock_users_repository):
    form_data = mock.Mock(username="user1", password="password123")
    user = User(username="user1", hashed_password="$2b$12$bpINnPE8kgXO4I9G2f.BKOLbDTP4wVgIRgqJRRW1zua46ybL.utVG")
    mock_users_repository.get_user_by_username.side_effect = lambda _: user

    # Verify login returns a valid token
    with mock.patch.object(auth_service, "create_access_token", side_effect=lambda data: "testtoken"):
        result = auth_service.login(form_data)
        assert result["access_token"] == "testtoken"
        assert result["token_type"] == "bearer"


def test_login_invalid_credentials(auth_service, mock_users_repository):
    form_data = mock.Mock(username="user1", password="wrongpassword")
    mock_users_repository.get_user_by_username.side_effect = lambda username: User(username="user1", hashed_password="hashed_password")
    
    with pytest.raises(HTTPException):
        auth_service.login(form_data)
