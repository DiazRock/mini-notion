from logging import Logger
from typing import List
from app.models import Note, Task
from app.repositories import NotesRepository, TasksRepository
from app.schemas import SearchResultDTO
from app.dep_container.config import Config

class SearchService:
    def __init__(self, 
                note_repo: NotesRepository, 
                task_repo: TasksRepository,
                logger: Logger,
                config: Config):
        self.note_repo = note_repo
        self.task_repo = task_repo
        self.logger = logger
        self.config = config

    def search_items(self, query: str, user_id: int) -> List[SearchResultDTO]:
        """
        Searches for notes and tasks that match the query string for the given user ID.
        """
        self.logger.info(f"Searching for '{query}' in user {user_id}")
        # Search notes by title, content, or tags
        notes: List[Note] = self.note_repo.search_notes(query=query, user_id=user_id)

        # Search tasks by title
        tasks: List[Task] = self.task_repo.search_tasks(query=query, user_id=user_id)

        self.logger.info(f'Tasks and notes found for user')
        # Combine and structure the results
        results = [
            SearchResultDTO(
                id=note.id,
                type="note",
                title=note.title,
                content=note.content,
                tags=note.tags,
            )
            for note in notes
        ] + [
            SearchResultDTO(
                id=task.id,
                type="task",
                title=task.title,
                content=None,
                priority=task.priority.name,
                tags=[],
            )
            for task in tasks
        ]

        return results
