from fastapi import APIRouter, Depends
from ..auth import get_current_user
from ..schemas import UserResponse

users_router = APIRouter(prefix="/users", tags=["users"])


@users_router.get("/me", response_model=UserResponse)
def get_user_profile(current_user=Depends(get_current_user)):
    return current_user
