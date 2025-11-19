import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useCourses } from '../context/CourseContext'
import ProgressBar from '../components/ProgressBar'

const Dashboard = () => {
  const { user } = useAuth()
  const { courses } = useCourses()

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Please login to view dashboard
        </h2>
      </div>
    )
  }

  // Student Dashboard
  if (user.role === 'STUDENT') {
    const enrolledCourses = courses.filter(course => 
      user.enrolledCourses.includes(course.id)
    )
    const totalLessons = enrolledCourses.reduce((acc, course) => acc + course.lessons.length, 0)
    const completedLessons = enrolledCourses.reduce((acc, course) => 
      acc + course.lessons.filter(lesson => lesson.completedBy?.includes(user.id)).length, 0
    )

    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {user.name}! Continue your learning journey.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {enrolledCourses.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Enrolled Courses</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {completedLessons}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Lessons Completed</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {totalLessons}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Total Lessons</div>
          </div>
        </div>

        {/* Recent Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Continue Learning
            </h3>
            <div className="space-y-4">
              {enrolledCourses.slice(0, 3).map(course => {
                const progress = Math.round((course.lessons.filter(lesson => 
                  lesson.completedBy?.includes(user.id)
                ).length / course.lessons.length) * 100) || 0
                
                return (
                  <div key={course.id} className="flex items-center space-x-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {course.title}
                      </h4>
                      <ProgressBar progress={progress} size="sm" showLabel={false} />
                    </div>
                    <a 
                      href={`/course/${course.id}`}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      Continue
                    </a>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recommended Courses
            </h3>
            <div className="space-y-3">
              {courses
                .filter(course => !user.enrolledCourses.includes(course.id))
                .slice(0, 3)
                .map(course => (
                  <div key={course.id} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {course.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {course.category} • {course.difficulty}
                      </p>
                    </div>
                    <a 
                      href={`/course/${course.id}`}
                      className="btn-secondary text-sm px-3 py-1"
                    >
                      View
                    </a>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Teacher Dashboard
  if (user.role === 'FACULTY') {
    const teachingCourses = courses.filter(course => 
      course.teachers.includes(user.id)
    )
    const totalStudents = teachingCourses.reduce((acc, course) => 
      acc + (course.students?.length || 0), 0
    )

    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your courses and track student progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {teachingCourses.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Courses Teaching</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {totalStudents}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Total Students</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {teachingCourses.reduce((acc, course) => acc + course.lessons.length, 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Lessons Created</div>
          </div>
        </div>

        {/* Teaching Courses */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Courses
            </h3>
            <button className="btn-primary">
              Create New Course
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teachingCourses.map(course => (
              <div key={course.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-20 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {course.students?.length || 0} students • {course.lessons.length} lessons
                    </p>
                    <div className="flex space-x-2">
                      <a 
                        href={`/course/${course.id}`}
                        className="btn-primary text-sm px-3 py-1"
                      >
                        Manage
                      </a>
                      <button className="btn-secondary text-sm px-3 py-1">
                        Add Lesson
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {teachingCourses.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              You are not teaching any courses yet.
            </div>
          )}
        </div>
      </div>
    )
  }

  // Admin Dashboard
  if (user.role === 'ADMIN') {
    const totalStudents = new Set(
      courses.flatMap(course => course.students || [])
    ).size

    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage the entire learning platform
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {courses.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Total Courses</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {totalStudents}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Total Students</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {new Set(courses.flatMap(course => course.teachers)).size}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Teachers</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {courses.reduce((acc, course) => acc + course.lessons.length, 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Total Lessons</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <a href="/admin" className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Manage Courses</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Add, edit, or remove courses</p>
                </div>
              </a>
              <a href="/admin" className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="text-2xl">👨‍🏫</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Manage Teachers</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Approve and assign teachers</p>
                </div>
              </a>
              <a href="/admin" className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="text-2xl">⚙️</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">System Settings</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Platform configuration</p>
                </div>
              </a>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">New course "React Advanced" was created</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">Teacher Sarah Johnson was assigned to Web Development course</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">15 new students enrolled today</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default Dashboard