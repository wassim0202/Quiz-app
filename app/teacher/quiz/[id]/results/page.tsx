"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { QuizStorage } from "@/lib/quiz-storage"
import type { Quiz, QuizAttempt } from "@/lib/types"
import { ArrowLeft, Users, TrendingUp, Award, Clock } from "lucide-react"

export default function QuizResultsPage() {
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])

  useEffect(() => {
    const type = localStorage.getItem("userType")
    if (type !== "teacher") {
      router.push("/")
      return
    }

    const loadedQuiz = QuizStorage.getQuizById(quizId)
    if (!loadedQuiz) {
      router.push("/teacher/dashboard")
      return
    }

    const quizAttempts = QuizStorage.getAttemptsByQuiz(quizId)
    setQuiz(loadedQuiz)
    setAttempts(quizAttempts.sort((a, b) => b.score - a.score))
  }, [quizId, router])

  if (!quiz) {
    return null
  }

  const averageScore = attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length : 0

  const averagePercentage =
    attempts.length > 0 ? (averageScore / quiz.questions.reduce((sum, q) => sum + q.points, 0)) * 100 : 0

  const passedCount = attempts.filter((a) => (a.score / a.totalPoints) * 100 >= 50).length
  const passRate = attempts.length > 0 ? (passedCount / attempts.length) * 100 : 0

  const averageTime = attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.timeSpent, 0) / attempts.length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.push("/teacher/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">{quiz.title}</h1>
          <p className="text-muted-foreground mt-1">{quiz.description}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{attempts.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Moyenne
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{averagePercentage.toFixed(1)}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Taux de réussite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{passRate.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                {passedCount}/{attempts.length} réussi(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Temps moyen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {Math.floor(averageTime / 60)}m {Math.floor(averageTime % 60)}s
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Résultats des étudiants</CardTitle>
            <CardDescription>Classement par score décroissant</CardDescription>
          </CardHeader>
          <CardContent>
            {attempts.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">Aucune tentative</p>
                <p className="text-muted-foreground">
                  Les résultats apparaîtront ici une fois que les étudiants auront passé le quiz
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold">Rang</th>
                      <th className="text-left p-4 font-semibold">Étudiant</th>
                      <th className="text-left p-4 font-semibold">Numéro</th>
                      <th className="text-left p-4 font-semibold">Score</th>
                      <th className="text-left p-4 font-semibold">Pourcentage</th>
                      <th className="text-left p-4 font-semibold">Temps</th>
                      <th className="text-left p-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((attempt, index) => {
                      const percentage = Math.round((attempt.score / attempt.totalPoints) * 100)
                      const minutes = Math.floor(attempt.timeSpent / 60)
                      const seconds = attempt.timeSpent % 60
                      const date = new Date(attempt.completedAt)
                      const isPassed = percentage >= 50

                      return (
                        <tr key={attempt.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold">
                              {index + 1}
                            </div>
                          </td>
                          <td className="p-4 font-medium">{attempt.studentName}</td>
                          <td className="p-4 text-muted-foreground">{attempt.studentId}</td>
                          <td className="p-4 font-semibold">
                            {attempt.score}/{attempt.totalPoints}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                isPassed ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {percentage}%
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {minutes}m {seconds}s
                          </td>
                          <td className="p-4 text-muted-foreground">{date.toLocaleDateString("fr-FR")}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Analyse par question</CardTitle>
            <CardDescription>Taux de réussite pour chaque question</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quiz.questions.map((question, qIndex) => {
                const correctCount = attempts.filter((a) => a.answers[qIndex] === question.correctAnswer).length
                const successRate = attempts.length > 0 ? (correctCount / attempts.length) * 100 : 0

                return (
                  <div key={question.id} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-pretty flex-1">
                        Question {qIndex + 1}: {question.question}
                      </p>
                      <span className="text-sm font-semibold text-muted-foreground ml-4">
                        {correctCount}/{attempts.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                        <div className="bg-accent h-full transition-all" style={{ width: `${successRate}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-accent min-w-[4rem] text-right">
                        {successRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
