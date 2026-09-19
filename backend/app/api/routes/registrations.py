from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, require_roles
from app.db.database import get_db
from app.models.event import Event
from app.models.registration import EventRegistration
from app.models.user import User
from app.schemas.registration import (
    RegistrationCreate,
    RegistrationResponse,
    RegistrationUpdate,
)

router = APIRouter(
    prefix="/registrations",
    tags=["Registrations"],
    dependencies=[Depends(get_current_user)],
)


@router.get(
    "/",
    response_model=list[RegistrationResponse],
    dependencies=[Depends(get_current_user)],
)
def get_registrations(db: Session = Depends(get_db)):
    result = db.execute(select(EventRegistration))
    return result.scalars().all()


@router.get(
    "/{registration_id}",
    response_model=RegistrationResponse,
    dependencies=[Depends(get_current_user)],
)
def get_registration(
    registration_id: int,
    db: Session = Depends(get_db),
):
    registration = db.get(EventRegistration, registration_id)

    if registration is None:
        raise HTTPException(404, "Registration not found")

    return registration


@router.post(
    "/",
    response_model=RegistrationResponse,
    status_code=201,
)
def create_registration(
    registration_data: RegistrationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user_id = int(current_user["sub"])

    event = db.get(Event, registration_data.event_id)

    if event is None:
        raise HTTPException(404, "Event not found")

    user = db.get(User, user_id)

    if user is None:
        raise HTTPException(404, "User not found")

    if user.role != "PARTICIPANT":
        raise HTTPException(
            403,
            "Only participants can register for events",
        )

    if event.registration_deadline:
        now = datetime.now(timezone.utc)
        deadline = event.registration_deadline

        if deadline.tzinfo is None:
            deadline = deadline.replace(tzinfo=timezone.utc)

        if now > deadline:
            raise HTTPException(
                400,
                "Registration deadline has passed",
            )

    existing = db.execute(
        select(EventRegistration).where(
            EventRegistration.event_id == event.id,
            EventRegistration.user_id == user_id,
        )
    ).scalar_one_or_none()

    if existing:
        raise HTTPException(
            409,
            "User is already registered for this event",
        )

    if event.capacity is not None:
        count = db.scalar(
            select(func.count(EventRegistration.id)).where(
                EventRegistration.event_id == event.id
            )
        )

        if count >= event.capacity:
            raise HTTPException(
                400,
                "Event capacity is full",
            )

    registration = EventRegistration(
        event_id=event.id,
        user_id=user_id,
        status=registration_data.status,
    )

    db.add(registration)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            409,
            "User is already registered for this event",
        )

    db.refresh(registration)

    return registration


@router.patch(
    "/{registration_id}",
    response_model=RegistrationResponse,
)
def update_registration(
    registration_id: int,
    registration_data: RegistrationUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_roles("ADMIN", "ORGANIZER")
    ),
):
    registration = db.get(EventRegistration, registration_id)

    if registration is None:
        raise HTTPException(404, "Registration not found")

    registration.status = registration_data.status

    db.commit()
    db.refresh(registration)

    return registration


@router.delete(
    "/{registration_id}",
    status_code=204,
)
def delete_registration(
    registration_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    registration = db.get(EventRegistration, registration_id)

    if registration is None:
        raise HTTPException(404, "Registration not found")

    user_id = int(current_user["sub"])

    if (
        current_user.get("role") not in ("ADMIN", "ORGANIZER")
        and registration.user_id != user_id
    ):
        raise HTTPException(
            403,
            "You can only cancel your own registration",
        )

    db.delete(registration)
    db.commit()