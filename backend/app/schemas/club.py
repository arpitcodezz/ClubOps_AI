from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ClubBase(BaseModel):
    name: str
    description: str | None = None


class ClubCreate(ClubBase):
    pass


class ClubUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class ClubResponse(ClubBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)