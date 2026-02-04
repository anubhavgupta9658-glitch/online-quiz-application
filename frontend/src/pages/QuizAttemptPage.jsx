import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTimer } from '../hooks/useTimer';
import { quizService, resultService } from '../services/api';
import Timer from '../components/Timer';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Quiz Attempt Page Component
 * Main quiz taking interface with timer and navigation
 */
const QuizAttemptPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  // Remove unused 'user' variable
  // const { user } = useAuth();

  // State management
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [answered, setAnswered] = useState(new Set());

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await quizService.getQuizById(quizId);
      setQuiz(response.data.data);
      setQuestions(response.data.data.questions || []);
      setAnswers({});
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      setError(null);

      // Prepare answer array with correct format
      const userAnswers = questions.map((question, index) => ({
        questionId: question._id,
        selectedOptionIndex: answers[index] !== undefined ? answers[index] : null
      }));

      const payload = {
        quizId,
        answers: userAnswers,
        timeTaken: quiz.timeLimit - timeLeft,
      };

      const response = await resultService.submitQuiz(payload);
      
      // Navigate to result page
      navigate(`/result/${response.data.data._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error submitting quiz:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeUp = async () => {
    await submitQuiz();
  };

  // Timer hook - starts automatically when quiz loads
  const { timeLeft, displayTime, progress } = useTimer(
    quiz?.timeLimit || 600, // Default to 600 seconds if quiz not loaded yet
    quiz !== null, // Only activate timer when quiz is loaded
    handleTimeUp
  );

  useEffect(() => {
    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const handleAnswerChange = (optionIndex) => {
    const newAnswers = { ...answers };
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
    
    const newAnswered = new Set(answered);
    newAnswered.add(currentQuestionIndex);
    setAnswered(newAnswered);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading quiz..." />
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert type="error" message="Quiz not found or has no questions" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with Timer */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600 mt-1">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
            <Timer displayTime={displayTime} progress={progress} />
          </div>
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Question Text */}
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQuestion.questionText}
              </h2>

              {/* Options */}
              <div className="space-y-4 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={index}
                      checked={answers[currentQuestionIndex] === index}
                      onChange={() => handleAnswerChange(index)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="ml-3 text-gray-900">{option}</span>
                  </label>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-900 font-semibold rounded-lg transition-colors"
                >
                  Previous
                </button>

                <div className="flex gap-4">
                  {currentQuestionIndex === questions.length - 1 ? (
                    <button
                      onClick={submitQuiz}
                      disabled={submitting}
                      className="px-8 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
                    >
                      {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Question Navigator Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
              <div className="grid grid-cols-4 lg:grid-cols-4 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`w-full aspect-square rounded-lg font-semibold transition-colors ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600 text-white'
                        : answered.has(index)
                        ? 'bg-green-200 text-green-900 hover:bg-green-300'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 text-sm">
                <p className="text-gray-600 mb-2">
                  Answered: <span className="font-semibold text-gray-900">{answered.size}/{questions.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptPage;
