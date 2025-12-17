"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuizStorage } from "@/lib/quiz-storage"
import type { Quiz } from "@/lib/types"
import { LogOut, Clock, FileQuestion, Play, History } from "lucide-react"

export default function StudentDashboard() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [studentName, setStudentName] = useState("")
  const [studentId, setStudentId] = useState("")

  useEffect(() => {
    const type = localStorage.getItem("userType")
    const id = localStorage.getItem("studentId")
    const name = localStorage.getItem("studentName")

    if (type !== "student" || !id || !name) {
      router.push("/")
      return
    }

    setStudentId(id)
    setStudentName(name)
    setQuizzes(QuizStorage.getAllQuizzes())
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("studentId")
    localStorage.removeItem("studentName")
    router.push("/")
  }

  const getStudentAttempt = (quizId: string) => {
    const attempts = QuizStorage.getAttemptsByStudent(studentId)
    return attempts.find((a) => a.quizId === quizId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tableau de bord étudiant</h1>
            <p className="text-sm text-muted-foreground">
              {studentName} - {studentId}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/student/history")}>
              <History className="h-4 w-4 mr-2" />
              Historique
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-balance">Quiz disponibles</h2>
          <p className="text-muted-foreground mt-1">Sélectionnez un quiz pour commencer</p>
        </div>

        {quizzes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileQuestion className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun quiz disponible</h3>
              <p className="text-muted-foreground">Revenez plus tard pour voir les nouveaux quiz</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => {
              const attempt = getStudentAttempt(quiz.id)
              return (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-balance">{quiz.title}</CardTitle>
                    <CardDescription className="text-pretty">{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileQuestion className="h-4 w-4" />
                        <span>{quiz.questions.length} questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.duration} minutes</span>
                      </div>

                      {attempt ? (
                        <div className="pt-4 space-y-2">
                          <div className="bg-accent/10 rounded-md p-3 text-center">
                            <p className="text-sm text-muted-foreground mb-1">Votre score</p>
                            <p className="text-2xl font-bold text-accent">
                              {attempt.score}/{attempt.totalPoints}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {Math.round((attempt.score / attempt.totalPoints) * 100)}%
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => router.push(`/student/quiz/${quiz.id}/result`)}
                          >
                            Voir les détails
                          </Button>
                        </div>
                      ) : (
                        <Button className="w-full mt-4" onClick={() => router.push(`/student/quiz/${quiz.id}`)}>
                          <Play className="h-4 w-4 mr-2" />
                          Commencer le quiz
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
