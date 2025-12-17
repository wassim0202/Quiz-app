"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { QuizStorage } from "@/lib/quiz-storage"
import type { Quiz, QuizAttempt } from "@/lib/types"
import { Clock, ChevronRight, ChevronLeft } from "lucide-react"

export default function TakeQuizPage() {
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const loadedQuiz = QuizStorage.getQuizById(quizId)
    if (!loadedQuiz) {
      router.push("/student/dashboard")
      return
    }

    const studentId = localStorage.getItem("studentId")
    if (!studentId) {
      router.push("/")
      return
    }

    const existingAttempt = QuizStorage.getAttemptsByStudent(studentId).find((a) => a.quizId === quizId)
    if (existingAttempt) {
      router.push("/student/dashboard")
      return
    }

    setQuiz(loadedQuiz)
    setAnswers(new Array(loadedQuiz.questions.length).fill(-1))
    setTimeLeft(loadedQuiz.duration * 60)
  }, [quizId, router])

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    if (!quiz) return

    const studentId = localStorage.getItem("studentId") || ""
    const studentName = localStorage.getItem("studentName") || ""

    let score = 0
    let totalPoints = 0

    quiz.questions.forEach((q, index) => {
      totalPoints += q.points
      if (answers[index] === q.correctAnswer) {
        score += q.points
      }
    })

    const timeSpent = Math.floor((Date.now() - startTime) / 1000)

    const attempt: QuizAttempt = {
      id: crypto.randomUUID(),
      quizId: quiz.id,
      studentId,
      studentName,
      answers,
      score,
      totalPoints,
      completedAt: new Date().toISOString(),
      timeSpent,
    }

    QuizStorage.saveAttempt(attempt)
    router.push(`/student/quiz/${quizId}/result`)
  }

  if (!quiz) {
    return null
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-balance">{quiz.title}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} sur {quiz.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-mono font-bold text-primary">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-pretty">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[currentQuestion] === index
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card hover:border-primary/50 text-card-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion] === index
                          ? "border-primary bg-primary"
                          : "border-muted-foreground bg-transparent"
                      }`}
                    >
                      {answers[currentQuestion] === index && <div className="h-3 w-3 rounded-full bg-white" />}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              {currentQuestion > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="flex-1 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>
              )}

              {currentQuestion < quiz.questions.length - 1 ? (
                <Button onClick={() => setCurrentQuestion(currentQuestion + 1)} className="flex-1">
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="flex-1">
                  Soumettre le quiz
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
