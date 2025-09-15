"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shuffle, Plus, ArrowDown, Trash2 } from "lucide-react"
import Link from "next/link"

interface Student {
  id: number
  name: string
}

export default function StudentQueue() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Anna Kowalska" },
    { id: 2, name: "Jan Nowak" },
    { id: 3, name: "Maria Wiśniewska" },
    { id: 4, name: "Piotr Wójcik" },
    { id: 5, name: "Katarzyna Kowalczyk" },
  ])
  const [newStudentName, setNewStudentName] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isShuffling, setIsShuffling] = useState(false)

  const addStudent = () => {
    if (newStudentName.trim()) {
      const newStudent: Student = {
        id: Date.now(),
        name: newStudentName.trim(),
      }
      setStudents([...students, newStudent])
      setNewStudentName("")
    }
  }

  const removeStudent = (id: number) => {
    setStudents(students.filter((student) => student.id !== id))
    if (selectedStudent?.id === id) {
      setSelectedStudent(null)
    }
  }

  const shuffleStudents = () => {
    setIsShuffling(true)
    setTimeout(() => {
      const shuffled = [...students].sort(() => Math.random() - 0.5)
      setStudents(shuffled)
      setIsShuffling(false)
    }, 500)
  }

  const drawRandomStudent = () => {
    if (students.length > 0) {
      const randomIndex = Math.floor(Math.random() * students.length)
      setSelectedStudent(students[randomIndex])
    }
  }

  const moveToBottom = () => {
    if (selectedStudent) {
      const filteredStudents = students.filter((s) => s.id !== selectedStudent.id)
      setStudents([...filteredStudents, selectedStudent])
      setSelectedStudent(null)
    }
  }

  const moveStudentToBottom = (studentId: number) => {
    const studentToMove = students.find((s) => s.id === studentId)
    if (studentToMove) {
      const filteredStudents = students.filter((s) => s.id !== studentId)
      setStudents([...filteredStudents, studentToMove])
      if (selectedStudent?.id === studentId) {
        setSelectedStudent(null)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Losowanie Kolejki Uczniów</h1>
          <p className="text-muted-foreground mb-3">Zarządzaj listą uczniów i losuj kolejność</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Link href="/studentsList">
            <Button variant="outline" className="px-6">
              Lista uczniów
            </Button>
          </Link>
          <Link href="/">
            <Button className="px-6 bg-blue-600 text-white hover:bg-blue-700">
              Koło fortuny
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Dodawanie ucznia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Dodaj Ucznia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Imię i nazwisko ucznia"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addStudent()}
                />
                <Button onClick={addStudent} disabled={!newStudentName.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Losowanie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="h-5 w-5" />
                Losowanie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button onClick={drawRandomStudent} disabled={students.length === 0} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Wylosuj Ucznia
                </Button>
                <Button onClick={shuffleStudents} variant="outline" disabled={isShuffling || students.length === 0}>
                  <Shuffle className={`h-4 w-4 ${isShuffling ? "animate-spin" : ""}`} />
                </Button>
              </div>

              {selectedStudent && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">Wylosowany uczeń:</p>
                      <p className="text-lg font-bold text-green-800 dark:text-green-200">{selectedStudent.name}</p>
                    </div>
                    <Button
                      onClick={moveToBottom}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 bg-transparent"
                    >
                      <ArrowDown className="h-4 w-4" />
                      Na dół
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lista uczniów */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lista Uczniów</span>
              <Badge variant="secondary">
                {students.length} {students.length === 1 ? "uczeń" : "uczniów"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Brak uczniów na liście</p>
                <p className="text-sm">Dodaj pierwszego ucznia powyżej</p>
              </div>
            ) : (
              <div className="space-y-2">
                {students.map((student, index) => (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      selectedStudent?.id === student.id
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-muted border-border hover:bg-muted/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="font-medium text-foreground">{student.name}</span>
                      {selectedStudent?.id === student.id && (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white">Wylosowany</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {index === 0 && (
                        <Button
                          onClick={() => moveStudentToBottom(student.id)}
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="Przenieś na dół"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => removeStudent(student.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Usuń ucznia"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
