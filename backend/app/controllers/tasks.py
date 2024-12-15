from logging import Logger
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from http import HTTPStatus
from sqlalchemy.orm import Session
from app.services import AuthService, TaskService
from app.dep_container import get_db, get_tasks_service, get_auth_service, get_logger
from ..models import User
from ..schemas import TaskDTO

tasks_router = APIRouter(prefix="/tasks", tags=["tasks"])


@tasks_router.post("/", response_model=TaskDTO)
def create_task(
    task: TaskDTO,
    tasks_service: TaskService = Depends(get_tasks_service),
    auth_service: AuthService = Depends(get_auth_service),
    logger: Logger = Depends(get_logger),
    user: dict = Depends(get_auth_service().verify_jwt_token),
    ):

    current_user: User = auth_service.get_current_user(user['username'])
    logger.info(f"Creating task {task.title} for user {user.get('sub')}")
    task_content = tasks_service.create_task(task, current_user)

    logger.info(f"Task created {task_content.priority.name} {task_content.status.name}")

    return TaskDTO(
        id = task_content.id,
        title = task_content.title,
        description = task_content.description,
        priority = task_content.priority.name,
        due_date = task_content.due_date,
        status = task_content.status.name
    )


@tasks_router.get("/", response_model=List[TaskDTO])
def get_tasks(
        task_service: TaskService = Depends(get_tasks_service),
        auth_service: AuthService = Depends(get_auth_service),
        logger: Logger = Depends(get_logger),
        user: dict = Depends(get_auth_service().verify_jwt_token),
    ):

    current_user: User = auth_service.get_current_user(user['username'])
    logger.info(f'Getting tasks for user { current_user.username }')
    tasks = task_service.get_tasks_by_user_id(current_user.id)
    
    return [
        TaskDTO(
            id = task.id,
            title = task.title,
            description = task.description,
            priority = task.priority.name,
            due_date = task.due_date,
            status = task.status.name,
        )
        for task in tasks
    ]


@tasks_router.get("/{task_id}", response_model=TaskDTO)
def get_task_details(
        task_id: int,
        task_service: TaskService = Depends(get_tasks_service),
        logger: Logger = Depends(get_logger),
        user: dict = Depends(get_auth_service().verify_jwt_token),
    ):
    try:

        logger.info(f'Getting task {task_id}')
        task = task_service.get_task_by_id(task_id)
        
        return TaskDTO(
            id = task.id,
            title = task.title,
            description = task.description,
            priority = task.priority.name,
            due_date = task.due_date,
            status = task.status.name,
        )
    except Exception:
        raise HTTPException(status=HTTPStatus.NOT_FOUND)

@tasks_router.put("/{task_id}")
def update_task(
    task_id: int, 
    status: str, 
    tasks_service: TaskService = Depends(get_tasks_service),
    logger: Logger = Depends(get_logger),
    user: dict = Depends(get_auth_service().verify_jwt_token)
    ):

    logger.info(f"Updating the status of the task {task_id}")

    try:
        tasks_service.update_status_task(task_id, status)

    except:
        raise HTTPException('Failed to update the status of the task')
    
    return {'message': 'task updated'}


@tasks_router.delete("/{task_id}")
def delete_task(
    task_id: int,
    tasks_service: TaskService = Depends(get_tasks_service),
    logger: Logger = Depends(get_logger),
    user: dict = Depends(get_auth_service().verify_jwt_token)
    ):
    
    logger.info(f"Deleting task {task_id} for user {user.get('sub')}" )

    try:
        tasks_service.delete_task(task_id)
    
    except Exception as e:
        logger.error(f"Failed to delete task {task_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete task")

    return {"message": "Task deleted successfully"}
