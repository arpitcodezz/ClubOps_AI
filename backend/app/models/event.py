from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    club_id: Mapped[int] = mapped_column(
        ForeignKey("clubs.id", ondelete="CASCADE"),
        nullable=False,
    )

    created_by: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    headline: Mapped[str | None] = mapped_column(
        String(300),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    banner_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    event_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    venue: Mapped[str | None] = mapped_column(
        String(300),
        nullable=True,
    )

    start_datetime: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    end_datetime: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    registration_deadline: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    capacity: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="DRAFT",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )