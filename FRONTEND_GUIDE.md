# 🎯 FRONTEND COMPLETE GUIDE & REMAINING COMPONENTS

This document contains all remaining frontend components and the main App setup.

## PAGES TO CREATE

### 1. QuizListPage (for Users)
**File**: `src/pages/QuizListPage.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { quizService } = require('../services/api');
import { useAuth } from '../hooks/useAuth';

const QuizListPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizService.getAllQuizzes();
      setQuizzes(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={() => { logout(); navigate('/login'); }} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Available Quizzes</h1>
        <p className="text-gray-600 mb-8">Choose a quiz to test your knowledge</p>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {loading ? (
          <LoadingSpinner text="Loading quizzes..." />
        ) : quizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No quizzes available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(quiz => (
              <div key={quiz._id} className="card hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>⏱️ Time: {quiz.timeLimit / 60} minutes</p>
                  <p>❓ Questions: {quiz.totalQuestions}</p>
                  <p>📊 Total Marks: {quiz.totalMarks}</p>
                </div>

                <button
                  onClick={() => handleStartQuiz(quiz._id)}
                  className="btn-primary w-full"
                >
                  Start Quiz →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizListPage;
```

---

### 2. QuizAttemptPage (Quiz Taking Interface)
**File**: `src/pages/QuizAttemptPage.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Timer from '../components/Timer';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { useTimer } from '../hooks/useTimer';
import { quizService, resultService } = require('../services/api');
import { useAuth } from '../hooks/useAuth';

const QuizAttemptPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { timeLeft, displayTime, progress } = useTimer(
    quiz?.timeLimit || 0,
    true,
    handleTimeUp
  );

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const response = await quizService.getQuizById(quizId);
      setQuiz(response.data.data.quiz);
      setQuestions(response.data.data.questions);
    } catch (err) {
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  function handleTimeUp() {
    handleSubmit();
  }

  const handleAnswerSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Prepare answers in order
      const submissionAnswers = questions.map((_, index) => ({
        questionId: questions[index]._id,
        selectedOptionIndex: answers[index] !== undefined ? answers[index] : null
      }));

      const response = await resultService.submitQuiz({
        quizId,
        answers: submissionAnswers,
        timeTaken: quiz.timeLimit - timeLeft
      });

      // Navigate to result page
      navigate(`/result/${response.data.data.result._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!quiz || !questions.length) return <Alert type="error" message={error} />;

  const currentQuestion = questions[currentQIndex];
  const isAnswered = answers[currentQIndex] !== undefined;
  const isWarning = timeLeft < 300; // Less than 5 minutes

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{quiz.title}</h2>
            </div>
            <div className="flex justify-center">
              <Timer displayTime={displayTime} progress={progress} isWarning={isWarning} />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Question {currentQIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {/* Question */}
        <div className="card mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQuestion.questionText}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <label key={option.index} className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition hover:bg-blue-50" style={{
                borderColor: answers[currentQIndex] === option.index ? '#3B82F6' : '#E5E7EB'
              }}>
                <input
                  type="radio"
                  name="option"
                  value={option.index}
                  checked={answers[currentQIndex] === option.index}
                  onChange={() => handleAnswerSelect(option.index)}
                  className="w-4 h-4"
                />
                <span className="ml-4 text-gray-800">{option.optionText}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentQIndex === 0}
            className="btn-secondary disabled:opacity-50"
          >
            ← Previous
          </button>

          {currentQIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="btn-primary"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-3">Quick Navigation:</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQIndex(index)}
                className={`w-10 h-10 rounded font-semibold text-sm transition ${
                  index === currentQIndex
                    ? 'bg-blue-600 text-white'
                    : answers[index] !== undefined
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptPage;
```

---

### 3. ResultPage (Result Display)
**File**: `src/pages/ResultPage.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { resultService } = require('../services/api');
import { useAuth } from '../hooks/useAuth';
import { getPerformanceFeedback, formatTime } from '../utils/quizUtils';

const ResultPage = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const response = await resultService.getResultById(resultId);
      setResult(response.data.data.result);
    } catch (err) {
      setError('Failed to fetch result');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const feedback = getPerformanceFeedback(result.score);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={() => { logout(); navigate('/login'); }} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Score Summary */}
        <div className="card mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>
          
          <div className="inline-block mb-6">
            <div className="text-6xl font-bold" style={{ color: result.passed ? '#10B981' : '#EF4444' }}>
              {result.score.toFixed(1)}%
            </div>
          </div>

          <p className={`text-xl font-semibold mb-4 ${feedback.color}`}>
            {feedback.message}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Correct Answers</p>
              <p className="text-2xl font-bold text-green-600">{result.correctAnswers}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Wrong Answers</p>
              <p className="text-2xl font-bold text-red-600">{result.wrongAnswers}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Marks Obtained</p>
              <p className="text-2xl font-bold text-blue-600">{result.marksObtained}/{result.totalMarks}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Time Taken</p>
              <p className="text-2xl font-bold">{formatTime(result.timeTaken)}</p>
            </div>
          </div>

          {/* Status */}
          <div className={`inline-block px-6 py-3 rounded-lg font-semibold text-white ${result.passed ? 'bg-green-600' : 'bg-red-600'}`}>
            {result.passed ? '✅ PASSED' : '❌ FAILED'}
          </div>
        </div>

        {/* Answer Breakdown */}
        <div className="card mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Answer Breakdown</h3>
          
          <div className="space-y-4">
            {result.answers.map((answer, index) => (
              <div key={index} className="border-l-4 pl-4 py-2" style={{
                borderColor: answer.isCorrect ? '#10B981' : '#EF4444'
              }}>
                <p className="font-semibold text-gray-800 mb-2">
                  Q{index + 1}: {answer.questionText}
                </p>
                <div className="text-sm space-y-1">
                  <p className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    ✓ Correct Answer: Option {answer.correctOptionIndex + 1}
                  </p>
                  {!answer.isCorrect && answer.selectedOptionIndex !== null && (
                    <p className="text-red-600">
                      ✗ Your Answer: Option {answer.selectedOptionIndex + 1}
                    </p>
                  )}
                  {answer.selectedOptionIndex === null && (
                    <p className="text-yellow-600">⊘ Not Attempted</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary flex-1"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/quizzes')}
            className="btn-secondary flex-1"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
```

---

### 4. AdminDashboard Page
**File**: `src/pages/AdminDashboard.jsx` (Summary - see detailed guide)

Main Features:
- View statistics
- List all created quizzes
- Create new quiz
- Edit/Delete quizzes
- Publish quizzes
- View student attempts

---

## MAIN APP COMPONENT

**File**: `src/App.jsx`

```javascript
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuizListPage from './pages/QuizListPage';
import QuizAttemptPage from './pages/QuizAttemptPage';
import ResultPage from './pages/ResultPage';
import AdminDashboard from './pages/AdminDashboard';

// Services
import { setAuthToken, removeAuthToken } from './services/api';
import { useAuth } from './hooks/useAuth';

function AppRoutes() {
  const { token, user } = useAuth();

  // Set auth token whenever it changes
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    } else {
      removeAuthToken();
    }
  }, [token]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <QuizListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quizzes"
        element={
          <ProtectedRoute>
            <QuizListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:quizId"
        element={
          <ProtectedRoute>
            <QuizAttemptPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/result/:resultId"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirect */}
      <Route path="/" element={<Navigate to={token ? (user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard') : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
```

---

## INDEX.JSX (Entry Point)

**File**: `src/index.js`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## PUBLIC/INDEX.HTML

**File**: `public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuizHub - Online Quiz Application</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

---

## .ENV.EXAMPLE (Frontend)

**File**: `.env.example`

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ADMIN DASHBOARD FEATURES (To Implement)

The AdminDashboard should include:

1. **Statistics Card**
   - Total Quizzes
   - Total Attempts
   - Total Users
   - Average Score
   - Pass Percentage

2. **Quiz Management**
   - List all quizzes
   - Create new quiz
   - Edit quiz details
   - Add/Edit/Delete questions
   - Publish quiz
   - Delete quiz

3. **Student Attempts**
   - View all attempts for each quiz
   - Performance breakdown
   - Individual result details

4. **Export/Analytics** (Optional)
   - Export results as CSV
   - Charts and graphs

---

**Next Steps After Frontend**:
1. Complete AdminDashboard implementation
2. Complete README with setup instructions
3. Interview preparation guide
4. Testing and deployment

