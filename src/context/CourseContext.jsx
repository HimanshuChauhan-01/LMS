import React, { createContext, useContext, useState, useEffect } from 'react'

const CourseContext = createContext()

export const useCourses = () => {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider')
  }
  return context
}

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false) // For add/delete loading

  // ==========================
  // FETCH ALL COURSES
  // ==========================
  const fetchCourses = async () => {
    try {
      const res = await fetch("https://course-api-9imo.onrender.com/api/courses")
      const data = await res.json()

      const formatted = data.map(c => ({
        id: c.id,
        title: c.name,
        duration: c.duration,
        category: c.type.trim(),
        difficulty: c.level
          ? c.level.charAt(0).toUpperCase() + c.level.slice(1).toLowerCase()
          : "Beginner",
        description: c.description,
        thumbnail: "", // fallback image handled elsewhere
        lessons: [],
        teachers: [],
        students: []
      }))

      setCourses(formatted)
    } catch (err) {
      console.error("Failed to fetch courses:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCourses() }, [])

  // ==========================
  // ADD COURSE API
  // ==========================
  const addCourse = async (courseData) => {
    try {
      setActionLoading(true)

      const payload = {
        name: courseData.title,
        duration: courseData.duration,
        type: courseData.category,
        level: courseData.difficulty,
        description: courseData.description
      }

      const res = await fetch("https://course-api-9imo.onrender.com/api/courses/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        alert("Failed to add course")
        return
      }

      const newCourse = await res.json()

      // Add to local UI list
      setCourses(prev => [
        ...prev,
        {
          id: newCourse.id,
          title: newCourse.name,
          duration: newCourse.duration,
          category: newCourse.type,
          difficulty: newCourse.level,
          description: newCourse.description,
          thumbnail: "",
          lessons: [],
          teachers: [],
          students: []
        }
      ])

      alert("Course added successfully!")

    } catch (err) {
      console.error("Add course error:", err)
    } finally {
      setActionLoading(false)
    }
  }

  // ==========================
  // DELETE COURSE API
  // ==========================
  const deleteCourse = async (id) => {
    try {
      setActionLoading(true)

      const res = await fetch(`https://course-api-9imo.onrender.com/api/courses/delete/${id}`, {
        method: "DELETE"
      })

      if (!res.ok) {
        alert("Failed to delete course")
        return
      }

      // Update list instantly
      setCourses(prev => prev.filter(c => c.id !== id))

      alert("Course deleted!")

    } catch (err) {
      console.error("Delete error:", err)
    } finally {
      setActionLoading(false)
    }
  }

  // ====================================================
  // PROVIDER VALUE
  // ====================================================
  const value = {
    courses,
    loading,
    actionLoading,
    addCourse,
    deleteCourse,
    fetchCourses
  }

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  )
}
