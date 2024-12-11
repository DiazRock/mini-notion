from fastapi import APIRouter, Depends
from ..schemas import UserResponse

users_router = APIRouter(prefix="/users", tags=["users"])


@users_router.get("/me", response_model=UserResponse)
def get_user_profile():
    return {'message': "Profile"}
