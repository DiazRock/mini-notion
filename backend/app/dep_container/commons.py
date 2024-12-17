from functools import lru_cache
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.services import AuthService, NoteService, TaskService, SearchService
from app.repositories import UsersRepository, NotesRepository, TasksRepository
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

def get_notes_repository():
    return NotesRepository(get_db())

def get_tasks_repository():
    return TasksRepository(get_db())

def get_auth_service(
    users_repository = None,
    logger = None,
    config = None
):
    return AuthService(
        users_repository=users_repository or UsersRepository(get_db()),
        logger=logger or get_logger(),
        config=config or get_config())


def get_notes_service(
        notes_repository = None,
        logger=None,
        config=None 
):
    return NoteService(
        notes_repository=notes_repository or NotesRepository(get_db()),
        logger=logger or get_logger(),
        config= config or get_config())


def get_tasks_service(
        tasks_repository = None,
        logger = None,
        config = None,
):
    return TaskService(
        tasks_repository= tasks_repository or TasksRepository(get_db()),
        logger=logger or get_logger(),
        config=config or get_config())


def get_search_service(
        note_repo = None,
        task_repo = None,
        logger = None,
        config = None,
):
    return SearchService(
        note_repo= note_repo or get_notes_repository(),
        task_repo= task_repo or get_tasks_repository(),
        logger= logger or get_logger(),
        config= config or get_config()
    )

@lru_cache(maxsize=None)
def get_logger():
    logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
    )
    return logging.getLogger(__name__)