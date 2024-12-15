from datetime import datetime
from logging import Logger
from typing import List
from fastapi import APIRouter, Depends, HTTPException

from app.services import NoteService, AuthService
from app.models import User
from ..dep_container import get_notes_service, get_auth_service, get_logger
from ..schemas import NoteDTO


notes_router = APIRouter(prefix="/notes", tags=["notes"])


@notes_router.post("/", response_model=NoteDTO)
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

    return NoteDTO(
        id=note.id,
        title=note.title,
        content=note.content,
        created_at=datetime.now(),
        tags=note.tags,
    )


@notes_router.get("/", response_model=List[NoteDTO])
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
        NoteDTO(
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
