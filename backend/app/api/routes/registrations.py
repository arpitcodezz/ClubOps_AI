from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.registration import EventRegistration
from app.schemas.registration import (
    RegistrationCreate,
    RegistrationResponse,
    RegistrationUpdate,
)


router = APIRouter(
    prefix="/registrations",
    tags=["Registrations"],
)


@router.get("/", response_model=list[RegistrationResponse])
def get_registrations(db: Session = Depends(get_db)):
    result = db.execute(select(EventRegistration))
    return result.scalars().all()


@router.get("/{registration_id}", response_model=RegistrationResponse)
def get_registration(
    registration_id: int,
    db: Session = Depends(get_db),
):
    registration = db.get(EventRegistration, registration_id)

    if registration is None:
        raise HTTPException(
            status_code=404,
            detail="Registration not found",
        )

    return registration


@router.post("/", response_model=RegistrationResponse, status_code=201)
def create_registration(
    registration_data: RegistrationCreate,
    db: Session = Depends(get_db),
):
    registration = EventRegistration(
        event_id=registration_data.event_id,
        user_id=registration_data.user_id,
        status=registration_data.status,
    )

    db.add(registration)
    db.commit()
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
):
    registration = db.get(EventRegistration, registration_id)

    if registration is None:
        raise HTTPException(
            status_code=404,
            detail="Registration not found",
        )

    registration.status = registration_data.status

    db.commit()
    db.refresh(registration)

    return registration


@router.delete("/{registration_id}", status_code=204)
def delete_registration(
    registration_id: int,
    db: Session = Depends(get_db),
):
    registration = db.get(EventRegistration, registration_id)

    if registration is None:
        raise HTTPException(
            status_code=404,
            detail="Registration not found",
        )

    db.delete(registration)
    db.commit()