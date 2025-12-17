"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { QuizStorage } from "@/lib/quiz-storage"
import type { Quiz, Question } from "@/lib/types"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"

export default function CreateQuizPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState(30)
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: crypto.randomUUID(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
    },
  ])

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 1,
      },
    ])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions]
    updated[questionIndex].options[optionIndex] = value
    setQuestions(updated)
  }

  const handleSave = () => {
    if (!title.trim()) {
      alert("Veuillez entrer un titre pour le quiz")
      return
    }

    const emptyQuestions = questions.filter((q) => !q.question.trim() || q.options.some((opt) => !opt.trim()))

    if (emptyQuestions.length > 0) {
      alert("Veuillez remplir toutes les questions et options")
      return
    }

    const userEmail = localStorage.getItem("userEmail") || ""

    const quiz: Quiz = {
      id: crypto.randomUUID(),
      title,
      description,
      duration,
      questions,
      createdBy: userEmail,
      createdAt: new Date().toISOString(),
    }

    QuizStorage.saveQuiz(quiz)
    router.push("/teacher/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Créer un nouveau quiz</h1>
          <p className="text-muted-foreground">Remplissez les informations ci-dessous</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du quiz</Label>
              <Input
                id="title"
                placeholder="Ex: Quiz de Mathématiques"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez le contenu du quiz"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <Card key={question.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Question {qIndex + 1}</CardTitle>
                {questions.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeQuestion(qIndex)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Question</Label>
                  <Textarea
                    placeholder="Entrez votre question"
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Options de réponse</Label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => updateQuestion(qIndex, "correctAnswer", oIndex)}
                        className="h-4 w-4"
                      />
                      <Input
                        placeholder={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      />
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground">Sélectionnez la bonne réponse avec le bouton radio</p>
                </div>

                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    min="1"
                    value={question.points}
                    onChange={(e) => updateQuestion(qIndex, "points", Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={addQuestion} variant="outline" className="flex-1 bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une question
          </Button>
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Enregistrer le quiz
          </Button>
        </div>
      </main>
    </div>
  )
}
