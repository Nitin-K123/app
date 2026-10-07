import os
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import Header, HTTPException, status
from typing import Optional

SECRET = os.environ.get("JWT_SECRET", "psi-secret-dev-key-change-me")
ALGO = "HS256"
EXPIRE_HOURS = 24 * 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(p: str) -> str:
    return pwd_context.hash(p)


def verify_password(p: str, h: str) -> bool:
    try:
        return pwd_context.verify(p, h)
    except Exception:
        return False


def create_token(user_id: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=EXPIRE_HOURS),
    }
    return jwt.encode(payload, SECRET, algorithm=ALGO)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET, algorithms=[ALGO])
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")


async def current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1].strip()
    return decode_token(token)


async def optional_user(authorization: Optional[str] = Header(None)) -> Optional[dict]:
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    try:
        return decode_token(authorization.split(" ", 1)[1].strip())
    except Exception:
        return None
