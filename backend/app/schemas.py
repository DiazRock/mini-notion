from pydantic import BaseModel, Field
from typing import Optional, Literal, List
from datetime import datetime, date


class UserDTO(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    created_at: datetime

    class Config:
        orm_mode = True


class TaskDTO(BaseModel):
    id: Optional[int]
    title: str = Field(..., max_length=255)
    description: str = Field(..., max_length=1000) 
    priority: Literal['High', 'Medium', 'Low'] 
    due_date: Optional[date]
    status: Literal['Pending', 'Progress', 'Completed'] 

    class Config:
        orm_mode = True


class NoteDTO(BaseModel):
    id: Optional[int] = None
    title: str
    content: str
    created_at: Optional[datetime] = None
    tags: List[str]

    class Config:
        orm_mode = True  # Allows compatibility with SQLAlchemy models


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class SearchResultDTO(BaseModel):
    id: int
    type: str  # "note" or "task"
    title: str
    content: Optional[str] = ''
    priority: Optional[str] = ''
    tags: Optional[List[str]]

    class Config:
        orm_mode = True