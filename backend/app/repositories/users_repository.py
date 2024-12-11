from app.models import User
from sqlalchemy.orm import Session


class UsersRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_username(self, username: str) -> User:
        return self.db.query(User).\
                    filter(User.username == username).first()
    
    def create_user(self, username: str, hashed_password: str) -> User:
        new_user = User(
                        username=username, 
                        hashed_password=hashed_password
                        )
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)

        return new_user
