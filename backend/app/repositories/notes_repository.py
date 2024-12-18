from app.models import Note
from sqlalchemy.sql import or_
from typing import List
from sqlalchemy.orm import Session

from app.schemas import NoteDTO
from app.models import User

class NotesRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_notes_by_user_id(self, id: int) -> List[Note]:
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

    def search_notes(self, query: str, user_id: int):
        """
        Searches notes by title, content, or tags.
        """
        return (
            self.db.query(Note)
            .filter(Note.user_id == user_id)
            .filter(
                or_(
                    Note.title.ilike(f"%{query}%"),
                    Note.content.ilike(f"%{query}%"),
                    Note.tags.ilike(f"%{query}%"),
                )
            )
            .all()
        )

    def delete_note(self, note_id: int ):
        note = self.db.query(Note).filter(Note.id == note_id).first()
        if note:
            self.db.delete(note)
            self.db.commit()
            return True
        else:
            return False