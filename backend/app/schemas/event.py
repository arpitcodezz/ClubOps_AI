from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EventBase(BaseModel):
    title: str
    headline: str | None = None
    description: str | None = None
    banner_url: str | None = None
    event_type: str | None = None
    venue: str | None = None
    start_datetime: datetime
    end_datetime: datetime
    registration_deadline: datetime | None = None
    capacity: int | None = None
    status: str = "DRAFT"


class EventCreate(EventBase):
    club_id: int
    created_by: int


class EventUpdate(BaseModel):
    title: str | None = None
    headline: str | None = None
    description: str | None = None
    banner_url: str | None = None
    event_type: str | None = None
    venue: str | None = None
    start_datetime: datetime | None = None
    end_datetime: datetime | None = None
    registration_deadline: datetime | None = None
    capacity: int | None = None
    status: str | None = None


class EventResponse(EventBase):
    id: int
    club_id: int
    created_by: int | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)