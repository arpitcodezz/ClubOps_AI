from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, require_roles
from app.core.security import hash_password
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserUpdate


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/",
    response_model=list[UserResponse],
    dependencies=[Depends(require_roles("ADMIN", "ORGANIZER"))],
)
def get_users(db: Session = Depends(get_db)):
    result = db.execute(select(User))
    return result.scalars().all()


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    dependencies=[Depends(get_current_user)],
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = db.get(User, user_id)

    if user is None:
        raise HTTPException(404, "User not found")

    return user


@router.post("/", response_model=UserResponse, status_code=201)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    existing_user = db.execute(
        select(User).where(User.email == user_data.email)
    ).scalar_one_or_none()

    if existing_user is not None:
        raise HTTPException(
            409,
            "Email already registered",
        )

    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role="PARTICIPANT",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.patch(
    "/{user_id}",
    response_model=UserResponse,
)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = db.get(User, user_id)

    if user is None:
        raise HTTPException(404, "User not found")

    current_id = int(current_user["sub"])
    current_role = current_user.get("role")

    # Only ADMIN can modify another user's account.
    if current_id != user_id and current_role != "ADMIN":
        raise HTTPException(
            403,
            "You can only update your own account",
        )

    update_data = user_data.model_dump(exclude_unset=True)

    # Prevent non-admin users from changing their role.
    if "role" in update_data and current_role != "ADMIN":
        raise HTTPException(
            403,
            "Only admins can change user roles",
        )

    if "email" in update_data:
        existing_user = db.execute(
            select(User).where(
                User.email == update_data["email"],
                User.id != user_id,
            )
        ).scalar_one_or_none()

        if existing_user is not None:
            raise HTTPException(
                409,
                "Email already registered",
            )

    if "password" in update_data:
        update_data["password_hash"] = hash_password(
            update_data.pop("password")
        )

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return user


@router.delete(
    "/{user_id}",
    status_code=204,
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = db.get(User, user_id)

    if user is None:
        raise HTTPException(404, "User not found")

    current_id = int(current_user["sub"])
    current_role = current_user.get("role")

    if current_role != "ADMIN" and current_id != user_id:
        raise HTTPException(
            403,
            "You can only delete your own account",
        )

    db.delete(user)
    db.commit()