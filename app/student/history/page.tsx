"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuizStorage } from "@/lib/quiz-storage"
import type { QuizAttempt } from "@/lib/types"
import { ArrowLeft, Calendar, Clock, Trophy } from "lucide-react"

export default function StudentHistoryPage() {
  const router = useRouter()
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])

  useEffect(() => {
    const studentId = localStorage.getItem("studentId")
    if (!studentId) {
      router.push("/")
      return
    }

    const studentAttempts = QuizStorage.getAttemptsByStudent(studentId)
    setAttempts(studentAttempts.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()))
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.push("/student/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">Historique des quiz</h1>
          <p className="text-muted-foreground mt-1">Vos tentatives précédentes</p>
        </div>

        {attempts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune tentative</h3>
              <p className="text-muted-foreground">Vous n'avez pas encore passé de quiz</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => {
              const quiz = QuizStorage.getQuizById(attempt.quizId)
              if (!quiz) return null

              const percentage = Math.round((attempt.score / attempt.totalPoints) * 100)
              const date = new Date(attempt.completedAt)
              const minutes = Math.floor(attempt.timeSpent / 60)
              const seconds = attempt.timeSpent % 60

              return (
                <Card key={attempt.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-balance">{quiz.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Score</p>
                          <p className="font-bold">
                            {attempt.score}/{attempt.totalPoints} ({percentage}%)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Temps</p>
                          <p className="font-bold">
                            {minutes}m {seconds}s
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-bold">{date.toLocaleDateString("fr-FR")}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() => router.push(`/student/quiz/${quiz.id}/result`)}
                        >
                          Voir les détails
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
