document.addEventListener("DOMContentLoaded", () => {
  const user = window.checkAuth("student") // Assuming checkAuth is a global function or imported
  if (!user) return

  document.getElementById("studentNameDisplay").textContent = user.name

  loadQuizzes()
})

function loadQuizzes() {
  const user = window.getCurrentUser() // Assuming getCurrentUser is a global function or imported
  const quizzes = window.getAllQuizzes() // Assuming getAllQuizzes is a global function or imported
  const quizzesList = document.getElementById("quizzesList")
  const noQuizzes = document.getElementById("noQuizzes")

  if (quizzes.length === 0) {
    quizzesList.innerHTML = ""
    noQuizzes.style.display = "block"
    return
  }

  noQuizzes.style.display = "none"
  quizzesList.innerHTML = quizzes
    .map((quiz) => {
      const completed = window.hasStudentCompletedQuiz(user.email, quiz.id) // Assuming hasStudentCompletedQuiz is a global function or imported
      const attempts = window.getAttemptsByQuizId(quiz.id) // Assuming getAttemptsByQuizId is a global function or imported

      return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 question-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title">${quiz.title}</h5>
                            ${completed ? '<span class="badge bg-success">Complété</span>' : ""}
                        </div>
                        <p class="card-text text-muted">${quiz.description}</p>
                        <div class="d-flex gap-2 mb-3">
                            <span class="badge bg-primary">${quiz.questions.length} questions</span>
                            <span class="badge bg-info">${quiz.duration} min</span>
                        </div>
                        <div class="border-top pt-3 mb-3">
                            <div class="text-muted small">
                                <div class="mb-1">Professeur: ${quiz.teacherName}</div>
                                <div>Matière: ${quiz.teacherSubject}</div>
                                ${attempts.length > 0 ? `<div class="mt-2">${attempts.length} étudiant(s) ont passé ce quiz</div>` : ""}
                            </div>
                        </div>
                        ${
                          !completed
                            ? `<a href="student-quiz.html?id=${quiz.id}" class="btn btn-primary w-100">Commencer le quiz</a>`
                            : `<button class="btn btn-outline-secondary w-100" disabled>Déjà complété</button>`
                        }
                    </div>
                </div>
            </div>
        `
    })
    .join("")
}
