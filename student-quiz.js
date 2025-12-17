let quiz = null
let currentQuestionIndex = 0
let answers = []
let timer = null
let timeRemaining = 0
let startTime = 0

// Declare or import necessary variables/functions here
function checkAuth(role) {
  // Placeholder for authentication check
  return { email: "student@example.com", name: "John Doe" }
}

function getQuizById(id) {
  // Placeholder for fetching quiz by ID
  return { id: "1", title: "Sample Quiz", questions: [{ text: "What is 2 + 2?", options: ["3", "4", "5", "6"] }] }
}

function hasStudentCompletedQuiz(email, quizId) {
  // Placeholder for checking if student has completed quiz
  return false
}

function getCurrentUser() {
  // Placeholder for getting current user
  return { email: "student@example.com", name: "John Doe" }
}

function calculateScore(answers, questions) {
  // Placeholder for calculating score
  return answers.filter((answer, index) => answer === index).length
}

function generateId() {
  // Placeholder for generating unique ID
  return "unique-id"
}

function saveAttempt(attempt) {
  // Placeholder for saving quiz attempt
  console.log("Quiz attempt saved:", attempt)
}

document.addEventListener("DOMContentLoaded", () => {
  const user = checkAuth("student")
  if (!user) return

  const urlParams = new URLSearchParams(window.location.search)
  const quizId = urlParams.get("id")

  if (!quizId) {
    window.location.href = "student-dashboard.html"
    return
  }

  quiz = getQuizById(quizId)
  if (!quiz) {
    window.location.href = "student-dashboard.html"
    return
  }

  // Check if already completed
  if (hasStudentCompletedQuiz(user.email, quizId)) {
    alert("Vous avez déjà complété ce quiz")
    window.location.href = "student-dashboard.html"
    return
  }

  initializeQuiz()
})

function initializeQuiz() {
  document.getElementById("quizTitle").textContent = quiz.title
  document.getElementById("totalQuestions").textContent = quiz.questions.length

  answers = new Array(quiz.questions.length).fill(null)
  timeRemaining = quiz.duration * 60
  startTime = Date.now()

  startTimer()
  renderQuestionNavigation()
  showQuestion(0)
}

function startTimer() {
  updateTimerDisplay()
  timer = setInterval(() => {
    timeRemaining--
    updateTimerDisplay()

    if (timeRemaining <= 0) {
      clearInterval(timer)
      alert("Temps écoulé!")
      submitQuiz()
    }
  }, 1000)
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  document.getElementById("timerDisplay").textContent =
    `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

function showQuestion(index) {
  currentQuestionIndex = index
  const question = quiz.questions[index]

  document.getElementById("currentQuestionNum").textContent = index + 1
  document.getElementById("questionText").textContent = question.text

  // Render options
  const optionsList = document.getElementById("optionsList")
  optionsList.innerHTML = question.options
    .map(
      (option, i) => `
        <div class="card option-card mb-3 ${answers[index] === i ? "selected" : ""}" onclick="selectOption(${i})">
            <div class="card-body">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="option" id="option-${i}" ${answers[index] === i ? "checked" : ""}>
                    <label class="form-check-label" for="option-${i}">
                        ${option}
                    </label>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  updateProgress()
  updateNavigationButtons()
  updateQuestionNavigation()
}

function selectOption(optionIndex) {
  answers[currentQuestionIndex] = optionIndex
  showQuestion(currentQuestionIndex)
}

function navigateQuestion(direction) {
  const newIndex = currentQuestionIndex + direction
  if (newIndex >= 0 && newIndex < quiz.questions.length) {
    showQuestion(newIndex)
  }
}

function jumpToQuestion(index) {
  showQuestion(index)
}

function updateProgress() {
  const answeredCount = answers.filter((a) => a !== null).length
  const progress = (answeredCount / quiz.questions.length) * 100

  document.getElementById("progressBar").style.width = progress + "%"
  document.getElementById("answeredCount").textContent = answeredCount
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const submitBtn = document.getElementById("submitBtn")

  prevBtn.disabled = currentQuestionIndex === 0

  if (currentQuestionIndex === quiz.questions.length - 1) {
    nextBtn.style.display = "none"
    submitBtn.style.display = "block"
  } else {
    nextBtn.style.display = "block"
    submitBtn.style.display = "none"
  }
}

function renderQuestionNavigation() {
  const nav = document.getElementById("questionNavigation")
  nav.innerHTML = quiz.questions
    .map(
      (_, i) => `
        <button type="button" class="question-nav-btn" onclick="jumpToQuestion(${i})">
            ${i + 1}
        </button>
    `,
    )
    .join("")
}

function updateQuestionNavigation() {
  const buttons = document.querySelectorAll(".question-nav-btn")
  buttons.forEach((btn, i) => {
    btn.classList.remove("answered", "current")
    if (answers[i] !== null) {
      btn.classList.add("answered")
    }
    if (i === currentQuestionIndex) {
      btn.classList.add("current")
    }
  })
}

function submitQuiz() {
  const unansweredCount = answers.filter((a) => a === null).length

  if (unansweredCount > 0) {
    if (!confirm(`Vous avez ${unansweredCount} question(s) non répondue(s). Voulez-vous vraiment soumettre?`)) {
      return
    }
  }

  clearInterval(timer)

  const user = getCurrentUser()
  const timeSpent = Math.floor((Date.now() - startTime) / 1000)
  const score = calculateScore(answers, quiz.questions)

  const attempt = {
    id: generateId(),
    quizId: quiz.id,
    quizTitle: quiz.title,
    studentName: user.name,
    studentEmail: user.email,
    answers: answers,
    score: score,
    timeSpent: timeSpent,
    completedAt: Date.now(),
  }

  saveAttempt(attempt)
  window.location.href = `student-result.html?attemptId=${attempt.id}`
}
