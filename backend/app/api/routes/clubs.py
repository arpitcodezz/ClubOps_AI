from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.dependencies import require_roles
from app.db.database import get_db
from app.models.club import Club
from app.schemas.club import ClubCreate, ClubResponse, ClubUpdate


router = APIRouter(
    prefix="/clubs",
    tags=["Clubs"],
)


@router.get("/", response_model=list[ClubResponse])
def get_clubs(db: Session = Depends(get_db)):
    result = db.execute(select(Club))
    return result.scalars().all()


@router.get("/{club_id}", response_model=ClubResponse)
def get_club(
    club_id: int,
    db: Session = Depends(get_db),
):
    club = db.get(Club, club_id)

    if club is None:
        raise HTTPException(
            status_code=404,
            detail="Club not found",
        )

    return club


@router.post("/", response_model=ClubResponse, status_code=201)
def create_club(
    club_data: ClubCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_roles("ADMIN", "ORGANIZER")
    ),
):
    club = Club(
        name=club_data.name,
        description=club_data.description,
    )

    db.add(club)
    db.commit()
    db.refresh(club)

    return club


@router.patch("/{club_id}", response_model=ClubResponse)
def update_club(
    club_id: int,
    club_data: ClubUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_roles("ADMIN", "ORGANIZER")
    ),
):
    club = db.get(Club, club_id)

    if club is None:
        raise HTTPException(
            status_code=404,
            detail="Club not found",
        )

    update_data = club_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(club, field, value)

    db.commit()
    db.refresh(club)

    return club


@router.delete("/{club_id}", status_code=204)
def delete_club(
    club_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_roles("ADMIN", "ORGANIZER")
    ),
):
    club = db.get(Club, club_id)

    if club is None:
        raise HTTPException(
            status_code=404,
            detail="Club not found",
        )

    db.delete(club)
    db.commit()