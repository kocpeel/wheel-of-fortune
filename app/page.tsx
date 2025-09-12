"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RotateCcw, Trophy, Download, Moon, Sun, PartyPopper } from "lucide-react"

interface Student {
  id: string
  name: string
  firstName?: string
  fullName?: string
  full_name?: string
  class_name?: string
  counter?: number
  picked_history?: string[]
}

const defaultStudentNames = [
  "Anna Kowalska",
  "Jan Nowak",
  "Maria Wiśniewska",
  "Piotr Kowalczyk",
  "Katarzyna Zielińska",
  "Tomasz Lewandowski",
  "Agnieszka Wójcik",
  "Michał Kamiński",
]

const processStudentNames = (studentList: Student[]): Student[] => {
  // Extract first names and track duplicates
  const firstNameCounts: { [key: string]: number } = {}
  const firstNames = studentList.map((student) => {
    const fullName = student.full_name || student.name || ""
    const parts = fullName.trim().split(/\s+/)
    const firstName = parts[0]
    firstNameCounts[firstName] = (firstNameCounts[firstName] || 0) + 1
    return { ...student, firstName, fullName }
  })

  // Process names based on duplicates
  return firstNames.map((student) => {
    const parts = student.fullName.split(/\s+/)
    const firstName = parts[0]

    if (firstNameCounts[firstName] > 1 && parts.length > 1) {
      // If duplicate first name exists, add 2 letters from surname
      const surname = parts[parts.length - 1]
      const surnameLetters = surname.substring(0, 2).toUpperCase()
      return {
        ...student,
        name: `${firstName} ${surnameLetters}`,
      }
    } else {
      // Use just first name
      return {
        ...student,
        name: firstName,
      }
    }
  })
}

export default function StudentFortuneWheel() {
  const [students, setStudents] = useState<Student[]>([])
  const [inputText, setInputText] = useState(defaultStudentNames.join("\n"))
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showWinnerDialog, setShowWinnerDialog] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [className, setClassName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const lines = inputText.split("\n").filter((line) => line.trim() !== "")
    const newStudents: Student[] = lines.map((line, index) => ({
      id: `student-${index}`,
      name: line.trim(),
    }))
    const processedStudents = processStudentNames(newStudents)
    setStudents(processedStudents)
  }, [inputText])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const loadStudentsFromClass = async () => {
    if (!className.trim()) return

    setIsLoading(true)
    try {
      const upperCaseClassName = className.trim().toUpperCase()
      const response = await fetch(`/api/students?class_name=${encodeURIComponent(upperCaseClassName)}`)
      if (response.ok) {
        const data = await response.json()
        const classStudents = data.students || []

        if (Array.isArray(classStudents) && classStudents.length > 0) {
          const newStudentNames = classStudents.map(
            (student) => student.full_name || student.name || student.toString(),
          )
          setInputText(newStudentNames.join("\n"))
        }
      } else {
        console.error("Failed to load students:", response.statusText)
      }
    } catch (error) {
      console.error("Error loading students:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".json") && !file.name.endsWith(".csv")) {
      alert("Proszę wybrać plik JSON lub CSV")
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/students/", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Backend response:", result)

        if (result.students && Array.isArray(result.students)) {
          const newStudentNames = result.students.map(
            (student: any) => student.full_name || student.name || student.toString(),
          )
          setInputText(newStudentNames.join("\n"))
          alert(result.message || "Plik został pomyślnie przesłany")
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Failed to upload students:", response.statusText, errorData)
        alert(errorData.detail || "Błąd podczas wysyłania danych do serwera")
      }
    } catch (error) {
      console.error("Error processing file:", error)
      alert("Błąd podczas przetwarzania pliku")
    } finally {
      setIsLoading(false)
      event.target.value = ""
    }
  }

  const spinWheel = () => {
    if (students.length === 0 || students.length === 1) return

    setIsSpinning(true)
    setSelectedStudent(null)
    setShowWinnerDialog(false)

    const randomRotation = 1440 + Math.random() * 720
    const newRotation = rotation + randomRotation
    setRotation(newRotation)

    setTimeout(() => {
      const segmentAngle = 360 / students.length
      const normalizedRotation = newRotation % 360
      const adjustedRotation = (360 - normalizedRotation + 360) % 360
      const selectedIndex = Math.floor(adjustedRotation / segmentAngle) % students.length
      setSelectedStudent(students[selectedIndex])
      setIsSpinning(false)
      setShowWinnerDialog(true)
    }, 3000)
  }

  const resetWheel = () => {
    setRotation(0)
    setSelectedStudent(null)
    setIsSpinning(false)
    setShowWinnerDialog(false)
  }

  const segmentAngle = students.length > 0 ? 360 / students.length : 0

  const segmentColors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
  ]

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Button onClick={() => setIsDarkMode(!isDarkMode)} variant="outline" size="sm" className="ml-auto">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Student Selection Wheel</h1>
          <p className="text-muted-foreground">Click the wheel to randomly select a student!</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Fortune Wheel */}
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              {/* Wheel Container */}
              <div className="relative w-96 h-96 mx-auto">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
                  <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-black"></div>
                </div>

                {/* Wheel */}
                <div
                  ref={wheelRef}
                  className={`w-96 h-96 rounded-full border-4 border-foreground relative overflow-hidden cursor-pointer transition-transform ease-out ${isSpinning ? "" : ""}`}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transitionDuration: isSpinning ? "3s" : "0.3s",
                  }}
                  onClick={spinWheel}
                >
                  {students.length === 0 ? (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground text-center px-4 font-medium">Add students to get started!</p>
                    </div>
                  ) : (
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                      {students.map((student, index) => {
                        const startAngle = (index * segmentAngle - 90) * (Math.PI / 180) // Start from top
                        const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180)
                        const color = segmentColors[index % segmentColors.length]

                        const x1 = 100 + 95 * Math.cos(startAngle)
                        const y1 = 100 + 95 * Math.sin(startAngle)
                        const x2 = 100 + 95 * Math.cos(endAngle)
                        const y2 = 100 + 95 * Math.sin(endAngle)

                        const largeArcFlag = segmentAngle > 180 ? 1 : 0

                        const pathData = [
                          `M 100 100`,
                          `L ${x1} ${y1}`,
                          `A 95 95 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          `Z`,
                        ].join(" ")

                        const textAngle = startAngle + (endAngle - startAngle) / 2
                        const textRadius = 65
                        const textX = 100 + textRadius * Math.cos(textAngle)
                        const textY = 100 + textRadius * Math.sin(textAngle)

                        const segmentWidth = 2 * Math.PI * textRadius * (segmentAngle / 360)
                        let fontSize = Math.min(
                          segmentWidth / (student.name.length * 0.5), // Better ratio for shorter names
                          (segmentAngle / 360) * 35, // Slightly smaller max size
                          12, // Reduced max font size
                        )
                        fontSize = Math.max(fontSize, 7) // Smaller minimum size

                        return (
                          <g key={student.id}>
                            <path d={pathData} fill={color} stroke="white" strokeWidth="2" />
                            <text
                              x={textX}
                              y={textY}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="font-bold pointer-events-none select-none"
                              style={{
                                fill: "#ffffff",
                                fontSize: `${fontSize}px`,
                                textShadow:
                                  "1px 1px 3px rgba(0,0,0,1), -1px -1px 1px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.6)",
                                stroke: "#000000",
                                strokeWidth: "1px",
                                paintOrder: "stroke fill",
                              }}
                              transform={`rotate(${(textAngle * 180) / Math.PI}, ${textX}, ${textY})`}
                            >
                              {student.name}
                            </text>
                          </g>
                        )
                      })}
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Wheel Controls */}
            <div className="flex gap-4">
              <Button
                onClick={spinWheel}
                disabled={isSpinning || students.length === 0 || students.length === 1}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {students.length === 1 ? "Need more students" : isSpinning ? "Spinning..." : "Spin Wheel"}
              </Button>
              <Button onClick={resetWheel} variant="outline" size="lg" disabled={isSpinning}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Student Input Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Students ({students.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    placeholder="Enter student names (one per line):&#10;Anna Kowalska&#10;Jan Nowak&#10;Maria Wiśniewska"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    rows={15}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Each line represents one student. Students are added automatically as you type.
                  </p>
                </div>

                {/* Student Preview */}
                {students.length > 0 && (
                  <div className="border rounded-lg p-3 bg-muted">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Current Students:</h4>
                    <div className="space-y-1">
                      {students.map((student, index) => (
                        <div key={student.id} className="flex items-center gap-2 text-sm">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: segmentColors[index % segmentColors.length],
                            }}
                          />
                          <span className="text-foreground">{student.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Load Students from Class</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label htmlFor="class-input" className="block text-sm font-medium text-foreground mb-2">
                    Class Name
                  </label>
                  <Input
                    id="class-input"
                    placeholder="Enter class name (e.g., 3A, 2B, 1C)"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={loadStudentsFromClass}
                  disabled={!className.trim() || isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isLoading ? "Loading..." : "Załącz"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Enter a class name and click "Załącz" to load students from the JSON endpoint. Students will replace the
                current list.
              </p>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label htmlFor="json-upload" className="block text-sm font-medium text-foreground mb-2">
                      Upload Student File
                    </label>
                    <div className="relative">
                      <input
                        id="json-upload"
                        type="file"
                        accept=".json,.csv"
                        onChange={handleFileUpload}
                        disabled={isLoading}
                        className="hidden"
                      />
                      <Button
                        onClick={() => document.getElementById("json-upload")?.click()}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isLoading ? "Uploading..." : "Wybierz plik JSON/CSV"}
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Select a JSON or CSV file with student data. The backend will normalize the data and handle both
                  Polish and English field names (imie/nazwisko, full_name, klasa/class_name).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Winner Popup Dialog */}
      <Dialog open={showWinnerDialog} onOpenChange={setShowWinnerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-primary flex items-center justify-center gap-2">
              <PartyPopper className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
              Wygrał!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="mb-4">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-4">{selectedStudent?.name}</h3>
            <p className="text-lg text-muted-foreground mb-6">Gratulacje! 🎉</p>
            <Button
              onClick={() => setShowWinnerDialog(false)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              Zamknij
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
