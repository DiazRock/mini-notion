import enum

from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, JSON, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class PriorityEnum(enum.Enum):
    High = "High"
    Medium = "Medium"
    Low = "Low"


class StatusEnum(enum.Enum):
    Pending = "Pending"
    Progress = "Progress"
    Completed = "Completed"


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable= False)

    tasks = relationship("Task", back_populates="user")
    notes = relationship("Note", back_populates="user")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=False)
    priority = Column(Enum(PriorityEnum), nullable=False, default=PriorityEnum.Medium)
    due_date = Column(Date, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(StatusEnum), nullable=False, default=StatusEnum.Pending)

    # Define relationships
    user = relationship("User", back_populates="tasks") 


class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    tags = Column(JSON, nullable=True)  # Stores tags as a JSON array
    user_id = Column(Integer, ForeignKey('users.id'))

    user = relationship("User", back_populates="notes")
