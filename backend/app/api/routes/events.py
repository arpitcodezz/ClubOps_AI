from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, require_roles
from app.db.database import get_db
from app.models.event import Event
from app.schemas.event import EventCreate, EventResponse, EventUpdate


router = APIRouter(
    prefix="/events",
    tags=["Events"],
)


@router.get(
    "/",
    response_model=list[EventResponse],
    dependencies=[Depends(get_current_user)],
)
def get_events(db: Session = Depends(get_db)):
    result = db.execute(select(Event))
    return result.scalars().all()


@router.get(
    "/{event_id}",
    response_model=EventResponse,
    dependencies=[Depends(get_current_user)],
)
def get_event(
    event_id: int,
    db: Session = Depends(get_db),
):
    event = db.get(Event, event_id)

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found",
        )

    return event


@router.post(
    "/",
    response_model=EventResponse,
    status_code=201,
)
def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_roles("ADMIN", "ORGANIZER")
    ),
):
    event = Event(
        club_id=event_data.club_id,
        created_by=int(current_user["sub"]),
        title=event_data.title,
        headline=event_data.headline,
        description=event_data.description,
        banner_url=event_data.banner_url,
        event_type=event_data.event_type,
        venue=event_data.venue,
        start_datetime=event_data.start_datetime,
        end_datetime=event_data.end_datetime,
        registration_deadline=event_data.registration_deadline,
        capacity=event_data.capacity,
        status=event_data.status,
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event


@router.patch(
    "/{event_id}",
    response_model=EventResponse,
)
def update_event(
    event_id: int,
    event_data: EventUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_roles("ADMIN", "ORGANIZER")
    ),
):
    event = db.get(Event, event_id)

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found",
        )

    update_data = event_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)

    return event


@router.delete(
    "/{event_id}",
    status_code=204,
)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_roles("ADMIN", "ORGANIZER")
    ),
):
    event = db.get(Event, event_id)

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found",
        )

    db.delete(event)
    db.commit()