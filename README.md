# 📝 ONLINE QUIZ APPLICATION - README

A production-grade full-stack online quiz application built with React, Node.js, Express, and MongoDB. Perfect for BCA mini projects and technical interviews.

## 🌟 Features

### User Features
- ✅ User authentication (Signup/Login with JWT)
- ✅ View all published quizzes
- ✅ Attempt quizzes with countdown timer
- ✅ Auto-scoring and result calculation
- ✅ View detailed result breakdown
- ✅ Attempt history tracking
- ✅ Responsive UI (Mobile & Desktop)

### Admin Features
- ✅ Secure admin login
- ✅ Create and manage quizzes
- ✅ Add MCQ questions with options
- ✅ Set time limits and marks
- ✅ Publish quizzes
- ✅ View all user attempts
- ✅ Performance analytics and statistics

### Technical Highlights
- 🔐 JWT-based authentication
- 🛡️ Role-based access control
- ⏱️ Real-time countdown timer
- 📊 Automatic scoring algorithm
- 🎨 Tailwind CSS responsive design
- 📱 Mobile-friendly interface
- 🗄️ MongoDB with Mongoose ODM
- ✔️ Input validation and error handling

---

## 🏗️ PROJECT STRUCTURE

```
Online Quiz application/
│
├── backend/                           # Node.js Express Server
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js           # MongoDB connection
│   │   │   └── jwt.js                # JWT configuration
│   │   ├── controllers/
│   │   │   ├── authController.js     # Auth logic
│   │   │   ├── quizController.js     # Quiz management
│   │   │   ├── questionController.js # Question management
│   │   │   └── resultController.js   # Result & scoring
│   │   ├── models/
│   │   │   ├── User.js               # User schema
│   │   │   ├── Quiz.js               # Quiz schema
│   │   │   ├── Question.js           # Question schema
│   │   │   └── Result.js             # Result schema
│   │   ├── middlewares/
│   │   │   ├── auth.js               # JWT verification
│   │   │   ├── authorization.js      # Role-based access
│   │   │   └── errorHandler.js       # Error handling
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Auth endpoints
│   │   │   ├── quizRoutes.js         # Quiz endpoints
│   │   │   ├── questionRoutes.js     # Question endpoints
│   │   │   └── resultRoutes.js       # Result endpoints
│   │   ├── utils/
│   │   │   ├── validation.js         # Input validation
│   │   │   └── businessLogic.js      # Scoring logic
│   │   └── server.js                 # Main server file
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/                          # React Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── Timer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global auth state
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── QuizListPage.jsx
│   │   │   ├── QuizAttemptPage.jsx
│   │   │   └── ResultPage.jsx
│   │   ├── services/
│   │   │   └── api.js                # API client
│   │   ├── hooks/
│   │   │   ├── useAuth.js            # Auth hook
│   │   │   └── useTimer.js           # Timer hook
│   │   ├── utils/
│   │   │   ├── quizUtils.js          # Utility functions
│   │   │   └── errorHandler.js       # Error formatting
│   │   ├── App.jsx                   # Main component
│   │   └── index.js                  # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
├── SYSTEM_DESIGN.md                  # Architecture docs
├── DATABASE_DESIGN.md                # Database schemas
├── FRONTEND_GUIDE.md                 # Frontend guide
└── README.md                         # This file
```

---

## 🚀 QUICK START

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Update .env with your MongoDB URI**
   ```
   MONGODB_URI=mongodb://localhost:27017/quiz-app
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

5. **Start backend server**
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Start React development server**
   ```bash
   npm start
   ```
   
   App will open on `http://localhost:3000`

---

## 📚 API ENDPOINTS

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user (protected)
```

### Quizzes (User)
```
GET    /api/quizzes          - Get all published quizzes
GET    /api/quizzes/:id      - Get quiz with questions
```

### Quizzes (Admin)
```
POST   /api/quizzes          - Create new quiz (admin)
GET    /api/quizzes/admin/all - Get admin's quizzes (admin)
PUT    /api/quizzes/:id      - Update quiz (admin)
PUT    /api/quizzes/:id/publish - Publish quiz (admin)
DELETE /api/quizzes/:id      - Delete quiz (admin)
```

### Questions (Admin)
```
POST   /api/questions        - Add question to quiz (admin)
GET    /api/questions/:quizId - Get quiz questions
PUT    /api/questions/:id    - Update question (admin)
DELETE /api/questions/:id    - Delete question (admin)
```

### Results
```
POST   /api/results/submit   - Submit quiz attempt
GET    /api/results/:resultId - Get result details
GET    /api/results/user/attempts - Get user's attempts
GET    /api/results/quiz/:quizId - Get quiz attempts (admin)
GET    /api/admin/statistics - Get admin statistics (admin)
```

---

## 🔐 DEFAULT CREDENTIALS (For Testing)

### User Account
- Email: `user@example.com`
- Password: `123456`
- Role: USER

### Admin Account
- Email: `admin@example.com`
- Password: `123456`
- Role: ADMIN

> ⚠️ **Note**: Create these accounts during development or modify `seed.js` for auto-seeding.

---

## 🎯 KEY BUSINESS LOGIC

### Scoring Algorithm
```
Score = (Correct Answers / Total Questions) × 100
Marks Obtained = (Correct Answers / Total Questions) × Total Marks
Passed = Marks Obtained >= Passing Score Threshold
```

### Timer Implementation
- Frontend-based countdown timer
- Auto-submits quiz when time expires
- Visual warning when < 5 minutes remaining

### Answer Validation
- No duplicate attempts per user per quiz
- All answers validated before submission
- Skipped questions marked as unanswered

---

## 🛠️ TECH STACK

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + React Router v6 |
| **Styling** | Tailwind CSS |
| **State Management** | Context API |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **API Communication** | Axios |
| **Validation** | Joi (backend), React (frontend) |

---

## 📱 RESPONSIVE DESIGN

- ✅ Mobile-first approach
- ✅ Works on all screen sizes
- ✅ Touch-friendly interface
- ✅ Optimized for tablets and desktops

---

## 🧪 TESTING

### Manual Testing Checklist

#### User Flow
- [ ] Register new user
- [ ] Login with credentials
- [ ] View available quizzes
- [ ] Start quiz attempt
- [ ] Answer questions and navigate
- [ ] Submit quiz before time expires
- [ ] View result summary
- [ ] Check detailed answer breakdown
- [ ] View attempt history

#### Admin Flow
- [ ] Login as admin
- [ ] Create new quiz
- [ ] Add questions with 4 options each
- [ ] Set correct answer for each question
- [ ] Publish quiz
- [ ] View all user attempts
- [ ] Check performance statistics

#### Edge Cases
- [ ] Submit empty quiz
- [ ] Time expires mid-quiz
- [ ] Network error during submission
- [ ] Invalid credentials login
- [ ] Duplicate account registration
- [ ] Unauthorized access to admin routes

---

## 🚀 DEPLOYMENT

### Backend (Heroku/Railway)
```bash
# Create Procfile
echo "web: npm start" > Procfile

# Deploy to Heroku
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
# Build React app
npm run build

# Deploy to Vercel
vercel
```

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Create database user
3. Whitelist IP address
4. Update MONGODB_URI in backend .env

---

## 📊 PERFORMANCE METRICS

- Page Load Time: < 2s
- API Response Time: < 500ms
- Quiz Navigation: Instant
- Timer Update: 1s interval

---

## 🐛 TROUBLESHOOTING

### Backend not connecting to MongoDB
```
Solution: Check MONGODB_URI in .env file
Check MongoDB service is running
Verify IP whitelist on MongoDB Atlas
```

### Frontend API errors
```
Solution: Ensure backend server is running on correct port
Check REACT_APP_API_URL in .env
Check CORS configuration in backend
```

### Timer not working
```
Solution: Browser tab must remain active
Check browser console for JavaScript errors
Ensure useTimer hook is properly initialized
```

### Login issues
```
Solution: Clear localStorage: localStorage.clear()
Check email/password in database
Verify JWT_SECRET is same on backend
```

---

## 📖 ADDITIONAL RESOURCES

- [System Design Document](SYSTEM_DESIGN.md)
- [Database Design Document](DATABASE_DESIGN.md)
- [Frontend Guide](FRONTEND_GUIDE.md)
- [Interview Preparation](INTERVIEW_PREP.md)

---

## ✅ PROJECT COMPLETENESS

- [x] System Architecture & Design
- [x] Database Schemas & Relationships
- [x] Backend API Implementation
- [x] Frontend UI/UX
- [x] Authentication & Authorization
- [x] Quiz Attempt Logic
- [x] Scoring Algorithm
- [x] Error Handling
- [x] Input Validation
- [x] Responsive Design
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] End-to-End Tests

---

## 📝 LICENSE

This project is open source and available for educational purposes.

---

## 👨‍💻 AUTHOR

Created as a comprehensive BCA mini project demonstrating full-stack development expertise.

---

## 💡 FUTURE ENHANCEMENTS

- [ ] Question shuffling
- [ ] Negative marking
- [ ] Partial marking
- [ ] Scheduled quizzes
- [ ] Question bank
- [ ] Leaderboard
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Payment integration
- [ ] Certificate generation
- [ ] Social sharing

---

**Last Updated**: January 2026  
**Version**: 1.0.0
