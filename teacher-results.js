document.addEventListener("DOMContentLoaded", () => {
  const user = checkAuth("teacher")
  if (!user) return

  document.getElementById("teacherNameDisplay").textContent = user.name

  const urlParams = new URLSearchParams(window.location.search)
  const quizId = urlParams.get("id")

  if (!quizId) {
    window.location.href = "teacher-dashboard.html"
    return
  }

  loadResults(quizId)
})

function loadResults(quizId) {
  const quiz = getQuizById(quizId)
  if (!quiz) {
    window.location.href = "teacher-dashboard.html"
    return
  }

  const attempts = getAttemptsByQuizId(quizId)

  // Display quiz info
  document.getElementById("quizTitle").textContent = quiz.title
  document.getElementById("quizDescription").textContent = quiz.description

  // Calculate statistics
  const participantCount = attempts.length
  const averageScore =
    participantCount > 0 ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / participantCount) : 0
  const passRate =
    participantCount > 0
      ? Math.round((attempts.filter((a) => a.score >= quiz.passingScore).length / participantCount) * 100)
      : 0
  const averageTime =
    participantCount > 0 ? Math.round(attempts.reduce((sum, a) => sum + a.timeSpent, 0) / participantCount) : 0

  document.getElementById("participantCount").textContent = participantCount
  document.getElementById("averageScore").textContent = averageScore + "%"
  document.getElementById("passRate").textContent = passRate + "%"
  document.getElementById("averageTime").textContent = formatDuration(Math.round(averageTime / 60))

  // Display results table
  const tableBody = document.getElementById("resultsTableBody")
  const sortedAttempts = [...attempts].sort((a, b) => b.score - a.score)

  tableBody.innerHTML = sortedAttempts
    .map((attempt, index) => {
      const passed = attempt.score >= quiz.passingScore
      return `
            <tr>
                <td><span class="badge bg-secondary">#${index + 1}</span></td>
                <td>${attempt.studentName}</td>
                <td>${attempt.studentEmail}</td>
                <td><strong>${attempt.score}%</strong></td>
                <td>${formatDuration(Math.round(attempt.timeSpent / 60))}</td>
                <td>${formatDate(attempt.completedAt)}</td>
                <td>
                    <span class="badge bg-${passed ? "success" : "danger"}">
                        ${passed ? "Réussi" : "Échoué"}
                    </span>
                </td>
            </tr>
        `
    })
    .join("")

  // Display question analysis
  displayQuestionAnalysis(quiz, attempts)
}

function displayQuestionAnalysis(quiz, attempts) {
  const analysisDiv = document.getElementById("questionAnalysis")

  if (attempts.length === 0) {
    analysisDiv.innerHTML = '<p class="text-muted">Aucune donnée disponible</p>'
    return
  }

  const analysis = quiz.questions.map((question, qIndex) => {
    const correctCount = attempts.filter((attempt) => attempt.answers[qIndex] === question.correctAnswer).length
    const successRate = Math.round((correctCount / attempts.length) * 100)

    return { question, successRate, correctCount }
  })

  analysisDiv.innerHTML = analysis
    .map(
      (item, index) => `
        <div class="mb-4">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <strong>Question ${index + 1}:</strong> ${item.question.text}
                </div>
                <span class="badge bg-${item.successRate >= 60 ? "success" : "warning"}">
                    ${item.successRate}%
                </span>
            </div>
            <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-${item.successRate >= 60 ? "success" : "warning"}" 
                     style="width: ${item.successRate}%"></div>
            </div>
            <small class="text-muted">${item.correctCount} / ${attempts.length} étudiants ont répondu correctement</small>
        </div>
    `,
    )
    .join("")
}

// Declare the missing functions
function checkAuth(role) {
  // Placeholder for authentication check logic
  return { name: "Teacher Name" } // Example return value
}

function getQuizById(id) {
  // Placeholder for getting quiz by ID logic
  return {
    title: "Quiz Title",
    description: "Quiz Description",
    passingScore: 50,
    questions: [{ text: "Question 1", correctAnswer: "A" }],
  } // Example return value
}

function getAttemptsByQuizId(id) {
  // Placeholder for getting attempts by quiz ID logic
  return [
    {
      studentName: "Student 1",
      studentEmail: "student1@example.com",
      score: 80,
      timeSpent: 3600,
      completedAt: new Date(),
    },
    {
      studentName: "Student 2",
      studentEmail: "student2@example.com",
      score: 40,
      timeSpent: 7200,
      completedAt: new Date(),
    },
  ] // Example return value
}

function formatDuration(minutes) {
  // Placeholder for format duration logic
  return `${minutes} min` // Example return value
}

function formatDate(date) {
  // Placeholder for format date logic
  return date.toLocaleDateString() // Example return value
}
