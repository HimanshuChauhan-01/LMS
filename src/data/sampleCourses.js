export const sampleCourses = [
  {
    id: "c1",
    title: "React Fundamentals",
    description: "Learn the basics of React including components, props, state, and hooks. Build your first React application with hands-on projects.",
    category: "Web Development",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    difficulty: "Beginner",
    duration: "12 hours",
    rating: 4.8,
    students: ["u1"],
    teachers: ["t1"],
    lessons: [
      {
        id: "l1",
        title: "Introduction to React",
        duration: "15m",
        type: "video",
        completed: false,
        videoUrl: "https://example.com/video1",
        description: "Get started with React and understand its core concepts"
      },
      {
        id: "l2",
        title: "JSX and Components",
        duration: "20m",
        type: "video",
        completed: false,
        videoUrl: "https://example.com/video2",
        description: "Learn JSX syntax and how to create reusable components"
      },
      {
        id: "l3",
        title: "Props and State",
        duration: "25m",
        type: "video",
        completed: false,
        videoUrl: "https://example.com/video3",
        description: "Understand how to pass data and manage component state"
      }
    ]
  },
  {
    id: "c2",
    title: "Advanced JavaScript",
    description: "Master advanced JavaScript concepts including closures, promises, async/await, and design patterns.",
    category: "Programming",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
    difficulty: "Intermediate",
    duration: "18 hours",
    rating: 4.6,
    students: ["u1"],
    teachers: ["t2"],
    lessons: [
      {
        id: "l4",
        title: "Closures and Scope",
        duration: "30m",
        type: "video",
        completed: false,
        videoUrl: "https://example.com/video4",
        description: "Deep dive into JavaScript closures and scope chain"
      },
      {
        id: "l5",
        title: "Async Programming",
        duration: "35m",
        type: "video",
        completed: false,
        videoUrl: "https://example.com/video5",
        description: "Master asynchronous JavaScript with promises and async/await"
      }
    ]
  },
  {
    id: "c3",
    title: "UI/UX Design Principles",
    description: "Learn the fundamentals of user interface and user experience design for modern web applications.",
    category: "Design",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
    difficulty: "Beginner",
    duration: "10 hours",
    rating: 4.9,
    students: [],
    teachers: ["t3"],
    lessons: [
      {
        id: "l6",
        title: "Design Thinking Process",
        duration: "25m",
        type: "video",
        completed: false,
        videoUrl: "https://example.com/video6",
        description: "Understand the design thinking methodology"
      }
    ]
  },
  {
    id: "c4",
    title: "Node.js Backend Development",
    description: "Build scalable server-side applications with Node.js, Express, and MongoDB.",
    category: "Backend Development",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
    difficulty: "Advanced",
    duration: "20 hours",
    rating: 4.7,
    students: [],
    teachers: ["t1", "t2"],
    lessons: [
      {
        id: "l7",
        title: "Setting up Express Server",
        duration: "20m",
        type: "video",
        completed: false,
        videoUrl: "https://example.com/video7",
        description: "Create your first Express.js server"
      }
    ]
  }
]

export const sampleTeachers = {
  "t1": {
    id: "t1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    expertise: ["React", "Node.js", "JavaScript"]
  },
  "t2": {
    id: "t2",
    name: "Mike Chen",
    email: "mike@example.com",
    expertise: ["JavaScript", "TypeScript", "Backend"]
  },
  "t3": {
    id: "t3",
    name: "Emily Davis",
    email: "emily@example.com",
    expertise: ["UI/UX Design", "Figma", "Design Systems"]
  }
}