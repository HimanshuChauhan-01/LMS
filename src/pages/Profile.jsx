import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCourses } from '../context/CourseContext'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const { courses } = useCourses()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: ''
  })

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Please login to view profile
        </h2>
      </div>
    )
  }

  const enrolledCourses = courses.filter(course => 
    user.enrolledCourses.includes(course.id)
  )

  const handleSave = () => {
    updateUser(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: '',
      bio: ''
    })
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <button className="btn-secondary">
                    Change Photo
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    JPG, GIF or PNG. Max size 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-field"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="input-field"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input-field"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="input-field"
                  rows="4"
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={user.role}
                  className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Learning Stats for Students */}
          {user.role === 'student' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Learning Statistics
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {enrolledCourses.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {enrolledCourses.reduce((acc, course) => acc + course.lessons.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {Math.round(enrolledCourses.reduce((acc, course) => {
                      const completed = course.lessons.filter(lesson => 
                        lesson.completedBy?.includes(user.id)
                      ).length
                      return acc + (completed / course.lessons.length) * 100
                    }, 0) / enrolledCourses.length) || 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Avg. Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                    {enrolledCourses.reduce((acc, course) => 
                      acc + course.lessons.filter(lesson => 
                        lesson.completedBy?.includes(user.id)
                      ).length, 0
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enrolled Courses */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Enrolled Courses
            </h3>
            <div className="space-y-3">
              {enrolledCourses.slice(0, 3).map(course => (
                <div key={course.id} className="flex items-center space-x-3">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {course.lessons.length} lessons
                    </p>
                  </div>
                </div>
              ))}
              
              {enrolledCourses.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No courses enrolled yet.
                </p>
              )}
              
              {enrolledCourses.length > 3 && (
                <a 
                  href="/my-courses"
                  className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View all courses
                </a>
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Account Settings
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                Change Password
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                Notification Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile