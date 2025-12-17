"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuizStorage } from "@/lib/quiz-storage"
import type { Quiz } from "@/lib/types"
import { Plus, LogOut, Clock, FileQuestion, Trash2, BarChart3 } from "lucide-react"

export default function TeacherDashboard() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const type = localStorage.getItem("userType")
    const email = localStorage.getItem("userEmail")

    if (type !== "teacher" || !email) {
      router.push("/")
      return
    }

    setUserEmail(email)
    loadQuizzes()
  }, [router])

  const loadQuizzes = () => {
    const allQuizzes = QuizStorage.getAllQuizzes()
    setQuizzes(allQuizzes)
  }

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const handleDeleteQuiz = (quizId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce quiz ?")) {
      QuizStorage.deleteQuiz(quizId)
      loadQuizzes()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tableau de bord professeur</h1>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-balance">Mes Quiz</h2>
            <p className="text-muted-foreground mt-1">Créez et gérez vos quiz</p>
          </div>
          <Button onClick={() => router.push("/teacher/create-quiz")} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Nouveau Quiz
          </Button>
        </div>

        {quizzes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileQuestion className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun quiz créé</h3>
              <p className="text-muted-foreground mb-6">Commencez par créer votre premier quiz</p>
              <Button onClick={() => router.push("/teacher/create-quiz")}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => {
              const attempts = QuizStorage.getAttemptsByQuiz(quiz.id)
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
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BarChart3 className="h-4 w-4" />
                        <span>{attempts.length} tentative(s)</span>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => router.push(`/teacher/quiz/${quiz.id}/results`)}
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Résultats
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteQuiz(quiz.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
