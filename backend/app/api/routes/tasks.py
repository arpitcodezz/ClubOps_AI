from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, require_roles
from app.db.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


# All authenticated users can view tasks
@router.get(
    "/",
    response_model=list[TaskResponse],
    dependencies=[Depends(get_current_user)],
)
def get_tasks(db: Session = Depends(get_db)):
    result = db.execute(select(Task))
    return result.scalars().all()


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    dependencies=[Depends(get_current_user)],
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    task = db.get(Task, task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    return task


# Only ADMIN and ORGANIZER can create tasks
@router.post(
    "/",
    response_model=TaskResponse,
    status_code=201,
)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_roles("ADMIN", "ORGANIZER")
    ),
):
    task = Task(
        event_id=task_data.event_id,
        assigned_to=task_data.assigned_to,
        created_by=int(current_user["sub"]),
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        status=task_data.status,
        due_date=task_data.due_date,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


# ADMIN and ORGANIZER can update any task
@router.patch(
    "/{task_id}",
    response_model=TaskResponse,
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    task = db.get(Task, task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    role = current_user.get("role")

    # Volunteers may only update tasks assigned to themselves
    if role == "VOLUNTEER":
        if task.assigned_to != int(current_user["sub"]):
            raise HTTPException(
                status_code=403,
                detail="You can only update tasks assigned to you",
            )
    elif role not in ("ADMIN", "ORGANIZER"):
        raise HTTPException(
            status_code=403,
            detail="Insufficient permissions",
        )

    update_data = task_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return task


# Only ADMIN and ORGANIZER can delete tasks
@router.delete(
    "/{task_id}",
    status_code=204,
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_roles("ADMIN", "ORGANIZER")
    ),
):
    task = db.get(Task, task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    db.delete(task)
    db.commit()