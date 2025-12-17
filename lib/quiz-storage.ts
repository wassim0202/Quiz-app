import type { Quiz, QuizAttempt } from "./types"

const QUIZZES_KEY = "quizzes"
const ATTEMPTS_KEY = "quiz_attempts"

export const QuizStorage = {
  // Quiz operations
  getAllQuizzes: (): Quiz[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(QUIZZES_KEY)
    return data ? JSON.parse(data) : []
  },

  saveQuiz: (quiz: Quiz): void => {
    const quizzes = QuizStorage.getAllQuizzes()
    const index = quizzes.findIndex((q) => q.id === quiz.id)
    if (index >= 0) {
      quizzes[index] = quiz
    } else {
      quizzes.push(quiz)
    }
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes))
  },

  deleteQuiz: (quizId: string): void => {
    const quizzes = QuizStorage.getAllQuizzes()
    const filtered = quizzes.filter((q) => q.id !== quizId)
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(filtered))
  },

  getQuizById: (quizId: string): Quiz | null => {
    const quizzes = QuizStorage.getAllQuizzes()
    return quizzes.find((q) => q.id === quizId) || null
  },

  // Attempt operations
  getAllAttempts: (): QuizAttempt[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(ATTEMPTS_KEY)
    return data ? JSON.parse(data) : []
  },

  saveAttempt: (attempt: QuizAttempt): void => {
    const attempts = QuizStorage.getAllAttempts()
    attempts.push(attempt)
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts))
  },

  getAttemptsByQuiz: (quizId: string): QuizAttempt[] => {
    const attempts = QuizStorage.getAllAttempts()
    return attempts.filter((a) => a.quizId === quizId)
  },

  getAttemptsByStudent: (studentId: string): QuizAttempt[] => {
    const attempts = QuizStorage.getAllAttempts()
    return attempts.filter((a) => a.studentId === studentId)
  },
}
