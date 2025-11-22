import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useCourses } from '../context/CourseContext'

// 🔥 CATEGORY → IMAGE MAP
const categoryImages = {
  "Programming": "https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg",
  "Web Development": "https://img.freepik.com/free-vector/gradient-web-hosting-illustration_23-2149237109.jpg",
  "Design": "https://img.freepik.com/free-vector/flat-design-illustration-ux-ui-design_23-2149032053.jpg",
  "Business": "https://img.freepik.com/free-vector/flat-design-business-communication-concept_23-2149154244.jpg",
  "Data Science": "https://img.freepik.com/free-vector/data-scientist-illustration_23-2148785638.jpg",
};

// 🔥 Function to get actual working image
const getCourseImage = (course) => {
  return (
    (course.thumbnail && course.thumbnail.trim()) ||
    categoryImages[course.category] ||
    "https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg"
  );
};

const CourseCard = ({ course }) => {
  const { user, enrollCourse } = useAuth()
  const { courses } = useCourses()

  const isEnrolled = user?.enrolledCourses?.includes(course.id)

  // Calculate course progress
  function calculateProgress(course, user) {
    if (!user || !isEnrolled) return 0
    const courseData = courses.find(c => c.id === course.id)
    const totalLessons = courseData?.lessons?.length || 0
    if (totalLessons === 0) return 0

    const completedLessons = courseData?.lessons?.filter(lesson =>
      lesson.completedBy?.includes(user.id)
    ).length || 0

    return Math.round((completedLessons / totalLessons) * 100)
  }

  const progress = calculateProgress(course, user)

  const handleEnroll = () => {
    if (!user) {
      alert('Please login to enroll in courses')
      return
    }
    enrollCourse(course.id)
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">

      {/* 🔥 FIXED IMAGE SECTION */}
      <img
        src={getCourseImage(course)}
        alt={course.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      <div className="flex justify-between items-start mb-2">
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
          {course.category}
        </span>
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
          {course.difficulty}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {course.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {course.description}
      </p>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-1">
          <span className="text-yellow-500">⭐</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {course.rating}
          </span>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {course.duration}
        </span>
      </div>

      {isEnrolled && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <button
        onClick={handleEnroll}
        disabled={isEnrolled}
        className={`w-full ${
          isEnrolled
            ? 'btn-secondary cursor-not-allowed'
            : 'btn-primary'
        }`}
      >
        {isEnrolled ? 'Enrolled' : 'Enroll Now'}
      </button>
    </div>
  )
}

export default CourseCard
