# 🏗️ ONLINE QUIZ APPLICATION - SYSTEM DESIGN & ARCHITECTURE

## 1. HIGH-LEVEL SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (React)                       │
├─────────────────────────────────────────────────────────────────┤
│  Login/Register    Quiz List    Quiz Attempt    Admin Dashboard │
│       Pages         Page            Page               Page      │
├─────────────────────────────────────────────────────────────────┤
│                      API GATEWAY (Axios)                         │
│                    ↕ HTTP REST Calls ↕                          │
├─────────────────────────────────────────────────────────────────┤
│                   BACKEND LAYER (Node.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  Routes   →   Controllers   →   Services   →   Models           │
│  (MVC Architecture)                                              │
├─────────────────────────────────────────────────────────────────┤
│  Middleware: JWT Auth, Role Verification, Error Handling        │
├─────────────────────────────────────────────────────────────────┤
│                  DATABASE LAYER (MongoDB)                        │
├─────────────────────────────────────────────────────────────────┤
│  Users  →  Quizzes  →  Questions  →  Results                   │
│              (One-to-Many relationships)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. DATA FLOW DIAGRAM

### **Authentication Flow**
```
User Registration
    ↓
Validate Input → Hash Password → Create User in DB → Return JWT Token
    ↓
User Login
    ↓
Validate Email/Password → Compare Hash → Generate JWT → Return Token
    ↓
Store Token in localStorage (Frontend)
    ↓
Include Token in Authorization Header for All Protected Routes
```

### **Quiz Attempt Flow**
```
User Clicks "Start Quiz"
    ↓
Frontend Fetches Quiz Questions from API
    ↓
Timer Starts (Frontend Countdown)
    ↓
User Selects Answers → Frontend Stores in State
    ↓
User Submits Quiz
    ↓
Backend Validates Submission
    ↓
Calculate Score (Compare with Correct Answers)
    ↓
Create Result Record in DB
    ↓
Return Score & Correct Answers to Frontend
    ↓
Display Result Summary to User
```

### **Admin Quiz Management Flow**
```
Admin Login
    ↓
Role-Based Check (Must be ADMIN)
    ↓
Access Admin Dashboard
    ↓
Create/Edit/Delete Quiz (with questions)
    ↓
Backend Validates and Saves to DB
    ↓
View All User Attempts & Scores
```

---

## 3. COMPONENT INTERACTION

### **Frontend Components**
- **Auth Components**: LoginPage, RegisterPage
- **User Components**: QuizListPage, QuizAttemptPage, ResultPage
- **Admin Components**: AdminDashboard, CreateQuiz, ManageQuestions
- **Shared Components**: Navbar, Timer, Button, Modal, Alert

### **Backend Endpoints**

#### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

#### **Quiz Management (Admin)**
- `POST /api/quizzes` - Create quiz (ADMIN only)
- `PUT /api/quizzes/:id` - Edit quiz (ADMIN only)
- `DELETE /api/quizzes/:id` - Delete quiz (ADMIN only)
- `POST /api/questions` - Add question to quiz (ADMIN only)

#### **Quiz Participation (User)**
- `GET /api/quizzes` - Get all available quizzes
- `GET /api/quizzes/:id` - Get quiz details (before attempt)
- `POST /api/attempts` - Submit quiz attempt
- `GET /api/results/:attemptId` - Get result details

#### **Admin Dashboard**
- `GET /api/admin/attempts` - View all user attempts (ADMIN only)
- `GET /api/admin/statistics` - Get quiz statistics (ADMIN only)

---

## 4. DATABASE RELATIONSHIPS

```
Users (1) ──────→ (Many) Quizzes
  ├─ id
  ├─ email
  ├─ password
  ├─ role (USER/ADMIN)
  └─ createdAt

         Quizzes (1) ──────→ (Many) Questions
           ├─ id
           ├─ title
           ├─ description
           ├─ timeLimit (in seconds)
           ├─ createdBy (User ID)
           ├─ createdAt
           └─ updatedAt

                Questions (1) ──────→ (Many) Options
                  ├─ id
                  ├─ quizId (Quiz ID)
                  ├─ questionText
                  ├─ correctOptionIndex
                  └─ createdAt

Users (1) ──────→ (Many) Results
  ├─ id
  ├─ userId (User ID)
  ├─ quizId (Quiz ID)
  ├─ score
  ├─ totalQuestions
  ├─ attemptedAt
  ├─ answers (Array of user selections)
  └─ createdAt
```

---

## 5. SECURITY ARCHITECTURE

### **Authentication & Authorization**
- **JWT Tokens**: 
  - Generated on login
  - Valid for 24 hours
  - Refreshed on re-login
  - Stored in localStorage (Frontend)
  
- **Role-Based Access Control**:
  - `USER`: Can only attempt quizzes, view own results
  - `ADMIN`: Can create/edit/delete quizzes, view all results
  - Verified in middleware on protected routes

### **Data Protection**
- Passwords hashed with bcrypt (salt rounds: 10)
- Sensitive data never logged
- CORS enabled for frontend only
- Input validation on all endpoints
- SQL injection prevention (using Mongoose)

---

## 6. BUSINESS LOGIC OVERVIEW

### **Timer Logic**
```javascript
// Frontend-based countdown timer
const [timeLeft, setTimeLeft] = useState(timeLimit);

useEffect(() => {
  if (timeLeft <= 0) {
    autoSubmitQuiz(); // Auto-submit if time expires
    return;
  }
  
  const timer = setInterval(() => {
    setTimeLeft(prev => prev - 1);
  }, 1000);
  
  return () => clearInterval(timer);
}, [timeLeft]);
```

### **Score Calculation Logic**
```javascript
// Backend calculates score
const score = userAnswers.reduce((total, answer, index) => {
  const question = quiz.questions[index];
  if (answer === question.correctOptionIndex) {
    return total + (100 / quiz.questions.length);
  }
  return total;
}, 0);
```

### **Result Generation Logic**
```javascript
// Create result with detailed breakdown
const result = {
  userId,
  quizId,
  score: calculatedScore,
  totalQuestions: quiz.questions.length,
  correctAnswers: correctCount,
  wrongAnswers: wrongCount,
  timeTaken: timeLimit - timeRemaining,
  answers: userAnswers,
  attemptedAt: new Date()
};
```

---

## 7. STATE MANAGEMENT STRATEGY

### **Frontend**
- **Context API** for global auth state (user, token, role)
- **Component State** (useState) for quiz attempt data
- **localStorage** for token persistence
- **Custom Hooks** for reusable logic (useTimer, useAuth, useQuiz)

### **Backend**
- **Express Session**: Optional (using JWT instead)
- **MongoDB Sessions**: For transactions if needed
- **In-Memory Cache**: For frequently accessed quizzes (optional)

---

## 8. ERROR HANDLING STRATEGY

### **Frontend**
- Try-catch blocks for API calls
- User-friendly error messages
- Toast notifications for errors
- Fallback UI when data fails to load

### **Backend**
- Custom error middleware
- Specific HTTP status codes (400, 401, 403, 404, 500)
- Detailed error logs (without exposing sensitive data)
- Validation errors returned as structured JSON

### **Common Errors**
```javascript
{
  "status": 400,
  "message": "Invalid input",
  "errors": [
    { "field": "email", "error": "Invalid email format" }
  ]
}
```

---

## 9. SCALABILITY & PERFORMANCE CONSIDERATIONS

1. **Database Indexing**
   - Index on `userId` in Results collection
   - Index on `quizId` in Questions collection
   - Index on `email` in Users collection (unique)

2. **Query Optimization**
   - Use `.select()` to fetch only needed fields
   - Implement pagination for quiz lists
   - Cache quiz data if frequently accessed

3. **Frontend Performance**
   - Code splitting and lazy loading
   - Memoization for expensive components
   - Debouncing for input fields

4. **Backend Performance**
   - Connection pooling
   - Async operations (non-blocking)
   - Rate limiting on API endpoints

---

## 10. DEPLOYMENT ARCHITECTURE

```
┌──────────────────┐
│  GitHub/Git      │  (Version Control)
│  Repository      │
└────────┬─────────┘
         │
┌────────▼─────────┐
│  CI/CD Pipeline  │  (GitHub Actions/GitLab CI)
└────────┬─────────┘
         │
┌────────▼────────────────┐
│  Deployment Services    │
├────────────────────────┤
│  Frontend: Vercel/Netlify
│  Backend: Heroku/Railway
│  Database: MongoDB Atlas
└────────────────────────┘
```

---

## 11. TECH STACK SUMMARY

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Tailwind CSS | UI/UX |
| **State Management** | Context API | Global state |
| **Backend** | Node.js + Express | API Server |
| **Architecture** | MVC | Code Organization |
| **Database** | MongoDB + Mongoose | Data Storage |
| **Authentication** | JWT + bcrypt | Security |
| **API Communication** | Axios + REST | Client-Server |
| **Validation** | Joi/Validator | Input validation |
| **Environment** | dotenv | Config management |

---

## 12. INTERVIEW TALKING POINTS

✅ **Monolithic Architecture** - Simple and suitable for mini projects  
✅ **JWT Authentication** - Stateless, scalable auth method  
✅ **MVC Pattern** - Clean separation of concerns  
✅ **Real-time Timer** - Frontend-based for better UX  
✅ **Role-Based Access** - Secure access control  
✅ **RESTful API** - Standard API design  
✅ **MongoDB** - Flexible, document-based storage  

---

**Next Step**: Database Design & Schemas
