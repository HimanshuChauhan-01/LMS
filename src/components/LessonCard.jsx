import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useCourses } from '../context/CourseContext'

const LessonCard = ({ lesson, courseId, isTeacher = false }) => {
  const { user } = useAuth()
  const { markLessonComplete } = useCourses()

  const isCompleted = lesson.completedBy?.includes(user?.id)

  const handleMarkComplete = () => {
    if (user && !isCompleted) {
      markLessonComplete(courseId, lesson.id, user.id)
    }
  }

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${
      isCompleted ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-gray-800'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isCompleted 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}>
            {isCompleted ? '✓' : lesson.type === 'video' ? '🎬' : '📄'}
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {lesson.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {lesson.duration} • {lesson.type}
            </p>
            {lesson.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {lesson.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isTeacher && user && (
            <button
              onClick={handleMarkComplete}
              className={`px-3 py-1 rounded text-sm ${
                isCompleted
                  ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                  : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700'
              }`}
            >
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
          )}
          
          {isTeacher && (
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LessonCard