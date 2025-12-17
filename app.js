// Storage utility functions
const Storage = {
  get(key) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Error writing to localStorage:", error)
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  },
}

// Authentication functions
function getCurrentUser() {
  return Storage.get("currentUser")
}

function setCurrentUser(user) {
  Storage.set("currentUser", user)
}

function logout() {
  Storage.remove("currentUser")
  window.location.href = "index.html"
}

function checkAuth(requiredRole) {
  const user = getCurrentUser()
  if (!user || user.role !== requiredRole) {
    window.location.href = "index.html"
    return null
  }
  return user
}

// Quiz storage functions
function getAllQuizzes() {
  return Storage.get("quizzes") || []
}

function getQuizById(id) {
  const quizzes = getAllQuizzes()
  return quizzes.find((q) => q.id === id)
}

function saveQuiz(quiz) {
  const quizzes = getAllQuizzes()
  quizzes.push(quiz)
  Storage.set("quizzes", quizzes)
}

function updateQuiz(id, updatedQuiz) {
  const quizzes = getAllQuizzes()
  const index = quizzes.findIndex((q) => q.id === id)
  if (index !== -1) {
    quizzes[index] = updatedQuiz
    Storage.set("quizzes", quizzes)
  }
}

// Attempt storage functions
function getAllAttempts() {
  return Storage.get("attempts") || []
}

function getAttemptsByQuizId(quizId) {
  const attempts = getAllAttempts()
  return attempts.filter((a) => a.quizId === quizId)
}

function getAttemptsByStudent(studentEmail) {
  const attempts = getAllAttempts()
  return attempts.filter((a) => a.studentEmail === studentEmail)
}

function hasStudentCompletedQuiz(studentEmail, quizId) {
  const attempts = getAllAttempts()
  return attempts.some((a) => a.studentEmail === studentEmail && a.quizId === quizId)
}

function saveAttempt(attempt) {
  const attempts = getAllAttempts()
  attempts.push(attempt)
  Storage.set("attempts", attempts)
}

// Utility functions
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}min`
}

function calculateScore(answers, questions) {
  let correct = 0
  questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correct++
    }
  })
  return Math.round((correct / questions.length) * 100)
}
