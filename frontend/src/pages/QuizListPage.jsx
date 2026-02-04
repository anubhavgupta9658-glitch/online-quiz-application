import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { quizService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Quiz List Page Component
 * Display available quizzes for users
 */
const QuizListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await quizService.getAllQuizzes();
      setQuizzes(response.data.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading quizzes..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Quizzes</h1>
          <p className="text-gray-600">Select a quiz to start attempting</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* No Quizzes */}
        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              {quizzes.length === 0 ? 'No quizzes available yet.' : 'No quizzes match your search.'}
            </p>
          </div>
        )}

        {/* Quiz Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              {/* Quiz Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h2>

              {/* Quiz Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {quiz.description}
              </p>

              {/* Quiz Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Questions</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {quiz.totalQuestions || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time Limit</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {Math.floor((quiz.timeLimit || 0) / 60)} min
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Marks</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {quiz.totalMarks || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passing Score</p>
                  <p className="text-lg font-semibold text-green-600">
                    {quiz.passingScore || 0}%
                  </p>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={() => handleStartQuiz(quiz._id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizListPage;
