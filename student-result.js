// Declare necessary functions and variables here
function checkAuth(role) {
  // Placeholder for authentication check
  return { name: "John Doe" } // Example user object
}

function getAllAttempts() {
  // Placeholder for getting all attempts
  return [{ id: "1", quizId: "1", score: 85, timeSpent: 1200, answers: ["A", "B", null, "D"] }] // Example attempts array
}

function getQuizById(quizId) {
  // Placeholder for getting quiz by ID
  return {
    title: "Math Quiz",
    passingScore: 80,
    questions: [
      { text: "What is 2 + 2?", options: ["A. 3", "B. 4", "C. 5", "D. 6"], correctAnswer: 1 },
      { text: "What is 3 * 3?", options: ["A. 6", "B. 9", "C. 12", "D. 15"], correctAnswer: 1 },
      { text: "What is 4 / 2?", options: ["A. 1", "B. 2", "C. 3", "D. 4"], correctAnswer: 3 },
      { text: "What is 5 - 2?", options: ["A. 2", "B. 3", "C. 4", "D. 5"], correctAnswer: 3 },
    ],
  } // Example quiz object
}

function formatDuration(minutes) {
  // Placeholder for formatting duration
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

document.addEventListener("DOMContentLoaded", () => {
  const user = checkAuth("student")
  if (!user) return

  document.getElementById("studentNameDisplay").textContent = user.name

  const urlParams = new URLSearchParams(window.location.search)
  const attemptId = urlParams.get("attemptId")

  if (!attemptId) {
    window.location.href = "student-dashboard.html"
    return
  }

  loadResult(attemptId)
})

function loadResult(attemptId) {
  const attempts = getAllAttempts()
  const attempt = attempts.find((a) => a.id === attemptId)

  if (!attempt) {
    window.location.href = "student-dashboard.html"
    return
  }

  const quiz = getQuizById(attempt.quizId)
  if (!quiz) {
    window.location.href = "student-dashboard.html"
    return
  }

  const passed = attempt.score >= quiz.passingScore
  const correctCount = quiz.questions.filter((q, i) => attempt.answers[i] === q.correctAnswer).length
  const incorrectCount = quiz.questions.length - correctCount

  // Display result icon
  const resultIcon = document.getElementById("resultIcon")
  resultIcon.innerHTML = passed
    ? `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-success">
             <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
             <polyline points="22 4 12 14.01 9 11.01"></polyline>
           </svg>`
    : `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-danger">
             <circle cx="12" cy="12" r="10"></circle>
             <line x1="15" y1="9" x2="9" y2="15"></line>
             <line x1="9" y1="9" x2="15" y2="15"></line>
           </svg>`

  // Display title and message
  document.getElementById("resultTitle").textContent = passed ? "Félicitations!" : "Quiz terminé"
  document.getElementById("resultMessage").textContent = passed
    ? `Vous avez réussi le quiz "${quiz.title}"!`
    : `Vous n'avez pas atteint le score minimum de ${quiz.passingScore}%`

  // Display statistics
  document.getElementById("scoreDisplay").textContent = attempt.score + "%"
  document.getElementById("correctCount").textContent = correctCount
  document.getElementById("incorrectCount").textContent = incorrectCount
  document.getElementById("timeSpent").textContent = formatDuration(Math.round(attempt.timeSpent / 60))

  // Display answers review
  displayAnswersReview(quiz, attempt)
}

function displayAnswersReview(quiz, attempt) {
  const reviewDiv = document.getElementById("answersReview")

  reviewDiv.innerHTML = quiz.questions
    .map((question, index) => {
      const userAnswer = attempt.answers[index]
      const isCorrect = userAnswer === question.correctAnswer
      const wasAnswered = userAnswer !== null

      return `
            <div class="mb-4 pb-4 border-bottom">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <h6>Question ${index + 1}</h6>
                    <span class="badge bg-${isCorrect ? "success" : "danger"}">
                        ${isCorrect ? "Correct" : "Incorrect"}
                    </span>
                </div>
                
                <p class="mb-3"><strong>${question.text}</strong></p>
                
                <div class="options-review">
                    ${question.options
                      .map((option, i) => {
                        let cardClass = "option-card"
                        if (i === question.correctAnswer) {
                          cardClass += " correct"
                        } else if (wasAnswered && i === userAnswer && !isCorrect) {
                          cardClass += " incorrect"
                        }

                        return `
                            <div class="card ${cardClass} mb-2">
                                <div class="card-body py-2">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span>${option}</span>
                                        ${
                                          i === question.correctAnswer
                                            ? '<span class="badge bg-success">Bonne réponse</span>'
                                            : wasAnswered && i === userAnswer
                                              ? '<span class="badge bg-danger">Votre réponse</span>'
                                              : ""
                                        }
                                    </div>
                                </div>
                            </div>
                        `
                      })
                      .join("")}
                </div>
                
                ${!wasAnswered ? '<p class="text-muted mt-2"><em>Vous n\'avez pas répondu à cette question</em></p>' : ""}
            </div>
        `
    })
    .join("")
}
