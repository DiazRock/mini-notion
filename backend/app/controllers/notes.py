from datetime import datetime
from logging import Logger
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.note_service import NoteService
from app.services.auth_service import AuthService
from app.models.models import User
from ..dep_container import get_db, get_notes_service, get_auth_service, get_logger
from ..models import Note
from ..schemas import NoteDTO, NoteResponse


notes_router = APIRouter(prefix="/notes", tags=["notes"])


@notes_router.post("/", response_model=NoteResponse)
def create_note(
        note: NoteDTO,
        notes_service: NoteService = Depends(get_notes_service),
        auth_service: AuthService = Depends(get_auth_service),
        logger: Logger = Depends(get_logger),
        user: dict = Depends(get_auth_service().verify_jwt_token),
        ):
    
    current_user: User = auth_service.get_current_user(user['username'])
    logger.info(f'Creating note for user { current_user.username }')

    note = notes_service.create_note(note, current_user)

    return NoteResponse(
        id=note.id,
        title=note.title,
        content=note.content,
        created_at=datetime.now(),
        tags=note.tags,
    )


@notes_router.get("/", response_model=list[NoteResponse])
def get_notes(
        notes_service: NoteService = Depends(get_notes_service),
        auth_service: AuthService = Depends(get_auth_service),
        logger: Logger = Depends(get_logger),
        user: dict = Depends(get_auth_service().verify_jwt_token),
    ):
    
    current_user: User = auth_service.get_current_user(user['username'])
    logger.info(f'Getting notes for user { current_user.username }')
    notes = notes_service.get_notes_by_user_id(current_user.id)

    return [
        NoteResponse(
            id=note.id,
            title=note.title,
            content=note.content,
            tags=note.tags,
        )
        for note in notes
    ]


@notes_router.delete("/{note_id}")
def delete_note(
        note_id: int,
        notes_service: NoteService = Depends(get_notes_service),
        logger: Logger = Depends(get_logger),
        user: dict = Depends(get_auth_service().verify_jwt_token),
    ):

    logger.info(f"Deleting note {note_id} for user {user.get('sub')}" )

    try:
        notes_service.delete_note(note_id)
    
    except Exception as e:
        logger.error(f"Failed to delete note {note_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete note")

    return {"message": "Note deleted"}
