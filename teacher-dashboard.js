document.addEventListener("DOMContentLoaded", () => {
  const user = window.checkAuth("teacher") // Assuming checkAuth is a global function
  if (!user) return

  document.getElementById("teacherNameDisplay").textContent = user.name

  loadQuizzes()
})

function loadQuizzes() {
  const user = window.getCurrentUser() // Assuming getCurrentUser is a global function
  const quizzes = window.getAllQuizzes().filter((q) => q.teacherEmail === user.email) // Assuming getAllQuizzes is a global function
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
      const attempts = window.getAttemptsByQuizId(quiz.id) // Assuming getAttemptsByQuizId is a global function
      const avgScore =
        attempts.length > 0 ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length) : 0

      return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 question-card">
                    <div class="card-body">
                        <h5 class="card-title">${quiz.title}</h5>
                        <p class="card-text text-muted">${quiz.description}</p>
                        <div class="d-flex gap-2 mb-3">
                            <span class="badge bg-primary">${quiz.questions.length} questions</span>
                            <span class="badge bg-info">${quiz.duration} min</span>
                        </div>
                        <div class="border-top pt-3 mb-3">
                            <div class="d-flex justify-content-between text-muted small">
                                <span>${attempts.length} tentative(s)</span>
                                <span>Moyenne: ${avgScore}%</span>
                            </div>
                        </div>
                        <a href="teacher-results.html?id=${quiz.id}" class="btn btn-outline-primary w-100">
                            Voir les résultats
                        </a>
                    </div>
                </div>
            </div>
        `
    })
    .join("")
}
