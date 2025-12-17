// Declare or import necessary variables and functions here
function checkAuth(role) {
  // Implementation of checkAuth
}

function getCurrentUser() {
  // Implementation of getCurrentUser
}

function getAttemptsByStudent(email) {
  // Implementation of getAttemptsByStudent
}

function getQuizById(id) {
  // Implementation of getQuizById
}

function formatDuration(minutes) {
  // Implementation of formatDuration
}

function formatDate(timestamp) {
  // Implementation of formatDate
}

document.addEventListener("DOMContentLoaded", () => {
  const user = checkAuth("student")
  if (!user) return

  document.getElementById("studentNameDisplay").textContent = user.name

  loadHistory()
})

function loadHistory() {
  const user = getCurrentUser()
  const attempts = getAttemptsByStudent(user.email)
  const tableBody = document.getElementById("historyTableBody")
  const noHistory = document.getElementById("noHistory")

  if (attempts.length === 0) {
    tableBody.innerHTML = ""
    noHistory.style.display = "block"
    return
  }

  noHistory.style.display = "none"

  const sortedAttempts = [...attempts].sort((a, b) => b.completedAt - a.completedAt)

  tableBody.innerHTML = sortedAttempts
    .map((attempt) => {
      const quiz = getQuizById(attempt.quizId)
      const passed = quiz && attempt.score >= quiz.passingScore

      return `
            <tr>
                <td>${attempt.quizTitle}</td>
                <td><strong>${attempt.score}%</strong></td>
                <td>${formatDuration(Math.round(attempt.timeSpent / 60))}</td>
                <td>${formatDate(attempt.completedAt)}</td>
                <td>
                    <span class="badge bg-${passed ? "success" : "danger"}">
                        ${passed ? "Réussi" : "Échoué"}
                    </span>
                </td>
                <td>
                    <a href="student-result.html?attemptId=${attempt.id}" class="btn btn-sm btn-outline-primary">
                        Voir détails
                    </a>
                </td>
            </tr>
        `
    })
    .join("")
}
