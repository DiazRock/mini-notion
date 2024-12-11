from pydantic import BaseSettings

class Config(BaseSettings):
    SECRET_KEY = "your_secret_key"
    ENCRYPT_ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

    class Config:
        env_file = ".env"  # Specify a .env file for loading environment variables

