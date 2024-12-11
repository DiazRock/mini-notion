from app.models import Note
from sqlalchemy import JSON
from typing import List
from sqlalchemy.orm import Session

from app.schemas import NoteDTO
from app.models.models import User

class NotesRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_notes_by_user_id(self, id: int) -> Note:
        return self.db.query(Note).filter(Note.user_id == id).all()
    
    def create_note(self, note_content: NoteDTO, user: User) -> Note:
        new_note = Note(
                    title=note_content.title,
                    content=note_content.content,
                    tags=note_content.tags,
                    user_id=user.id,
                    user = user)
        self.db.add(new_note)
        self.db.commit()
        self.db.refresh(new_note)
        return new_note


    def delete_note(self, note_id: int ):
        note = self.db.query(Note).filter(Note.id == note_id).first()
        if note:
            self.db.delete(note)
            self.db.commit()
            return True
        else:
            return False