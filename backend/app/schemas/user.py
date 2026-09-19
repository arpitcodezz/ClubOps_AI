from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    name: str
    email: str
    password_hash: str
    role: str = "PARTICIPANT"


class UserUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    password_hash: str | None = None
    role: str | None = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)