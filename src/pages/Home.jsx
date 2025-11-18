import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useCourses } from '../context/CourseContext'
import CourseCard from '../components/CourseCard'

const Home = () => {
  const { user } = useAuth()
  const { courses } = useCourses()

  const featuredCourses = courses.slice(0, 3)
  const trendingCourses = courses.slice(1, 4)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Learn Without Limits
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Start, switch, or advance your career with thousands of courses from industry experts.
        </p>
        <div className="flex justify-center space-x-4">
          {!user ? (
            <>
              <a href="/courses" className="btn-primary text-lg px-8 py-3">
                Explore Courses
              </a>
              <a href="/courses" className="btn-secondary text-lg px-8 py-3">
                Start Learning
              </a>
            </>
          ) : (
            <a href="/my-courses" className="btn-primary text-lg px-8 py-3">
              Continue Learning
            </a>
          )}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Featured Courses
          </h2>
          <a href="/courses" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            View All →
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Trending Courses */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Trending Now
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              10K+
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Active Students
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              500+
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Courses Available
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              50+
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Expert Instructors
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home