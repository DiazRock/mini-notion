from typing import Optional
from fastapi import HTTPException, Security
from jose import jwt, JWTError
from fastapi.security import (
            HTTPAuthorizationCredentials,
            OAuth2PasswordBearer,
            OAuth2PasswordRequestForm,
            HTTPBearer)
from passlib.context import CryptContext
from datetime import datetime, timedelta

from logging import Logger

from app.repositories import UsersRepository
from app.models import User
from app.dep_container.config import Config
from app.schemas import UserDTO


class AuthService:

    def __init__(self, 
                 users_repository: UsersRepository,
                 logger: Logger,
                 config: Config):
        self._users_repository = users_repository
        self.logger = logger
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
        self.config = config

    
    def verify_jwt_token(
        self, 
        credentials: HTTPAuthorizationCredentials = Security(HTTPBearer())
    ) -> Optional[dict]:
        self.logger.info(f"Verifying JWT token {credentials.credentials}")
        token = credentials.credentials
        try:
            payload = jwt.decode(token, self.config.SECRET_KEY, algorithms=[self.config.ENCRYPT_ALGORITHM])
            self.logger.info(f"Token is valid {payload}")
            return payload  # Return decoded token payload
        except JWTError:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired token",
            )


    def register_user(self, user: UserDTO):
        existing_user = self._users_repository.get_user_by_username(user.username)
        if existing_user:
            self.logger.warning(f"User {user.username} already exists")
            return False
        
        self._users_repository.create_user(user.username, self.get_password_hash(user.password))
        self.logger.info(f"User {user.username} registered successfully")

        return True
    
    def verify_password(self, plain_password, hashed_password):
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        return self.pwd_context.hash(password)

    def create_access_token(self, data: dict, expires_delta: timedelta = timedelta(days=1)):
        to_encode = data.copy()
        expire = datetime.now() + expires_delta
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, self.config.SECRET_KEY, algorithm=self.config.ENCRYPT_ALGORITHM)

    def get_current_user(self, username: str) -> User:
        try:
            user = self._users_repository.get_user_by_username(username)
            if user is None:
                raise HTTPException(status_code=401, detail="User not found")
            return user
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")

    def login(self, form_data: OAuth2PasswordRequestForm):
        user = self._users_repository.get_user_by_username(form_data.username)
        if not user:
            raise HTTPException(status_code=400, detail="Invalid username or password")
        try:
            self.verify_password(form_data.password, user.hashed_password)
            access_token = self.create_access_token(data={"username": user.username, "password": user.hashed_password})
            return {"access_token": access_token, "token_type": "bearer"}
        except Exception as e:
            self.logger.error(f"Error verifying password: {e}")
            raise HTTPException(status_code=400, detail="Invalid username or password")