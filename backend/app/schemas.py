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
    title: str
    status: Optional[str] = "to-do"
    due_date: Optional[str]


class TaskResponse(BaseModel):
    id: int
    title: str = Field(..., max_length=255)  # Adding a max length for title
    description: str = Field(..., max_length=1000)  # Adding a max length for description
    priority: Literal['High', 'Medium', 'Low']  # Restricted to specific priority values
    due_date: Optional[date]  # Optional field for due date
    is_completed: bool  # Tracks if the task is completed
    user_id: int  # The ID of the user who owns the task
    status: Literal['Pending', 'In Progress', 'Completed']  # Status of the task

    class Config:
        orm_mode = True


class NoteDTO(BaseModel):
    title: str
    content: str
    tags: Optional[List[str]] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.now)


class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: Optional[datetime] = None
    tags: List[str]

    class Config:
        orm_mode = True  # Allows compatibility with SQLAlchemy models


class TokenResponse(BaseModel):
    access_token: str
    token_type: str