from logging import Logger
from typing import List
from app.dep_container.config import Config

from app.repositories import NotesRepository
from app.schemas import NoteDTO
from app.models.models import Note, User


class NoteService:

    def __init__(self, 
                 notes_repository: NotesRepository,
                 logger: Logger,
                 config: Config):
        self._notes_repository = notes_repository
        self.logger = logger
        self.config = config

    def create_note(self, note_content: NoteDTO, user: User) -> Note:
        new_note = self._notes_repository.create_note(note_content, user)
        self.logger.info(f"New note created for user {user.username}: {note_content}")
        return new_note

    def get_notes_by_user_id(self, user_id) -> List[Note]:
        self.logger.info(f"Getting notes for user {user_id}")
        notes = self._notes_repository.get_notes_by_user_id(user_id)
        return notes
    
    def delete_note(self, note_id):
        self.logger.info(f"Deleting note {note_id}")
        success = self._notes_repository.delete_note(note_id)
        if success:
            self.logger.info(f"Note {note_id} deleted")
            return True
        else:
            self.logger.error(f"Failed to delete note {note_id}")
            return False