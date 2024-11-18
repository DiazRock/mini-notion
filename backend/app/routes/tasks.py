from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Task
from ..schemas import TaskCreate, TaskResponse
from ..auth import get_current_user

tasks_router = APIRouter(prefix="/tasks", tags=["tasks"])


@tasks_router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    new_task = Task(**task.dict(), user_id=current_user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@tasks_router.get("/", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Task).filter(Task.user_id == current_user.id).all()


@tasks_router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    existing_task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not existing_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task.dict().items():
        setattr(existing_task, key, value)
    db.commit()
    db.refresh(existing_task)
    return existing_task


@tasks_router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
