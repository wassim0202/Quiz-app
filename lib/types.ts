export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  points: number
}

export interface Quiz {
  id: string
  title: string
  description: string
  duration: number // in minutes
  questions: Question[]
  createdBy: string
  createdAt: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  studentId: string
  studentName: string
  answers: number[]
  score: number
  totalPoints: number
  completedAt: string
  timeSpent: number // in seconds
}
