from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.club_member import ClubMember
from app.schemas.club_member import (
    ClubMemberCreate,
    ClubMemberResponse,
    ClubMemberUpdate,
)


router = APIRouter(
    prefix="/club-members",
    tags=["Club Members"],
)


@router.get("/", response_model=list[ClubMemberResponse])
def get_club_members(db: Session = Depends(get_db)):
    result = db.execute(select(ClubMember))
    return result.scalars().all()


@router.get("/{member_id}", response_model=ClubMemberResponse)
def get_club_member(
    member_id: int,
    db: Session = Depends(get_db),
):
    member = db.get(ClubMember, member_id)

    if member is None:
        raise HTTPException(
            status_code=404,
            detail="Club member not found",
        )

    return member


@router.post("/", response_model=ClubMemberResponse, status_code=201)
def create_club_member(
    member_data: ClubMemberCreate,
    db: Session = Depends(get_db),
):
    member = ClubMember(
        club_id=member_data.club_id,
        user_id=member_data.user_id,
        role=member_data.role,
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    return member


@router.patch("/{member_id}", response_model=ClubMemberResponse)
def update_club_member(
    member_id: int,
    member_data: ClubMemberUpdate,
    db: Session = Depends(get_db),
):
    member = db.get(ClubMember, member_id)

    if member is None:
        raise HTTPException(
            status_code=404,
            detail="Club member not found",
        )

    update_data = member_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(member, field, value)

    db.commit()
    db.refresh(member)

    return member


@router.delete("/{member_id}", status_code=204)
def delete_club_member(
    member_id: int,
    db: Session = Depends(get_db),
):
    member = db.get(ClubMember, member_id)

    if member is None:
        raise HTTPException(
            status_code=404,
            detail="Club member not found",
        )

    db.delete(member)
    db.commit()