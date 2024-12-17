from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from logging import Logger
import app.dep_container as dep_container
from app.services.auth_service import AuthService 
from ..schemas import TokenResponse, UserDTO


auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/login", response_model=TokenResponse)
def login(
        form_data: UserDTO, 
        auth_service: AuthService = Depends(dep_container.get_auth_service),
        logger: Logger = Depends(dep_container.get_logger)):
    logger.info(f'Received login information from endpoint {form_data.username}' )
    return auth_service.login(form_data)


@auth_router.post("/register", status_code=201)
def register(user: UserDTO, auth_service: AuthService = Depends(dep_container.get_auth_service)):
    auth_service.register_user(user)
    return {"message": "User registered successfully"}

