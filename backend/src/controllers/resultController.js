const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { validate, submitQuizSchema } = require('../utils/validation');
const { calculateScore, generateAnswerBreakdown, checkPassed, getPerformanceFeedback } = require('../utils/businessLogic');
const { mockDB, getNextResultId } = require('../config/mockData');

/**
 * @route   POST /api/results/submit
 * @desc    Submit quiz attempt and calculate score
 * @access  Private
 * @body    { quizId, answers, timeTaken }
 */
const submitQuiz = async (req, res) => {
  try {
    // Validate input
    const validation = validate(req.body, submitQuizSchema);
    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const { quizId, answers, timeTaken } = validation.data;

    if (global.USE_MOCK_DB) {
      // Check if quiz exists
      const quiz = mockDB.quizzes.find(q => q._id === quizId);
      if (!quiz) {
        return res.status(404).json({
          status: 'error',
          message: 'Quiz not found'
        });
      }

      // Check if quiz is published
      if (!quiz.isPublished) {
        return res.status(403).json({
          status: 'error',
          message: 'This quiz is not available'
        });
      }

      // Check if user has already attempted
      const existingAttempt = mockDB.results.find(r => r.userId === req.user.userId && r.quizId === quizId);
      if (existingAttempt) {
        return res.status(400).json({
          status: 'error',
          message: 'You have already attempted this quiz. Multiple attempts are not allowed.'
        });
      }

      // Get questions for this quiz
      const quizQuestions = mockDB.questions.filter(q => q.quizId === quizId);

      // Calculate score
      let correctAnswers = 0;
      const answerBreakdown = [];

      quizQuestions.forEach((question) => {
        const userAnswer = answers.find(a => a.questionId === question._id);
        const isCorrect = userAnswer && userAnswer.selectedOptionIndex === question.correctOptionIndex;

        if (isCorrect) correctAnswers++;

        answerBreakdown.push({
          questionId: question._id,
          questionNumber: question.questionNumber,
          questionText: question.questionText,
          selectedOptionIndex: userAnswer ? userAnswer.selectedOptionIndex : -1,
          correctOptionIndex: question.correctOptionIndex,
          isCorrect,
          marks: question.marks || 1,
          options: question.options
        });
      });

      const totalMarks = quizQuestions.reduce((sum, q) => sum + (q.marks || 1), 0);
      const obtainedMarks = answerBreakdown.reduce((sum, ans) => sum + (ans.isCorrect ? (ans.marks || 1) : 0), 0);
      const scorePercentage = ((obtainedMarks / totalMarks) * 100).toFixed(2);
      const passed = scorePercentage >= (quiz.passingScore || 50);

      // Create result
      const result = {
        _id: getNextResultId(),
        userId: req.user.userId,
        quizId: quizId,
        quizTitle: quiz.title,
        totalQuestions: quizQuestions.length,
        attemptedQuestions: answers.length,
        correctAnswers,
        wrongAnswers: answers.length - correctAnswers,
        totalMarks,
        obtainedMarks,
        scorePercentage: parseFloat(scorePercentage),
        timeTaken,
        passed,
        feedback: passed ? 'Great job! You passed!' : 'Keep practicing!',
        answerBreakdown,
        attemptDate: new Date(),
        createdAt: new Date()
      };

      mockDB.results.push(result);

      return res.status(201).json({
        status: 'success',
        message: 'Quiz submitted successfully',
        data: result
      });
    }

    // MongoDB mode
    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        status: 'error',
        message: 'Quiz not found'
      });
    }

    // Check if quiz is published
    if (!quiz.isPublished) {
      return res.status(403).json({
        status: 'error',
        message: 'This quiz is not available'
      });
    }

    // Check if user has already attempted
    const existingAttempt = await Result.findOne({ userId: req.user.userId, quizId });
    if (existingAttempt) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already attempted this quiz. Multiple attempts are not allowed.'
      });
    }

    // Fetch all questions
    const questions = await Question.find({ quizId })
      .sort({ questionNumber: 1 });

    if (questions.length !== quiz.totalQuestions) {
      return res.status(400).json({
        status: 'error',
        message: 'Quiz configuration error'
      });
    }

    // Validate number of answers matches number of questions
    if (answers.length !== questions.length) {
      return res.status(400).json({
        status: 'error',
        message: `Expected ${questions.length} answers, received ${answers.length}`
      });
    }

    // Calculate score
    const scoreMetrics = calculateScore(answers, questions, quiz.totalMarks);

    // Check if passed
    const passed = checkPassed(scoreMetrics.score, quiz.passingScore);

    // Generate detailed answer breakdown
    const answerBreakdown = generateAnswerBreakdown(answers, questions, quiz.totalMarks);

    // Create result record
    const result = new Result({
      userId: req.user.userId,
      quizId,
      score: scoreMetrics.score,
      totalQuestions: questions.length,
      correctAnswers: scoreMetrics.correctAnswers,
      wrongAnswers: scoreMetrics.wrongAnswers,
      skippedAnswers: scoreMetrics.skippedAnswers,
      totalMarks: quiz.totalMarks,
      marksObtained: scoreMetrics.marksObtained,
      timeTaken,
      passed,
      answers: answerBreakdown,
      attemptedAt: new Date(),
      submittedAt: new Date()
    });

    await result.save();

    // Prepare response
    const feedback = getPerformanceFeedback(scoreMetrics.score);

    res.status(201).json({
      status: 'success',
      message: 'Quiz submitted successfully',
      data: {
        result: {
          _id: result._id,
          score: result.score,
          marksObtained: result.marksObtained,
          totalMarks: result.totalMarks,
          passed: result.passed,
          correctAnswers: result.correctAnswers,
          wrongAnswers: result.wrongAnswers,
          skippedAnswers: result.skippedAnswers,
          totalQuestions: result.totalQuestions,
          timeTaken: result.timeTaken,
          feedback
        }
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit quiz',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/results/:resultId
 * @desc    Get detailed result of a quiz attempt
 * @access  Private
 */
const getResultById = async (req, res) => {
  try {
    const { resultId } = req.params;

    if (global.USE_MOCK_DB) {
      const result = mockDB.results.find(r => r._id === resultId);
      if (!result) {
        return res.status(404).json({
          status: 'error',
          message: 'Result not found'
        });
      }

      // Check authorization
      if (result.userId !== req.user.userId && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to view this result'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: result
      });
    }

    const result = await Result.findById(resultId)
      .populate('userId', 'firstName lastName email')
      .populate('quizId', 'title totalMarks passingScore');

    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'Result not found'
      });
    }

    // Check authorization: User can only view their own results
    if (result.userId._id.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this result'
      });
    }

    const feedback = getPerformanceFeedback(result.score);

    res.status(200).json({
      status: 'success',
      data: {
        result,
        feedback
      }
    });
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch result'
    });
  }
};

/**
 * @route   GET /api/results/user/attempts
 * @desc    Get all quiz attempts of logged-in user
 * @access  Private
 */
const getUserAttempts = async (req, res) => {
  try {
    if (global.USE_MOCK_DB) {
      const results = mockDB.results.filter(r => r.userId === req.user.userId);

      return res.status(200).json({
        status: 'success',
        count: results.length,
        data: results
      });
    }

    const results = await Result.find({ userId: req.user.userId })
      .populate('quizId', 'title totalMarks passingScore')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      status: 'success',
      count: results.length,
      data: results.map(result => ({
        _id: result._id,
        quiz: result.quizId,
        score: result.score,
        marksObtained: result.marksObtained,
        totalMarks: result.totalMarks,
        passed: result.passed,
        timeTaken: result.timeTaken,
        correctAnswers: result.correctAnswers,
        wrongAnswers: result.wrongAnswers,
        submittedAt: result.submittedAt
      }))
    });
  } catch (error) {
    console.error('Get user attempts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch attempts'
    });
  }
};

/**
 * @route   GET /api/results/quiz/:quizId
 * @desc    Get all attempts for a quiz (Admin only)
 * @access  Private (Admin)
 */
const getQuizAttempts = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Check if quiz exists and belongs to admin
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        status: 'error',
        message: 'Quiz not found'
      });
    }

    if (quiz.createdBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view attempts for this quiz'
      });
    }

    const results = await Result.find({ quizId })
      .populate('userId', 'firstName lastName email')
      .sort({ submittedAt: -1 });

    // Calculate statistics
    const totalAttempts = results.length;
    const passedCount = results.filter(r => r.passed).length;
    const failedCount = totalAttempts - passedCount;
    const averageScore = totalAttempts > 0 
      ? (results.reduce((sum, r) => sum + r.score, 0) / totalAttempts).toFixed(2)
      : 0;

    res.status(200).json({
      status: 'success',
      statistics: {
        totalAttempts,
        passedCount,
        failedCount,
        passPercentage: totalAttempts > 0 ? ((passedCount / totalAttempts) * 100).toFixed(2) + '%' : '0%',
        averageScore
      },
      data: results.map(result => ({
        _id: result._id,
        user: result.userId,
        score: result.score,
        marksObtained: result.marksObtained,
        passed: result.passed,
        timeTaken: result.timeTaken,
        submittedAt: result.submittedAt
      }))
    });
  } catch (error) {
    console.error('Get quiz attempts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch quiz attempts'
    });
  }
};

/**
 * @route   GET /api/admin/statistics
 * @desc    Get overall statistics for admin dashboard
 * @access  Private (Admin)
 */
const getAdminStatistics = async (req, res) => {
  try {
    // Get all quizzes created by admin
    const adminQuizzes = await Quiz.find({ createdBy: req.user.userId });
    const quizIds = adminQuizzes.map(q => q._id);

    // Get all results for admin's quizzes
    const results = await Result.find({ quizId: { $in: quizIds } });

    // Calculate statistics
    const totalQuizzes = adminQuizzes.length;
    const totalAttempts = results.length;
    const totalUsers = new Set(results.map(r => r.userId.toString())).size;
    const averageScore = totalAttempts > 0
      ? (results.reduce((sum, r) => sum + r.score, 0) / totalAttempts).toFixed(2)
      : 0;
    const passedCount = results.filter(r => r.passed).length;
    const passPercentage = totalAttempts > 0
      ? ((passedCount / totalAttempts) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      status: 'success',
      data: {
        totalQuizzes,
        totalAttempts,
        totalUsers,
        averageScore,
        passPercentage: passPercentage + '%'
      }
    });
  } catch (error) {
    console.error('Get admin statistics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch statistics'
    });
  }
};

module.exports = {
  submitQuiz,
  getResultById,
  getUserAttempts,
  getQuizAttempts,
  getAdminStatistics
};
