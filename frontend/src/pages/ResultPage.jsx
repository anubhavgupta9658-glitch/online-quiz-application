import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resultService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import ResultDashboard from '../components/ResultDashboard';
import { getErrorMessage } from '../utils/errorHandler';
import { getPerformanceFeedback } from '../utils/quizUtils';

/**
 * Result Page Component
 * Display quiz results with detailed answer breakdown and performance charts
 */
const ResultPage = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResult = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await resultService.getResultById(resultId);
      setResult(response.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error fetching result:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading result..." />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert type="error" message="Result not found" />
      </div>
    );
  }

  const { feedback, color } = getPerformanceFeedback(result.scorePercentage || 0);
  // Performance feedback variables are prepared for potential future use in UI customization

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
          <p className="text-gray-600">Here's your detailed result and performance analysis</p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* Result Dashboard with Charts */}
        <ResultDashboard result={result} />

        {/* Detailed Answer Breakdown */}
        {result.answerBreakdown && result.answerBreakdown.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">📝 Detailed Answer Breakdown</h3>
            <div className="space-y-6">
              {result.answerBreakdown.map((answer, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-2">
                        Question {index + 1}
                      </p>
                      <p className="text-gray-700">
                        {answer.questionText}
                      </p>
                    </div>
                    <div className="ml-4">
                      {answer.isCorrect ? (
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                          ✓ Correct
                        </div>
                      ) : (
                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                          ✗ Wrong
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 ml-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Your answer: <span className="font-semibold text-gray-900">
                        {answer.selectedOptionIndex >= 0 && answer.options ? answer.options[answer.selectedOptionIndex] : 'Not answered'}
                      </span>
                    </p>
                    {!answer.isCorrect && (
                      <p className="text-sm text-green-600 mb-3">
                        Correct answer: <span className="font-semibold">
                          {answer.options && answer.options[answer.correctOptionIndex] ? answer.options[answer.correctOptionIndex] : 'Unknown'}
                        </span>
                      </p>
                    )}

                    <div className="bg-gray-50 rounded p-3 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 mb-2">ALL OPTIONS:</p>
                      <ul className="space-y-1">
                        {answer.options && answer.options.map((option, optionIndex) => (
                          <li key={optionIndex} className={`text-sm ${
                            optionIndex === answer.correctOptionIndex ? 'text-green-600 font-semibold' : 
                            optionIndex === answer.selectedOptionIndex && !answer.isCorrect ? 'text-red-600 font-semibold' : 
                            'text-gray-700'
                          }`}>
                            <span className="font-semibold">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                            {optionIndex === answer.correctOptionIndex && ' ✓'}
                            {optionIndex === answer.selectedOptionIndex && !answer.isCorrect && ' ✗'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => navigate('/quizzes')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Take Another Quiz
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
