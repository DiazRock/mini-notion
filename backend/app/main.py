from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .routes import users, tasks, notes

app = FastAPI()

Base.metadata.create_all(bind=engine)


app.include_router(users.users_router)
app.include_router(tasks.tasks_router)
app.include_router(notes.notes_router)
