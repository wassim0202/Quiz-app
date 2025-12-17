"use client"

import { useEffect } from "react"

export default function Page() {
  useEffect(() => {
    // Redirect to the HTML version
    window.location.href = "/index.html"
  }, [])

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Redirection...</h1>
        <p style={{ color: "#666" }}>Chargement de votre plateforme de quiz</p>
      </div>
    </div>
  )
}
