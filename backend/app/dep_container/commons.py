from functools import lru_cache
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.services.auth_service import AuthService
from app.repositories.users_repository import UsersRepository
from app.services.note_service import NoteService
from app.repositories.notes_repository import NotesRepository
from .config import Config
from app.models import User, Base

DATABASE_URL = "sqlite:///./database.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@lru_cache(maxsize=None)
def get_db():
    db = SessionLocal()
    return db


def get_config():
    return Config()

def get_auth_service():
    return AuthService(
        users_repository= UsersRepository(get_db()),
        logger=get_logger(),
        config=get_config())

def get_notes_service():
    return NoteService(
        notes_repository=NotesRepository(get_db()),
        logger=get_logger(),
        config=get_config())

@lru_cache(maxsize=None)
def get_logger():
    logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
    )
    return logging.getLogger(__name__)