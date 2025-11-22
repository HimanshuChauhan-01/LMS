import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCourses } from '../context/CourseContext'

/* CATEGORY → IMAGE MAP */
const categoryImages = {
  Programming: "https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg",
  "Web Development": "https://img.freepik.com/free-vector/gradient-web-hosting-illustration_23-2149237109.jpg",
  Design: "https://img.freepik.com/free-vector/flat-design-illustration-ux-ui-design_23-2149032053.jpg",
  Business: "https://img.freepik.com/free-vector/flat-design-business-communication-concept_23-2149154244.jpg",
  "Data Science": "https://img.freepik.com/free-vector/data-scientist-illustration_23-2148785638.jpg"
}

const getAdminImage = (course) => {
  return course.thumbnail?.trim()
    ? course.thumbnail
    : categoryImages[course.category] ||
        "https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg"
}

const AdminPanel = () => {
  const { user } = useAuth()
  const { courses, addCourse, deleteCourse } = useCourses()

  const [activeTab, setActiveTab] = useState("courses")
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [deleteLoadingId, setDeleteLoadingId] = useState(null)
  const [teachers, setTeachers] = useState([])

  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    type: "Programming",
    level: "Beginner",
    duration: "",
  })

  /* ============================================
      FETCH TEACHERS FROM API
  ============================================= */
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const res = await fetch("https://lms-login.onrender.com/api/auth/faculty")
        const data = await res.json()
        setTeachers(data)
      } catch (err) {
        console.log("Failed to load teachers", err)
      }
    }
    loadTeachers()
  }, [])

  /* ============================================
       ADD COURSE — POST API (with loader)
  ============================================= */
  const handleAddCourse = async (e) => {
    e.preventDefault()
    setLoadingAdd(true)

    try {
      const response = await fetch(
        "https://course-api-9imo.onrender.com/api/courses/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCourse),
        }
      )

      if (!response.ok) {
        alert("Failed to add course")
      } else {
        await addCourse() // refresh list (you already load from API)
        alert("Course added successfully!")
        setShowAddCourse(false)
      }
    } catch (err) {
      console.log(err)
      alert("Error adding course")
    }

    setLoadingAdd(false)
  }

  /* ============================================
        DELETE COURSE HANDLER (with loader)
  ============================================= */
  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return

    setDeleteLoadingId(id)

    try {
      const response = await fetch(
        `https://course-api-9imo.onrender.com/api/courses/delete/${id}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        alert("Delete failed")
      } else {
        await deleteCourse(id)
        alert("Deleted successfully")
      }
    } catch (err) {
      console.log(err)
      alert("Error deleting course")
    }

    setDeleteLoadingId(null)
  }

  if (!user || user.role !== "ADMIN") {
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

      {/* ---------------- TABS ---------------- */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {["courses", "teachers", "users", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* ---------------- COURSES TAB ---------------- */}
      {activeTab === "courses" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Course Management
            </h2>
            <button onClick={() => setShowAddCourse(true)} className="btn-primary">
              Add New Course
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="card">
                <div className="flex items-start justify-between">

                  <div className="flex items-start space-x-4">
                    <img
                      src={getAdminImage(course)}
                      alt={course.title}
                      className="w-20 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        {course.category} • {course.difficulty}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm px-3 py-1">Edit</button>

                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm px-3 py-1 rounded"
                    >
                      {deleteLoadingId === course.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TEACHERS TAB ---------------- */}
      {activeTab === "teachers" && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Faculty Members
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {teachers.map((t) => (
              <div key={t.id} className="card flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    👨‍🏫
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {t.email}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-green-200 text-green-900 rounded-full text-sm">
                  Approved
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- ADD COURSE MODAL ---------------- */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New Course
              </h3>
              <button
                onClick={() => setShowAddCourse(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-4">

              <input
                type="text"
                placeholder="Course Name"
                className="input-field"
                required
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              />

              <textarea
                placeholder="Course Description"
                className="input-field"
                rows="3"
                required
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <select
                  className="input-field"
                  value={newCourse.type}
                  onChange={(e) => setNewCourse({ ...newCourse, type: e.target.value })}
                >
                  <option>Programming</option>
                  <option>Web Development</option>
                  <option>Design</option>
                  <option>Business</option>
                  <option>Data Science</option>
                </select>

                <select
                  className="input-field"
                  value={newCourse.level}
                  onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Duration (e.g. 3 Months)"
                className="input-field"
                required
                value={newCourse.duration}
                onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
              />

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loadingAdd}
              >
                {loadingAdd ? "Adding..." : "Add Course"}
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
