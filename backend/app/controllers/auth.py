from fastapi import APIRouter, Depends, HTTPException
from logging import Logger
import app.dep_container as dep_container
from app.services.auth_service import AuthService
from ..schemas import TokenResponse, UserDTO

auth_router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    description="Endpoints for authentication and user management."
)


@auth_router.post("/login", response_model=TokenResponse, summary="User Login", description="""
    Authenticate a user and return an access token.

    ### Request:
    - `form_data`: User credentials, including `username` and `password`.

    ### Response:
    - Returns a `TokenResponse` containing the access token and token type.

    ### Errors:
    - `401 Unauthorized`: Invalid credentials.
    """)
def login(
        form_data: UserDTO, 
        auth_service: AuthService = Depends(dep_container.get_auth_service),
        logger: Logger = Depends(dep_container.get_logger)
        ):
    """
    Authenticate a user using provided credentials and return an access token.
    """
    logger.info(f"Received login information from endpoint {form_data.username}")
    return auth_service.login(form_data)


@auth_router.post("/register", status_code=201, summary="Register a New User", description="""
        Register a new user in the system.

        ### Request:
        - `user`: User data including `username` and `password`.

        ### Response:
        - Returns a success message upon successful registration.

        ### Errors:
        - `400 Bad Request`: Invalid or already used data.
        """)
def register(
        user: UserDTO, 
        auth_service: AuthService = Depends(dep_container.get_auth_service)
    ):
    """
    Register a new user with the provided credentials.
    """
    auth_service.register_user(user)
    return {"message": "User registered successfully"}
