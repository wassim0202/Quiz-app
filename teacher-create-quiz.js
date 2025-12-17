document.addEventListener("DOMContentLoaded", () => {
  const user = checkAuth("teacher")
  if (!user) return

  document.getElementById("teacherNameDisplay").textContent = user.name

  const form = document.getElementById("createQuizForm")
  form.addEventListener("submit", handleSubmit)

  // Add first question by default
  addQuestion()
})

let questionCount = 0

function addQuestion() {
  questionCount++
  const questionsList = document.getElementById("questionsList")

  const questionHtml = `
        <div class="card mb-3 question-card" id="question-${questionCount}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="mb-0">Question ${questionCount}</h6>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeQuestion(${questionCount})">
                        Supprimer
                    </button>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Texte de la question</label>
                    <input type="text" class="form-control question-text" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Options de réponse</label>
                    <div class="options-list" id="options-${questionCount}">
                        ${[0, 1, 2, 3]
                          .map(
                            (i) => `
                            <div class="input-group mb-2">
                                <div class="input-group-text">
                                    <input class="form-check-input mt-0 correct-answer" type="radio" name="correct-${questionCount}" value="${i}" ${i === 0 ? "checked" : ""}>
                                </div>
                                <input type="text" class="form-control option-text" placeholder="Option ${i + 1}" required>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                    <small class="text-muted">Cochez la radio button pour indiquer la bonne réponse</small>
                </div>
            </div>
        </div>
    `

  questionsList.insertAdjacentHTML("beforeend", questionHtml)
}

function removeQuestion(id) {
  const question = document.getElementById(`question-${id}`)
  if (question && document.querySelectorAll(".question-card").length > 1) {
    question.remove()
    updateQuestionNumbers()
  } else {
    alert("Vous devez avoir au moins une question")
  }
}

function updateQuestionNumbers() {
  const questions = document.querySelectorAll(".question-card")
  questions.forEach((question, index) => {
    const header = question.querySelector("h6")
    header.textContent = `Question ${index + 1}`
  })
}

function handleSubmit(e) {
  e.preventDefault()

  const user = getCurrentUser()
  const title = document.getElementById("quizTitle").value
  const description = document.getElementById("quizDescription").value
  const duration = Number.parseInt(document.getElementById("quizDuration").value)
  const passingScore = Number.parseInt(document.getElementById("quizPassingScore").value)

  const questions = []
  const questionCards = document.querySelectorAll(".question-card")

  questionCards.forEach((card) => {
    const questionText = card.querySelector(".question-text").value
    const options = Array.from(card.querySelectorAll(".option-text")).map((input) => input.value)
    const correctAnswer = Number.parseInt(card.querySelector(".correct-answer:checked").value)

    questions.push({
      text: questionText,
      options: options,
      correctAnswer: correctAnswer,
    })
  })

  const quiz = {
    id: generateId(),
    title: title,
    description: description,
    duration: duration,
    passingScore: passingScore,
    questions: questions,
    teacherName: user.name,
    teacherEmail: user.email,
    teacherSubject: user.subject,
    createdAt: Date.now(),
  }

  saveQuiz(quiz)
  alert("Quiz créé avec succès!")
  window.location.href = "teacher-dashboard.html"
}

// Declare variables before using them
function checkAuth(role) {
  // Implementation for checkAuth
}

function getCurrentUser() {
  // Implementation for getCurrentUser
}

function generateId() {
  // Implementation for generateId
}

function saveQuiz(quiz) {
  // Implementation for saveQuiz
}
