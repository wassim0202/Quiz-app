"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, BookOpen } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [teacherEmail, setTeacherEmail] = useState("")
  const [teacherPassword, setTeacherPassword] = useState("")
  const [studentId, setStudentId] = useState("")
  const [studentName, setStudentName] = useState("")

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Store teacher session
    localStorage.setItem("userType", "teacher")
    localStorage.setItem("userEmail", teacherEmail)
    router.push("/teacher/dashboard")
  }

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Store student session
    localStorage.setItem("userType", "student")
    localStorage.setItem("studentId", studentId)
    localStorage.setItem("studentName", studentName)
    router.push("/student/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Plateforme Quiz</CardTitle>
          <CardDescription>Connectez-vous pour commencer</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                Étudiant
              </TabsTrigger>
              <TabsTrigger value="teacher" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Professeur
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Numéro d'étudiant</Label>
                  <Input
                    id="studentId"
                    type="text"
                    placeholder="Ex: ETU2024001"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentName">Nom complet</Label>
                  <Input
                    id="studentName"
                    type="text"
                    placeholder="Votre nom"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Se connecter
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="teacher">
              <form onSubmit={handleTeacherLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherEmail">Email</Label>
                  <Input
                    id="teacherEmail"
                    type="email"
                    placeholder="professeur@ecole.com"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacherPassword">Mot de passe</Label>
                  <Input
                    id="teacherPassword"
                    type="password"
                    placeholder="••••••••"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Se connecter
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
