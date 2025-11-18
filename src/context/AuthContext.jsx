import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('lms_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password, role) => {
    const mockUser = {
      id: `u${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      enrolledCourses: [],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`
    }
    
    setUser(mockUser)
    localStorage.setItem('lms_user', JSON.stringify(mockUser))
    return Promise.resolve(mockUser)
  }

  const signup = (name, email, password, role) => {
    const mockUser = {
      id: `u${Date.now()}`,
      name,
      email,
      role,
      enrolledCourses: [],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    }
    
    setUser(mockUser)
    localStorage.setItem('lms_user', JSON.stringify(mockUser))
    return Promise.resolve(mockUser)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('lms_user')
  }

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem('lms_user', JSON.stringify(updatedUser))
  }

  const enrollCourse = (courseId) => {
    if (!user.enrolledCourses.includes(courseId)) {
      const updatedUser = {
        ...user,
        enrolledCourses: [...user.enrolledCourses, courseId]
      }
      setUser(updatedUser)
      localStorage.setItem('lms_user', JSON.stringify(updatedUser))
    }
  }

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    enrollCourse,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}