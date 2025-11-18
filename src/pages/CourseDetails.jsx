import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCourses } from '../context/CourseContext'
import LessonCard from '../components/LessonCard'
import ProgressBar from '../components/ProgressBar'

const CourseDetails = () => {
  const { id } = useParams()
  const { user, enrollCourse } = useAuth()
  const { courses, addLesson } = useCourses()
  
  const course = courses.find(c => c.id === id)
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [newLesson, setNewLesson] = useState({
    title: '',
    duration: '',
    type: 'video',
    description: ''
  })

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Course not found
        </h2>
      </div>
    )
  }

  const isEnrolled = user?.enrolledCourses?.includes(course.id)
  const isTeacher = user?.role === 'teacher' && course.teachers.includes(user.id)
  const isAdmin = user?.role === 'admin'

  const handleEnroll = () => {
    if (!user) {
      alert('Please login to enroll in this course')
      return
    }
    enrollCourse(course.id)
  }

  const handleAddLesson = (e) => {
    e.preventDefault()
    addLesson(course.id, {
      ...newLesson,
      id: `l${Date.now()}`,
      completed: false,
      videoUrl: 'https://example.com/video'
    })
    setNewLesson({ title: '', duration: '', type: 'video', description: '' })
    setShowAddLesson(false)
  }

  const progress = 25 // Demo progress

  return (
    <div className="max-w-6xl mx-auto">
      {/* Course Header */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {course.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {course.description}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {course.category}
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                {course.difficulty}
              </span>
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                ⭐ {course.rating}
              </span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                {course.duration}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {isEnrolled && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Your Progress
                </h3>
                <ProgressBar progress={progress} />
              </div>
            )}
            
            <button
              onClick={handleEnroll}
              disabled={isEnrolled}
              className={`w-full ${
                isEnrolled ? 'btn-secondary cursor-not-allowed' : 'btn-primary'
              }`}
            >
              {isEnrolled ? 'Enrolled' : 'Enroll in Course'}
            </button>

            {(isTeacher || isAdmin) && (
              <button
                onClick={() => setShowAddLesson(true)}
                className="w-full btn-secondary"
              >
                Add Lesson
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course Content
          </h2>
          <div className="text-gray-600 dark:text-gray-300">
            {course.lessons.length} lessons • {course.duration}
          </div>
        </div>

        <div className="space-y-4">
          {course.lessons.map(lesson => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson} 
              courseId={course.id}
              isTeacher={isTeacher}
            />
          ))}
          
          {course.lessons.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No lessons available yet.
            </div>
          )}
        </div>
      </div>

      {/* Add Lesson Modal */}
      {showAddLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New Lesson
              </h3>
              <button
                onClick={() => setShowAddLesson(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lesson Title
                </label>
                <input
                  type="text"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={newLesson.duration}
                  onChange={(e) => setNewLesson({...newLesson, duration: e.target.value})}
                  className="input-field"
                  placeholder="e.g., 15m, 1h 30m"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={newLesson.type}
                  onChange={(e) => setNewLesson({...newLesson, type: e.target.value})}
                  className="input-field"
                >
                  <option value="video">Video</option>
                  <option value="article">Article</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newLesson.description}
                  onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                  className="input-field"
                  rows="3"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Add Lesson
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLesson(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseDetails