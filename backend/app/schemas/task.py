from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class TaskCreate(BaseModel):
    event_id: int
    assigned_to: int | None = None
    created_by: int
    title: str
    description: str | None = None
    priority: str = "MEDIUM"
    status: str = "TODO"
    due_date: date | None = None


class TaskUpdate(BaseModel):
    event_id: int | None = None
    assigned_to: int | None = None
    title: str | None = None
    description: str | None = None
    priority: str | None = None
    status: str | None = None
    due_date: date | None = None


class TaskResponse(BaseModel):
    id: int
    event_id: int
    assigned_to: int | None
    created_by: int
    title: str
    description: str | None
    priority: str
    status: str
    due_date: date | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
