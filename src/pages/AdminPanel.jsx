import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCourses } from '../context/CourseContext'

const AdminPanel = () => {
  const { user } = useAuth()
  const { courses, addCourse, assignTeacher, deleteCourse } = useCourses()
  const [activeTab, setActiveTab] = useState('courses')
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    difficulty: 'Beginner',
    duration: '',
    thumbnail: ''
  })

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Admin privileges required to access this page.
        </p>
      </div>
    )
  }

  const handleAddCourse = (e) => {
    e.preventDefault()
    addCourse(newCourse)
    setNewCourse({
      title: '',
      description: '',
      category: 'Web Development',
      difficulty: 'Beginner',
      duration: '',
      thumbnail: ''
    })
    setShowAddCourse(false)
  }

  const handleAssignTeacher = (courseId, teacherId) => {
    assignTeacher(courseId, teacherId)
  }

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(courseId)
    }
  }

  // Mock teachers data
  const teachers = [
    { id: 't1', name: 'Sarah Johnson', email: 'sarah@example.com', status: 'approved' },
    { id: 't2', name: 'Mike Chen', email: 'mike@example.com', status: 'approved' },
    { id: 't3', name: 'Emily Davis', email: 'emily@example.com', status: 'pending' },
    { id: 't4', name: 'Alex Rodriguez', email: 'alex@example.com', status: 'approved' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Panel
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage courses, teachers, and platform settings
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {['courses', 'teachers', 'users', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Course Management
            </h2>
            <button
              onClick={() => setShowAddCourse(true)}
              className="btn-primary"
            >
              Add New Course
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {courses.map(course => (
              <div key={course.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-20 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        {course.category} • {course.difficulty} • {course.students?.length || 0} students
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                          {course.lessons.length} lessons
                        </span>
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                          ⭐ {course.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm px-3 py-1">
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course.id)}
                      className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teachers Tab */}
      {activeTab === 'teachers' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Teacher Management
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {teachers.map(teacher => (
              <div key={teacher.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-lg">👨‍🏫</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {teacher.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {teacher.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      teacher.status === 'approved' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {teacher.status}
                    </span>
                    
                    {teacher.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button className="btn-primary text-sm px-3 py-1">
                          Approve
                        </button>
                        <button className="btn-secondary text-sm px-3 py-1">
                          Reject
                        </button>
                      </div>
                    )}
                    
                    {teacher.status === 'approved' && (
                      <select 
                        className="input-field text-sm"
                        onChange={(e) => handleAssignTeacher('c1', teacher.id)}
                      >
                        <option>Assign to Course</option>
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New Course
              </h3>
              <button
                onClick={() => setShowAddCourse(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                    className="input-field"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  className="input-field"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={newCourse.difficulty}
                    onChange={(e) => setNewCourse({...newCourse, difficulty: e.target.value})}
                    className="input-field"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                    className="input-field"
                    placeholder="e.g., 12 hours"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={newCourse.thumbnail}
                    onChange={(e) => setNewCourse({...newCourse, thumbnail: e.target.value})}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Create Course
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
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

export default AdminPanel