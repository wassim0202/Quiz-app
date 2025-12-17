"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuizStorage } from "@/lib/quiz-storage"
import type { Quiz, QuizAttempt } from "@/lib/types"
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react"

export default function QuizResultPage() {
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)

  useEffect(() => {
    const studentId = localStorage.getItem("studentId")
    if (!studentId) {
      router.push("/")
      return
    }

    const loadedQuiz = QuizStorage.getQuizById(quizId)
    const attempts = QuizStorage.getAttemptsByStudent(studentId)
    const studentAttempt = attempts.find((a) => a.quizId === quizId)

    if (!loadedQuiz || !studentAttempt) {
      router.push("/student/dashboard")
      return
    }

    setQuiz(loadedQuiz)
    setAttempt(studentAttempt)
  }, [quizId, router])

  if (!quiz || !attempt) {
    return null
  }

  const percentage = Math.round((attempt.score / attempt.totalPoints) * 100)
  const minutes = Math.floor(attempt.timeSpent / 60)
  const seconds = attempt.timeSpent % 60

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
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-balance">{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-primary/10 rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Score</p>
                <p className="text-4xl font-bold text-primary">
                  {attempt.score}/{attempt.totalPoints}
                </p>
                <p className="text-lg font-semibold text-primary mt-1">{percentage}%</p>
              </div>

              <div className="bg-accent/10 rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Résultat</p>
                <p className="text-2xl font-bold text-accent">{percentage >= 50 ? "Réussi" : "Échoué"}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {percentage >= 50 ? "Félicitations !" : "Continuez vos efforts"}
                </p>
              </div>

              <div className="bg-secondary rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Temps passé</p>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5 text-secondary-foreground" />
                  <p className="text-2xl font-bold text-secondary-foreground">
                    {minutes}m {seconds}s
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Détails des réponses</h2>

          {quiz.questions.map((question, index) => {
            const userAnswer = attempt.answers[index]
            const isCorrect = userAnswer === question.correctAnswer

            return (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg text-pretty">
                        Question {index + 1}: {question.question}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 ml-9">
                    {question.options.map((option, optIndex) => {
                      const isUserAnswer = userAnswer === optIndex
                      const isCorrectAnswer = question.correctAnswer === optIndex

                      return (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border-2 ${
                            isCorrectAnswer
                              ? "border-accent bg-accent/10 text-foreground"
                              : isUserAnswer
                                ? "border-destructive bg-destructive/10 text-foreground"
                                : "border-border bg-card text-card-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{option}</span>
                            {isCorrectAnswer && (
                              <span className="text-xs font-semibold text-accent">(Bonne réponse)</span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="text-xs font-semibold text-destructive">(Votre réponse)</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    <p className="text-sm text-muted-foreground mt-2">Points: {question.points}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
