import React, { createContext, useContext, useState, useEffect } from 'react'
import { sampleCourses } from '../data/sampleCourses'

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

  useEffect(() => {
    // Load courses from localStorage or use sample data
    const storedCourses = localStorage.getItem('lms_courses')
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses))
    } else {
      setCourses(sampleCourses)
      localStorage.setItem('lms_courses', JSON.stringify(sampleCourses))
    }
  }, [])

  const updateCourses = (newCourses) => {
    setCourses(newCourses)
    localStorage.setItem('lms_courses', JSON.stringify(newCourses))
  }

  // Student functions
  const enrollStudent = (courseId, userId) => {
    const updatedCourses = courses.map(course => 
      course.id === courseId 
        ? { ...course, students: [...(course.students || []), userId] }
        : course
    )
    updateCourses(updatedCourses)
  }

  const markLessonComplete = (courseId, lessonId, userId) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const updatedLessons = course.lessons.map(lesson =>
          lesson.id === lessonId 
            ? { ...lesson, completedBy: [...(lesson.completedBy || []), userId] }
            : lesson
        )
        return { ...course, lessons: updatedLessons }
      }
      return course
    })
    updateCourses(updatedCourses)
  }

  // Teacher functions
  const addLesson = (courseId, lessonData) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? { ...course, lessons: [...course.lessons, { ...lessonData, id: `l${Date.now()}` }] }
        : course
    )
    updateCourses(updatedCourses)
  }

  const updateLesson = (courseId, lessonId, data) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const updatedLessons = course.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, ...data } : lesson
        )
        return { ...course, lessons: updatedLessons }
      }
      return course
    })
    updateCourses(updatedCourses)
  }

  // Admin functions
  const addCourse = (courseData) => {
    const newCourse = {
      ...courseData,
      id: `c${Date.now()}`,
      lessons: [],
      teachers: [],
      students: []
    }
    const updatedCourses = [...courses, newCourse]
    updateCourses(updatedCourses)
  }

  const assignTeacher = (courseId, teacherId) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? { ...course, teachers: [...new Set([...course.teachers, teacherId])] }
        : course
    )
    updateCourses(updatedCourses)
  }

  const deleteCourse = (courseId) => {
    const updatedCourses = courses.filter(course => course.id !== courseId)
    updateCourses(updatedCourses)
  }

  const value = {
    courses,
    enrollStudent,
    markLessonComplete,
    addLesson,
    updateLesson,
    addCourse,
    assignTeacher,
    deleteCourse
  }

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  )
}