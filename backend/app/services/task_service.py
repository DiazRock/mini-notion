from logging import Logger
from typing import List
from app.dep_container.config import Config

from app.repositories import TasksRepository
from app.schemas import TaskDTO
from app.models.models import Task, User


class TaskService:

    def __init__(self, 
                 tasks_repository: TasksRepository,
                 logger: Logger,
                 config: Config):
        self._tasks_repository = tasks_repository
        self.logger = logger
        self.config = config

    def create_task(self, task_content: TaskDTO, user: User) -> Task:
        new_note = self._tasks_repository.create_task(task_content, user)
        self.logger.info(f"New task created for user {user.username}: {task_content}")
        return new_note
    
    def get_task_by_id(self, task_id) -> Task:
        self.logger.info(f"Getting task {task_id}")
        note = self._tasks_repository.get_task_by_id(task_id)
        return note

    def get_tasks_by_user_id(self, user_id) -> List[Task]:
        self.logger.info(f"Getting tasks for user {user_id}")
        notes = self._tasks_repository.get_tasks_by_user_id(user_id)
        return notes
    
    def delete_task(self, task_id):
        self.logger.info(f"Deleting note {task_id}")
        success = self._tasks_repository.delete_task(task_id)
        if success:
            self.logger.info(f"Note {task_id} deleted")
            return True
        else:
            self.logger.error(f"Failed to delete note {task_id}")
            return False
        
    def update_status_task(self, task_id, status: str):
        self.logger.info(f"Updating task {task_id} with status {status}")
        success = self._tasks_repository.update_task(task_id, {'status': status})
        if success:
            self.logger.info(f"Task {task_id} updated")
            return True
        else:
            self.logger.error(f"Failed to update task {task_id}")
            return False