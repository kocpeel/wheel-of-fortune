"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, SkipForward, Trash2 } from "lucide-react";
import Link from "next/link";

interface Student {
  id: number;
  name: string;
}

interface HistoryEntry {
  id: number;
  name: string;
  count: number;
}

export default function StudentQueue() {
  const [queue, setQueue] = useState<Student[]>([
    { id: 1, name: "Anna Kowalska" },
    { id: 2, name: "Jan Nowak" },
    { id: 3, name: "Maria Wiśniewska" },
    { id: 4, name: "Piotr Wójcik" },
    { id: 5, name: "Katarzyna Kowalczyk" },
  ]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [newStudentName, setNewStudentName] = useState("");

  const nextStudent = useMemo(
    () => (queue.length > 0 ? queue[0] : null),
    [queue]
  );

  const addStudent = () => {
    if (!newStudentName.trim()) return;
    const newStudent: Student = { id: Date.now(), name: newStudentName.trim() };
    setQueue((prev) => [...prev, newStudent]);
    setNewStudentName("");
  };

  const removeFromQueue = (id: number) => {
    setQueue((prev) => prev.filter((s) => s.id !== id));
  };

  const skipNext = () => {
    if (queue.length === 0) return;
    const [first, ...rest] = queue;
    setQueue([...rest, first]);
  };

  const plusNext = () => {
    if (queue.length === 0) return;
    const [first, ...rest] = queue;
    setQueue([...rest, first]);
    setHistory((prev) => {
      const idx = prev.findIndex((h) => h.id === first.id);
      if (idx === -1)
        return [...prev, { id: first.id, name: first.name, count: 1 }];
      const updated = [...prev];
      updated[idx] = { ...updated[idx], count: updated[idx].count + 1 };
      return updated;
    });
  };

  const plusString = (count: number) => "+".repeat(Math.max(0, count));

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Playlist</h1>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Link href="/studentsList">
            <Button variant="outline" className="px-6">
              Playlist
            </Button>
          </Link>
          <Link href="/">
            <Button className="px-6 bg-blue-600 text-white hover:bg-blue-700">
              Wheel of Fortune
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add student to playlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Student full name"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addStudent()}
                />
                <Button onClick={addStudent} disabled={!newStudentName.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next student panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nextStudent ? (
                <div className="p-4 bg-muted dark:bg-muted/30 rounded-lg border border-border dark:border-border/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Next student:
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {nextStudent.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={plusNext}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Plus
                      </Button>
                      <Button onClick={skipNext} variant="outline">
                        <SkipForward className="h-4 w-4 mr-1" />
                        Skip
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No students in queue
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Playlist (queue)</span>
                <Badge variant="secondary">
                  {queue.length} {queue.length === 1 ? "student" : "students"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queue.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No students on the list</p>
                  <p className="text-sm">Add the first student above</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {queue.map((student, index) => (
                    <div
                      key={student.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        index === 0
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                          : "bg-muted dark:bg-muted/30 border-border dark:border-border/60 hover:bg-muted/70 dark:hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                        >
                          {index + 1}
                        </Badge>
                        <span className="font-medium text-foreground">
                          {student.name}
                        </span>
                        {index === 0 && (
                          <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                            Next
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => removeFromQueue(student.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Remove student"
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

          <Card>
            <CardHeader>
              <CardTitle>Already went</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No one has received a plus yet
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border dark:border-border/60 bg-muted dark:bg-muted/30"
                    >
                      <span className="font-medium text-foreground">
                        {h.name}
                      </span>
                      <Badge className="bg-green-600 hover:bg-green-700 text-white">
                        {plusString(h.count)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
