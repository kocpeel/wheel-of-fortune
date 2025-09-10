import { type NextRequest, NextResponse } from "next/server"

// Mock data structure matching the FastAPI backend
const mockStudents = [
  { id: 1, name: "Anna Kowalska", class_name: "3A" },
  { id: 2, name: "Jan Nowak", class_name: "3A" },
  { id: 3, name: "Maria Wiśniewska", class_name: "3A" },
  { id: 4, name: "Piotr Zieliński", class_name: "3B" },
  { id: 5, name: "Katarzyna Dąbrowska", class_name: "3B" },
  { id: 6, name: "Tomasz Lewandowski", class_name: "2A" },
  { id: 7, name: "Agnieszka Wójcik", class_name: "2A" },
  { id: 8, name: "Michał Kamiński", class_name: "2B" },
]

export async function GET(request: NextRequest, { params }: { params: { className: string } }) {
  const className = decodeURIComponent(params.className)

  // Filter students by class name
  const classStudents = mockStudents
    .filter((student) => student.class_name === className)
    .map((student) => student.name)

  return NextResponse.json(classStudents)
}
