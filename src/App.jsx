import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { CourseProvider } from './context/CourseContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Toaster } from "react-hot-toast";

// Pages
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import MyCourses from './pages/MyCourses'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import Profile from './pages/Profile'

// New route protection wrappers
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CourseProvider>
          <Toaster position="top-right" />
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Navbar />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">

                  <Routes>

                    {/* Public */}
                    <Route path="/" element={<Home />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/course/:id" element={<CourseDetails />} />

                    {/* Student Only */}
                    <Route
                      path="/my-courses"
                      element={
                        <ProtectedRoute>
                          <RoleRoute allowed={["STUDENT"]}>
                            <MyCourses />
                          </RoleRoute>
                        </ProtectedRoute>
                      }
                    />

                    {/* Any Logged-In User */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Only */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute>
                          <RoleRoute allowed={["ADMIN"]}>
                            <AdminPanel />
                          </RoleRoute>
                        </ProtectedRoute>
                      }
                    />

                    {/* Any Logged-In User */}
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                  </Routes>

                </main>
              </div>
            </div>
          </Router>
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
