from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RegistrationCreate(BaseModel):
    event_id: int
    user_id: int
    status: str = "REGISTERED"


class RegistrationUpdate(BaseModel):
    status: str


class RegistrationResponse(BaseModel):
    id: int
    event_id: int
    user_id: int
    status: str
    registered_at: datetime

    model_config = ConfigDict(from_attributes=True)