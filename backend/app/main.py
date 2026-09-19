from fastapi import FastAPI
from sqlalchemy import text

from app.core.config import settings
from app.db.database import engine
from app.api.routes import clubs, events, registrations, tasks


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)

app.include_router(
    tasks.router,
    prefix="/api",
)

app.include_router(
    events.router,
    prefix="/api",
)

app.include_router(
    registrations.router,
    prefix="/api",
)

app.include_router(
    clubs.router,
    prefix="/api",
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": settings.app_name,
        "version": settings.app_version,
    }


@app.get("/db-test")
def database_test():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {
            "database": "connected",
            "result": result.scalar(),
        }