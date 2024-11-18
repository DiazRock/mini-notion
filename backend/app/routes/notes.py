from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Note
from ..schemas import NoteCreate, NoteResponse
from ..auth import get_current_user

notes_router = APIRouter(prefix="/notes", tags=["notes"])


@notes_router.post("/", response_model=NoteResponse)
def create_note(note: NoteCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    new_note = Note(**note.dict(), user_id=current_user.id)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


@notes_router.get("/", response_model=list[NoteResponse])
def get_notes(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Note).filter(Note.user_id == current_user.id).all()


@notes_router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"message": "Note deleted"}
