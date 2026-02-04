/**
 * Business Logic Utilities
 * Contains core scoring and result calculation logic
 */

/**
 * Calculate quiz score and performance metrics
 * @param {Array} answers - User's answers [{ selectedOptionIndex }, ...]
 * @param {Array} questions - Quiz questions with correctOptionIndex
 * @param {Number} totalMarks - Total marks in quiz
 * @returns {Object} - Score metrics
 */
const calculateScore = (answers, questions, totalMarks) => {
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;
  let marksObtained = 0;

  const marksPerQuestion = totalMarks / questions.length;

  answers.forEach((answer, index) => {
    const question = questions[index];
    
    if (answer.selectedOptionIndex === null || answer.selectedOptionIndex === undefined) {
      // Question was skipped
      skippedCount++;
    } else if (answer.selectedOptionIndex === question.correctOptionIndex) {
      // Correct answer
      correctCount++;
      marksObtained += marksPerQuestion;
    } else {
      // Wrong answer
      wrongCount++;
    }
  });

  const percentage = (marksObtained / totalMarks) * 100;

  return {
    correctAnswers: correctCount,
    wrongAnswers: wrongCount,
    skippedAnswers: skippedCount,
    marksObtained: Math.round(marksObtained * 100) / 100, // Round to 2 decimals
    score: Math.round(percentage * 100) / 100 // Percentage
  };
};

/**
 * Generate detailed answer breakdown for result
 * @param {Array} answers - User's answers
 * @param {Array} questions - Quiz questions with options
 * @param {Number} totalMarks - Total marks in quiz
 * @returns {Array} - Detailed answer objects
 */
const generateAnswerBreakdown = (answers, questions, totalMarks) => {
  const marksPerQuestion = totalMarks / questions.length;

  return answers.map((answer, index) => {
    const question = questions[index];
    const selectedIndex = answer.selectedOptionIndex;
    const correctIndex = question.correctOptionIndex;
    const isCorrect = selectedIndex === correctIndex;

    return {
      questionId: question._id,
      questionText: question.questionText,
      selectedOptionIndex: selectedIndex,
      correctOptionIndex: correctIndex,
      isCorrect,
      marksAwarded: isCorrect ? marksPerQuestion : 0
    };
  });
};

/**
 * Check if user passed the quiz
 * @param {Number} score - Score percentage (0-100)
 * @param {Number} passingScore - Passing threshold (0-100)
 * @returns {Boolean} - True if score >= passingScore
 */
const checkPassed = (score, passingScore) => {
  return score >= passingScore;
};

/**
 * Format time in seconds to readable format
 * @param {Number} seconds - Time in seconds
 * @returns {String} - Formatted time (e.g., "10m 30s")
 */
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  
  return `${minutes}m ${remainingSeconds}s`;
};

/**
 * Get performance feedback based on score
 * @param {Number} score - Score percentage
 * @returns {String} - Feedback message
 */
const getPerformanceFeedback = (score) => {
  if (score >= 90) return 'Excellent! Outstanding performance! 🌟';
  if (score >= 80) return 'Great! Very good performance! ✅';
  if (score >= 70) return 'Good! You performed well. 👍';
  if (score >= 60) return 'Fair! Need some improvement. 📚';
  if (score >= 40) return 'You can do better. Keep practicing! 💪';
  return 'Need more preparation. Better luck next time! 🎯';
};

module.exports = {
  calculateScore,
  generateAnswerBreakdown,
  checkPassed,
  formatTime,
  getPerformanceFeedback
};
