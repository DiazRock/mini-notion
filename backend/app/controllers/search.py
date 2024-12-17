from fastapi import APIRouter, Depends, Query
from typing import List
from app.services import SearchService, AuthService
from app.dep_container import get_search_service, get_auth_service, get_logger
from app.schemas import SearchResultDTO
from logging import Logger

search_router = APIRouter(prefix="/search", tags=["search"])


@search_router.get("/", response_model=List[SearchResultDTO])
def search_items(
    query: str = Query(..., description="Search query string"),
    search_service: SearchService = Depends(get_search_service),
    auth_service: AuthService = Depends(get_auth_service),
    logger: Logger = Depends(get_logger),
    user: dict = Depends(get_auth_service().verify_jwt_token),
):
    """
    Search across notes and tasks for the current user.
    """
    logger.info(f"Searching for '{query}' by user {user.get('sub')}")
    current_user = auth_service.get_current_user(user["username"])

    search_results = search_service.search_items(query=query, user_id=current_user.id)
    logger.info(f"Search returned {len(search_results)} results.")

    return search_results
