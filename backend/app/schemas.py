from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    created_at: datetime

    class Config:
        orm_mode = True


class TaskCreate(BaseModel):
    title: str
    status: Optional[str] = "to-do"
    due_date: Optional[str]

class TaskResponse(BaseModel):
    id: int
    title: str
    status: str
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class NoteCreate(BaseModel):
    title: str
    content: str


class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True  # Allows compatibility with SQLAlchemy models


class Token(BaseModel):
    access_token: str
    token_type: str