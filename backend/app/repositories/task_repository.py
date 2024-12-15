from sqlalchemy.orm import Session
from typing import List

from app.schemas import TaskDTO
from app.models import Task, User

class TasksRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_tasks_by_user_id(self, user_id: int) -> List[Task]:
        return self.db.query(Task).filter(Task.user_id == user_id).all()
    
    def create_task(self, taskInput: TaskDTO, user: User) -> Task:
        new_task = Task(
            title = taskInput.title,
            description = taskInput.description,
            priority = taskInput.priority,
            due_date = taskInput.due_date,
            user_id = user.id,
            status = taskInput.status,
            user = user
        )
        self.db.add(new_task)
        self.db.commit()
        self.db.refresh(new_task)
        return new_task


    def delete_task(self, task_id: int ):
        note = self.db.query(Task).filter(Task.id == task_id).first()
        if note:
            self.db.delete(note)
            self.db.commit()
            return True
        else:
            return False
        
    def update_task(self, task_id, new_info: dict):
        task = self.db.query(Task).filter(Task.id == task_id).first()
        if task:
            for key in new_info:
                setattr(task, key, new_info[key])
            self.db.commit()
            return True
        else:
            return False
        
    def get_task_by_id(self, task_id: int) -> Task:
        return self.db.query(Task).filter(Task.id == task_id).first()