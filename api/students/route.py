from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime
from app.logic.handle_students import load_students

students_bp = APIRouter(prefix="/students", tags=["Students"])


@students_bp.get("/students")
async def students(
    class_name: Optional[str] = Query(None, description="Filtruj po klasie"),
    sort_by_class: Optional[bool] = Query(
        False, description="Sortuj po klasie")
):
    students = load_students()
    if not students:
        print(f"{datetime.now()} - No students found in the JSON file.")

    if class_name:
        students = [s for s in students if s["class_name"] == class_name]

    if sort_by_class:
        students = sorted(students, key=lambda s: s["class_name"])

    return {"students": students}




zrób
