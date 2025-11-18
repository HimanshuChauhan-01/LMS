import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useCourses } from '../context/CourseContext'
import ProgressBar from '../components/ProgressBar'

const MyCourses = () => {
  const { user } = useAuth()
  const { courses } = useCourses()

  const enrolledCourses = courses.filter(course => 
    user?.enrolledCourses?.includes(course.id)
  )

  const calculateProgress = (course) => {
    const totalLessons = course.lessons.length
    if (totalLessons === 0) return 0
    
    // Demo progress calculation
    const completedLessons = course.lessons.filter(lesson => 
      lesson.completedBy?.includes(user.id)
    ).length
    
    return Math.round((completedLessons / totalLessons) * 100)
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Please login to view your courses
        </h2>
        <a href="/courses" className="btn-primary">
          Browse Courses
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Continue your learning journey
        </p>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {enrolledCourses.map(course => {
            const progress = calculateProgress(course)
            const nextLesson = course.lessons.find(lesson => 
              !lesson.completedBy?.includes(user.id)
            )

            return (
              <div key={course.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {course.category} • {course.difficulty}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                        {progress}% Complete
                      </span>
                    </div>

                    <ProgressBar progress={progress} />

                    <div className="flex justify-between items-center mt-4">
                      <div>
                        {nextLesson && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Next: <span className="font-medium">{nextLesson.title}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <a 
                          href={`/course/${course.id}`}
                          className="btn-primary text-sm"
                        >
                          Continue Learning
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No courses enrolled yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start your learning journey by enrolling in courses
          </p>
          <a href="/courses" className="btn-primary">
            Browse Courses
          </a>
        </div>
      )}
    </div>
  )
}

export default MyCourses