
# StudyNotion 🎓

*A Full-Stack Ed-Tech Platform built with MERN Stack*

## Live Link : https://studynotionnn.netlify.app/

## 🚀 Project Overview

StudyNotion is a fully functional ed-tech platform that enables **students** to learn seamlessly and **instructors** to showcase expertise.

It provides:

* 📚 Interactive and engaging learning experience for students
* 👩‍🏫 A platform for instructors to create, manage, and analyze courses
* 🌍 A scalable solution built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js)

---

## 🏗️ System Architecture

The platform follows a **client-server architecture** consisting of:

* **Front-end:** React.js (UI)
* **Back-end:** Node.js + Express.js (APIs & business logic)
* **Database:** MongoDB (Atlas cloud hosting)

---

## 🎨 Front-end

Built with **React.js**, styled using **CSS & TailwindCSS**, and state managed by **Redux**.

**Pages for Students:**

* Homepage
* Course List
* Wishlist
* Cart & Checkout
* Course Content
* User Profile & Edit Profile

**Pages for Instructors:**

* Dashboard (overview of courses, ratings, feedback)
* Insights (course views, clicks, metrics)
* Course Management (create, update, delete courses)
* Profile Management

**Future Admin Pages (scope):**

* Admin Dashboard
* Instructor & User Management
* Platform Insights

📐 **UI Design**: [Figma Prototype](https://www.figma.com/file/Mikd0FjHKAofUlWQSi70nf/StudyNotion_shared)

---

## ⚙️ Back-end

The backend is a **monolithic Node.js + Express.js application** with MongoDB for persistence.

**Core Features:**

* 🔑 Authentication & Authorization (JWT, OTP verification, Forgot password)
* 📘 Course Management (CRUD for courses, media handling with Cloudinary)
* 💳 Payments Integration (Razorpay checkout flow)
* 🖼️ Cloud Media Storage (Cloudinary for videos, images, documents)
* 📝 Markdown support for course content

**Key Libraries & Tools:**

* Node.js & Express.js
* MongoDB & Mongoose (ODM)
* JWT (authentication)
* Bcrypt (password hashing)

**Data Models:**

* Student schema
* Instructor schema
* Course schema

---

## 🔗 API Design

REST API with JSON exchange and standard HTTP methods (GET, POST, PUT, DELETE).

**Sample Endpoints:**

* `POST /api/auth/signup` → Register a new student/instructor
* `POST /api/auth/login` → Login & receive JWT token
* `POST /api/auth/verify-otp` → Verify OTP during signup
* `POST /api/auth/forgot-password` → Send password reset link
* `GET /api/courses` → Fetch all courses
* `POST /api/courses/:id/rate` → Rate a course

---

## ☁️ Deployment

* **Frontend:** [Netlify](https://www.netlify.com/)
* **Backend:** [Vercel](https://vercel.com)
* **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)
* **Media Storage:** [Cloudinary](https://cloudinary.com)

This ensures scalability, reliability, and high availability for the platform.

---

## 🧪 Testing

Includes unit testing and integration testing. Frameworks/tools:

* Jest (backend tests)
* React Testing Library (frontend tests)

---

## 🔮 Future Enhancements

* 🎮 **Gamification** (badges, points, leaderboards)
* 🛣️ **Personalized Learning Paths**
* 👥 **Social Learning Features** (group discussions, peer reviews)
* 📱 **Mobile App** (iOS/Android)
* 🤖 **AI-based Recommendations**
* 🕶️ **AR/VR Integration** for immersive learning

---

## 📌 Conclusion

StudyNotion is a robust and scalable ed-tech platform powered by the MERN stack.
It offers:

* Smooth user experience for students
* Powerful tools for instructors
* A roadmap for exciting **future enhancements**

---

## 🛠️ Tech Stack

* **Frontend:** React.js, TailwindCSS, Redux
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Atlas)
* **Media:** Cloudinary
* **Payments:** Razorpay
* **Hosting:** Vercel (frontend), Render/Railway (backend)


📢 *Contributions are welcome! Fork, raise issues, and submit PRs.*
