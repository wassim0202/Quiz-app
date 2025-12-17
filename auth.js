document.addEventListener("DOMContentLoaded", () => {
  const studentLoginForm = document.getElementById("studentLoginForm")
  const teacherLoginForm = document.getElementById("teacherLoginForm")
  const setCurrentUser = (user) => {
    // Implementation of setCurrentUser
    localStorage.setItem("currentUser", JSON.stringify(user))
  }

  if (studentLoginForm) {
    studentLoginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("studentName").value
      const email = document.getElementById("studentEmail").value

      const user = {
        name: name,
        email: email,
        role: "student",
      }

      setCurrentUser(user)
      window.location.href = "student-dashboard.html"
    })
  }

  if (teacherLoginForm) {
    teacherLoginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("teacherName").value
      const email = document.getElementById("teacherEmail").value
      const subject = document.getElementById("teacherSubject").value

      const user = {
        name: name,
        email: email,
        subject: subject,
        role: "teacher",
      }

      setCurrentUser(user)
      window.location.href = "teacher-dashboard.html"
    })
  }
})
