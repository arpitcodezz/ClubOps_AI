from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ClubMemberCreate(BaseModel):
    club_id: int
    user_id: int
    role: str = "MEMBER"


class ClubMemberUpdate(BaseModel):
    role: str | None = None


class ClubMemberResponse(BaseModel):
    id: int
    club_id: int
    user_id: int
    role: str
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)