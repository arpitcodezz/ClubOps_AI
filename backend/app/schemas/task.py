from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class TaskBase(BaseModel):
    title: str
    description: str | None = None
    priority: str = "MEDIUM"
    status: str = "TODO"
    due_date: date | None = None
    assigned_to: int | None = None


class TaskCreate(TaskBase):
    event_id: int
    created_by: int


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    priority: str | None = None
    status: str | None = None
    due_date: date | None = None
    assigned_to: int | None = None


class TaskResponse(TaskBase):
    id: int
    event_id: int
    created_by: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
