import os

from passlib.hash import bcrypt
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = os.getenv("SECRET_KEY", "TEST_SECRET_KEY")
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def hash_password(password: str) -> str:
    return bcrypt.hash(password)