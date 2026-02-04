# 📂 COMPLETE FILE STRUCTURE & DESCRIPTIONS

## Project Root Directory
```
d:\Online Quiz application\
```

---

## 📄 DOCUMENTATION FILES (Root Level)

### 1. **README.md**
- **Purpose**: Main project guide
- **Contains**: Setup instructions, features list, API endpoints, troubleshooting
- **Audience**: Developers, evaluators, users
- **Size**: ~3KB

### 2. **SYSTEM_DESIGN.md**
- **Purpose**: High-level architecture documentation
- **Contains**: Architecture diagrams, data flow, component interaction, security layer design
- **Audience**: Architects, senior developers, interviewers
- **Size**: ~4KB

### 3. **DATABASE_DESIGN.md**
- **Purpose**: Database schema documentation
- **Contains**: 4 complete Mongoose schema implementations, relationships, queries, validation rules
- **Audience**: Database engineers, backend developers
- **Size**: ~6KB

### 4. **INTERVIEW_PREP.md**
- **Purpose**: Interview preparation guide
- **Contains**: 2-minute pitch, 22+ Q&A, behavioral questions, resume bullets
- **Audience**: Interviewees, hiring managers
- **Size**: ~8KB

### 5. **FRONTEND_GUIDE.md**
- **Purpose**: Frontend implementation guide
- **Contains**: React component code samples, patterns, page templates
- **Audience**: Frontend developers
- **Size**: ~5KB

### 6. **PROJECT_CHECKLIST.md**
- **Purpose**: Implementation verification and roadmap
- **Contains**: Feature checklist, file structure verification, deployment steps, growth roadmap
- **Audience**: Project managers, developers
- **Size**: ~6KB

### 7. **PROJECT_SUMMARY.md**
- **Purpose**: Executive summary and quick reference
- **Contains**: What's been created, statistics, getting started guide, next steps
- **Audience**: Everyone
- **Size**: ~5KB

### 8. **FILE_STRUCTURE.md** (This File)
- **Purpose**: Complete file listing and descriptions
- **Contains**: Every file, its purpose, and audience
- **Audience**: Developers, repository maintainers
- **Size**: ~2KB

---

## 🖥️ BACKEND FILES

### Directory Structure
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── package.json
├── .env.example
└── README.md
```

### Configuration Files

#### **backend/package.json**
- **Purpose**: Node.js project metadata and dependencies
- **Contains**: Scripts, dependencies (express, mongoose, bcrypt, jwt, cors, joi)
- **Lines**: ~40

#### **backend/.env.example**
- **Purpose**: Environment variables template
- **Contains**: PORT, MONGODB_URI, JWT_SECRET, NODE_ENV examples
- **Lines**: ~15

### Core Application

#### **backend/src/server.js**
- **Purpose**: Express server initialization and middleware setup
- **Contains**: 
  - CORS configuration
  - Body parser middleware
  - All route registration
  - Error handling middleware
  - Server startup logic
- **Lines**: ~80
- **Key Functions**: startServer()

### Configuration Modules

#### **backend/src/config/database.js**
- **Purpose**: MongoDB connection management
- **Contains**: 
  - connectDB() - Connect to MongoDB
  - disconnectDB() - Disconnect gracefully
- **Lines**: ~30
- **Exports**: connectDB, disconnectDB

#### **backend/src/config/jwt.js**
- **Purpose**: JWT token generation and verification
- **Contains**: 
  - generateToken() - Create JWT with userId and role
  - verifyToken() - Verify and decode JWT
- **Lines**: ~40
- **Exports**: JWT_SECRET, generateToken, verifyToken

### Data Models (Mongoose Schemas)

#### **backend/src/models/User.js**
- **Purpose**: User data schema and authentication methods
- **Contains**: 
  - User schema with firstName, lastName, email, password, role
  - Pre-save hook for password hashing
  - matchPassword() instance method
  - toJSON() for safe serialization
- **Lines**: ~80
- **Schema Fields**: firstName, lastName, email (unique), password (select: false), role (enum)
- **Validations**: Email format, password length, role enum

#### **backend/src/models/Quiz.js**
- **Purpose**: Quiz metadata schema
- **Contains**: 
  - Quiz schema with title, description, timeLimit, totalQuestions, marks
  - createdBy reference to User
  - isPublished boolean flag
  - Indexes for efficient queries
- **Lines**: ~60
- **Schema Fields**: title, description, instructions, createdBy, timeLimit, totalQuestions, totalMarks, passingScore, isPublished
- **Relationships**: createdBy references User

#### **backend/src/models/Question.js**
- **Purpose**: Quiz question schema with MCQ options
- **Contains**: 
  - Option sub-schema for each question
  - Question schema with questionText and 4 options
  - correctOptionIndex validation
  - Pre-save validation for option indices
- **Lines**: ~80
- **Schema Fields**: quizId, questionNumber, questionText, options (array), correctOptionIndex, marks
- **Validations**: Exactly 4 options, unique indices (0,1,2,3)

#### **backend/src/models/Result.js**
- **Purpose**: Quiz attempt and scoring results schema
- **Contains**: 
  - Detailed answer breakdown
  - Score calculations fields
  - User and quiz references
  - hasAttempted() static method
  - getSummary() instance method
- **Lines**: ~100
- **Schema Fields**: userId, quizId, score, marksObtained, timeTaken, passed, answers[], attemptedAt
- **Relationships**: userId references User, quizId references Quiz

### Middleware Functions

#### **backend/src/middlewares/auth.js**
- **Purpose**: JWT authentication middleware
- **Contains**: 
  - authenticateUser() - Verifies JWT and attaches user to request
  - Token extraction from Authorization header
  - User lookup and validation
- **Lines**: ~50
- **Exports**: authenticateUser

#### **backend/src/middlewares/authorization.js**
- **Purpose**: Role-based access control
- **Contains**: 
  - authorizeAdmin() - Restrict to ADMIN role
  - authorizeUser() - Restrict to USER role
- **Lines**: ~30
- **Exports**: authorizeAdmin, authorizeUser

#### **backend/src/middlewares/errorHandler.js**
- **Purpose**: Global error handling middleware
- **Contains**: 
  - Error formatting
  - Mongoose validation error handling
  - JWT error handling
  - Consistent error response format
- **Lines**: ~60
- **Exports**: errorHandler

### Business Logic Controllers

#### **backend/src/controllers/authController.js**
- **Purpose**: Authentication logic (register, login, get user)
- **Contains**: 
  - register() - Create new user account
  - login() - Verify credentials and generate JWT
  - getCurrentUser() - Get authenticated user data
- **Lines**: ~120
- **Key Functions**: register, login, getCurrentUser
- **Validations**: Email format, password length, duplicate email check

#### **backend/src/controllers/quizController.js**
- **Purpose**: Quiz management (CRUD + publishing)
- **Contains**: 
  - createQuiz() - Create new quiz (admin)
  - getAllQuizzes() - Get published quizzes (users)
  - getAdminQuizzes() - Get admin's quizzes (admin)
  - getQuizById() - Get quiz with questions
  - updateQuiz() - Update quiz details (admin)
  - publishQuiz() - Publish quiz (admin)
  - deleteQuiz() - Delete quiz (admin)
- **Lines**: ~200
- **Key Functions**: createQuiz, getAllQuizzes, publishQuiz, deleteQuiz

#### **backend/src/controllers/questionController.js**
- **Purpose**: Question management (add, edit, delete)
- **Contains**: 
  - addQuestion() - Add question to quiz (admin)
  - getQuestionsByQuizId() - Get all questions for quiz
  - updateQuestion() - Update question (admin)
  - deleteQuestion() - Delete question (admin)
- **Lines**: ~150
- **Key Functions**: addQuestion, updateQuestion, deleteQuestion
- **Validations**: 4 options required, unique indices

#### **backend/src/controllers/resultController.js**
- **Purpose**: Quiz submission, scoring, and results
- **Contains**: 
  - submitQuiz() - Submit attempt and calculate score
  - getResultById() - Get specific result
  - getUserAttempts() - Get user's attempt history
  - getQuizAttempts() - Get all attempts for quiz (admin)
  - getAdminStatistics() - Get dashboard stats (admin)
- **Lines**: ~250
- **Key Functions**: submitQuiz, getResultById, getUserAttempts
- **Scoring Logic**: Percentage calculation, marks distribution, pass determination

### API Routes

#### **backend/src/routes/authRoutes.js**
- **Purpose**: Authentication endpoints
- **Contains**: 
  - POST /register - Register user
  - POST /login - Login user
  - GET /me - Get current user (protected)
- **Lines**: ~30
- **Status Codes**: 200, 201, 400, 401, 404

#### **backend/src/routes/quizRoutes.js**
- **Purpose**: Quiz management endpoints
- **Contains**: 
  - User routes: GET quizzes, GET specific quiz
  - Admin routes: POST create, PUT update, PUT publish, DELETE
- **Lines**: ~40
- **Status Codes**: 200, 201, 400, 403, 404, 500

#### **backend/src/routes/questionRoutes.js**
- **Purpose**: Question management endpoints
- **Contains**: 
  - GET questions for quiz
  - POST create question (admin)
  - PUT update question (admin)
  - DELETE question (admin)
- **Lines**: ~30

#### **backend/src/routes/resultRoutes.js**
- **Purpose**: Quiz submission and results endpoints
- **Contains**: 
  - POST submit quiz
  - GET result details
  - GET user attempts
  - GET quiz attempts (admin)
  - GET statistics (admin)
- **Lines**: ~35

### Utility Modules

#### **backend/src/utils/validation.js**
- **Purpose**: Input validation schemas using Joi
- **Contains**: 
  - registerSchema - Registration validation
  - loginSchema - Login validation
  - quizSchema - Quiz creation validation
  - questionSchema - Question validation
  - submitQuizSchema - Quiz submission validation
  - validate() - Generic validation function
- **Lines**: ~150
- **Key Functions**: validate (returns { valid, errors, data })

#### **backend/src/utils/businessLogic.js**
- **Purpose**: Core business logic algorithms
- **Contains**: 
  - calculateScore() - Score percentage and marks
  - generateAnswerBreakdown() - Detailed answer analysis
  - checkPassed() - Determine pass/fail
  - formatTime() - Format seconds to readable
  - getPerformanceFeedback() - Score-based feedback message
- **Lines**: ~120
- **Key Functions**: calculateScore, generateAnswerBreakdown
- **Algorithm**: (Correct / Total) × 100 for percentage

---

## ⚛️ FRONTEND FILES

### Directory Structure
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── README.md
```

### Configuration Files

#### **frontend/package.json**
- **Purpose**: React project metadata and dependencies
- **Contains**: Scripts (start, build), dependencies (react, react-router, axios, tailwindcss)
- **Lines**: ~30

#### **frontend/.env.example**
- **Purpose**: Environment variables for frontend
- **Contains**: REACT_APP_API_URL example
- **Lines**: ~5

#### **frontend/tailwind.config.js**
- **Purpose**: Tailwind CSS configuration
- **Contains**: Custom colors, theme extensions, plugins
- **Lines**: ~20

#### **frontend/postcss.config.js**
- **Purpose**: PostCSS configuration for Tailwind
- **Contains**: Tailwind and Autoprefixer plugins
- **Lines**: ~10

#### **frontend/public/index.html**
- **Purpose**: HTML entry point
- **Contains**: Meta tags, root div for React mounting
- **Lines**: ~20

### Styling

#### **frontend/src/index.css**
- **Purpose**: Global styles and utility classes
- **Contains**: 
  - Tailwind directives (@tailwind)
  - Custom button styles (.btn, .btn-primary)
  - Card and input styles
  - Badge and alert styles
- **Lines**: ~80

### Application Root

#### **frontend/src/App.jsx**
- **Purpose**: Main React component with routing
- **Contains**: 
  - BrowserRouter setup
  - Route definitions
  - ProtectedRoute implementation
  - Auth token initialization
- **Lines**: ~70
- **Routes**: Login, Register, Quiz List, Quiz Attempt, Result

#### **frontend/src/index.js**
- **Purpose**: React application entry point
- **Contains**: ReactDOM rendering to root element
- **Lines**: ~10

### State Management

#### **frontend/src/context/AuthContext.jsx**
- **Purpose**: Global authentication state
- **Contains**: 
  - AuthContext creation
  - AuthProvider component
  - User, token, and auth methods
  - useContext hook for consumption
- **Lines**: ~80
- **Methods**: setAuth(), logout(), isAuthenticated(), isAdmin(), getAuthHeader()

### Custom Hooks

#### **frontend/src/hooks/useAuth.js**
- **Purpose**: Custom hook to access AuthContext
- **Contains**: useContext call with error handling
- **Lines**: ~20
- **Usage**: const { user, logout } = useAuth()

#### **frontend/src/hooks/useTimer.js**
- **Purpose**: Countdown timer hook for quiz
- **Contains**: 
  - useEffect for interval
  - displayTime() formatting
  - progress calculation
  - onTimeUp callback
- **Lines**: ~50
- **Returns**: { timeLeft, displayTime, progress }

### API Service Layer

#### **frontend/src/services/api.js**
- **Purpose**: Axios configuration and API methods
- **Contains**: 
  - Axios instance creation with base URL
  - setAuthToken() - Add JWT to headers
  - removeAuthToken() - Clear auth
  - All API service objects (auth, quiz, question, result)
- **Lines**: ~100
- **Services**: authService, quizService, questionService, resultService

### Reusable Components

#### **frontend/src/components/Navbar.jsx**
- **Purpose**: Navigation bar with user info
- **Contains**: App logo, user name/role, logout button
- **Lines**: ~40
- **Props**: user, onLogout

#### **frontend/src/components/Alert.jsx**
- **Purpose**: Toast notifications
- **Contains**: Error, success, info, warning types
- **Lines**: ~30
- **Props**: type, message, onClose

#### **frontend/src/components/LoadingSpinner.jsx**
- **Purpose**: Loading indicator
- **Contains**: Animated spinner with optional text
- **Lines**: ~25
- **Props**: size, text

#### **frontend/src/components/Timer.jsx**
- **Purpose**: Countdown timer display
- **Contains**: Timer display and progress bar
- **Lines**: ~25
- **Props**: displayTime, progress, isWarning

#### **frontend/src/components/ProtectedRoute.jsx**
- **Purpose**: Route protection wrapper
- **Contains**: Authentication and authorization checks
- **Lines**: ~30
- **Props**: children, adminOnly

### Page Components

#### **frontend/src/pages/LoginPage.jsx**
- **Purpose**: User login interface
- **Contains**: 
  - Email and password form
  - Form validation
  - API call to login
  - Error handling
  - Link to register
  - Demo credentials
- **Lines**: ~130
- **Features**: Remember me optional, error messages

#### **frontend/src/pages/RegisterPage.jsx**
- **Purpose**: User registration interface
- **Contains**: 
  - First name, last name, email, password form
  - Password confirmation
  - All validations
  - API call to register
  - Link to login
- **Lines**: ~150
- **Features**: Field-level error messages

#### **frontend/src/pages/QuizListPage.jsx**
- **Purpose**: Available quizzes display
- **Contains**: 
  - Quiz list from API
  - Quiz cards with details
  - Start quiz button
  - Loading and error states
- **Lines**: ~100
- **Features**: Shows time, questions count, marks

#### **frontend/src/pages/QuizAttemptPage.jsx**
- **Purpose**: Quiz taking interface
- **Contains**: 
  - Current question display
  - 4 radio button options
  - Timer with warning
  - Previous/Next navigation
  - Question navigator buttons
  - Submit button
- **Lines**: ~200
- **Features**: Auto-submit on timeout, answer persistence

#### **frontend/src/pages/ResultPage.jsx**
- **Purpose**: Quiz result display
- **Contains**: 
  - Score percentage (large display)
  - Performance feedback
  - Statistics cards
  - Pass/Fail badge
  - Answer breakdown per question
  - Action buttons
- **Lines**: ~150
- **Shows**: Correct/wrong answers, marks obtained, time taken

### Utility Modules

#### **frontend/src/utils/quizUtils.js**
- **Purpose**: Quiz-related helper functions
- **Contains**: 
  - calculatePercentage() - Calculate score percentage
  - formatTime() - Format seconds to MM:SS
  - getPerformanceFeedback() - Get feedback message and color
  - getBadgeColor() - Status-based badge color
  - validateEmail() - Email format validation
  - validatePassword() - Password strength validation
- **Lines**: ~70

#### **frontend/src/utils/errorHandler.js**
- **Purpose**: Error handling and formatting
- **Contains**: 
  - getErrorMessage() - Extract error from API response
  - formatValidationErrors() - Convert validation array to object
- **Lines**: ~30

---

## 📊 FILE STATISTICS

### Backend
- **Total Backend Files**: 20
- **Total Backend Lines**: ~1500
- **Controllers**: 4 files, ~700 lines
- **Models**: 4 files, ~250 lines
- **Routes**: 4 files, ~135 lines
- **Middleware**: 3 files, ~150 lines
- **Config**: 2 files, ~70 lines
- **Utils**: 2 files, ~270 lines

### Frontend
- **Total Frontend Files**: 25
- **Total Frontend Lines**: ~1500
- **Pages**: 5 files, ~600 lines
- **Components**: 5 files, ~200 lines
- **Config**: 5 files, ~130 lines
- **Services**: 1 file, ~100 lines
- **Hooks**: 2 files, ~70 lines
- **Utils**: 2 files, ~100 lines

### Documentation
- **Total Docs**: 8 files
- **Total Doc Lines**: ~3000
- **README**: ~300 lines
- **Interview Guide**: ~800 lines
- **Database Design**: ~500 lines
- **System Design**: ~400 lines
- **Other Guides**: ~1000 lines

### Overall Project
- **Total Files**: 48+
- **Total Lines of Code**: 3000+
- **Total Documentation**: 3000+
- **Total Project Size**: 6000+ lines

---

## 🎯 FILE ORGANIZATION PURPOSE

### Quick Navigation
- Want to understand architecture? → SYSTEM_DESIGN.md
- Want to see database schema? → DATABASE_DESIGN.md
- Need to set up? → README.md
- Preparing for interview? → INTERVIEW_PREP.md
- Want to add features? → FRONTEND_GUIDE.md
- Need to check status? → PROJECT_CHECKLIST.md

### File Dependencies
```
App.jsx
├── AuthContext.jsx (provides user state)
├── ProtectedRoute.jsx (validates access)
└── Pages (use context + API)
    ├── LoginPage (calls authService.login)
    ├── QuizListPage (calls quizService.getAllQuizzes)
    ├── QuizAttemptPage (displays quiz, calls resultService.submitQuiz)
    └── ResultPage (displays results)

Backend/server.js
├── Routes (define endpoints)
├── Controllers (handle logic)
├── Models (define schemas)
└── Middlewares (secure access)
```

---

## ✅ QUALITY ASSURANCE

Every file includes:
- ✅ Proper comments explaining purpose
- ✅ Clear function/component names
- ✅ Error handling
- ✅ Input validation
- ✅ Following conventions
- ✅ Follows DRY principle
- ✅ Well-organized code

---

**Last Updated**: January 18, 2026  
**Total Files**: 48+  
**Project Status**: ✅ COMPLETE

