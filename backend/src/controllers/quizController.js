const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { validate, quizSchema } = require('../utils/validation');
const { mockDB, getNextQuizId } = require('../config/mockData');

/**
 * @route   GET /api/quizzes
 * @desc    Get all published quizzes
 * @access  Public
 */
const getAllQuizzes = async (req, res) => {
  try {
    if (global.USE_MOCK_DB) {
      const quizzes = mockDB.quizzes.filter(q => q.isPublished);
      const quizzesWithQuestions = quizzes.map(quiz => ({
        ...quiz,
        questions: mockDB.questions.filter(q => q.quizId === quiz._id)
      }));
      return res.status(200).json({
        status: 'success',
        data: quizzesWithQuestions
      });
    }

    const quizzes = await Quiz.find({ isPublished: true })
      .populate('questions')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch quizzes',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/quizzes/:id
 * @desc    Get quiz by ID with questions
 * @access  Public
 */
const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.USE_MOCK_DB) {
      const quiz = mockDB.quizzes.find(q => q._id === id);
      if (!quiz) {
        return res.status(404).json({
          status: 'error',
          message: 'Quiz not found'
        });
      }

      const questions = mockDB.questions
        .filter(q => q.quizId === id)
        .map(({ _id, quizId, questionNumber, questionText, options, marks }) => ({
          _id, quizId, questionNumber, questionText, options, marks
        }));

      return res.status(200).json({
        status: 'success',
        data: {
          ...quiz,
          questions
        }
      });
    }

    const quiz = await Quiz.findById(id).populate('questions');

    if (!quiz) {
      return res.status(404).json({
        status: 'error',
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch quiz',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/quizzes
 * @desc    Create quiz (Admin)
 * @access  Private
 */
const createQuiz = async (req, res) => {
  try {
    const validation = validate(req.body, quizSchema);
    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const { title, description, timeLimit, totalQuestions, totalMarks, passingScore } = validation.data;

    if (global.USE_MOCK_DB) {
      const newQuiz = {
        _id: getNextQuizId(),
        title,
        description,
        createdBy: req.user.userId,
        timeLimit,
        totalQuestions,
        totalMarks,
        passingScore,
        isPublished: false,
        createdAt: new Date()
      };
      mockDB.quizzes.push(newQuiz);
      return res.status(201).json({
        status: 'success',
        message: 'Quiz created',
        data: newQuiz
      });
    }

    const quiz = new Quiz({
      title, description, timeLimit, totalQuestions, totalMarks, passingScore,
      createdBy: req.user.userId,
      isPublished: false
    });

    await quiz.save();
    res.status(201).json({
      status: 'success',
      message: 'Quiz created',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create quiz',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/quizzes/:id/publish
 * @desc    Publish a quiz
 * @access  Private
 */
const publishQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.USE_MOCK_DB) {
      const quiz = mockDB.quizzes.find(q => q._id === id);
      if (!quiz) {
        return res.status(404).json({
          status: 'error',
          message: 'Quiz not found'
        });
      }

      quiz.isPublished = true;
      return res.status(200).json({
        status: 'success',
        message: 'Quiz published',
        data: quiz
      });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({
        status: 'error',
        message: 'Quiz not found'
      });
    }

    quiz.isPublished = true;
    await quiz.save();
    res.status(200).json({
      status: 'success',
      message: 'Quiz published',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to publish quiz',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/quizzes/:id
 * @desc    Update quiz details
 * @access  Private (Admin)
 */
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, timeLimit, totalMarks, passingScore } = req.body;

    if (global.USE_MOCK_DB) {
      const quiz = mockDB.quizzes.find(q => q._id === id && q.createdBy === req.user.userId);
      if (!quiz) {
        return res.status(404).json({
          status: 'error',
          message: 'Quiz not found or not authorized'
        });
      }

      // Update quiz fields
      if (title) quiz.title = title;
      if (description) quiz.description = description;
      if (timeLimit) quiz.timeLimit = timeLimit;
      if (totalMarks) quiz.totalMarks = totalMarks;
      if (passingScore) quiz.passingScore = passingScore;

      return res.status(200).json({
        status: 'success',
        message: 'Quiz updated successfully',
        data: quiz
      });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({
        status: 'error',
        message: 'Quiz not found'
      });
    }

    if (quiz.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this quiz'
      });
    }

    if (title) quiz.title = title;
    if (description) quiz.description = description;
    if (timeLimit) quiz.timeLimit = timeLimit;
    if (totalMarks) quiz.totalMarks = totalMarks;
    if (passingScore) quiz.passingScore = passingScore;

    await quiz.save();

    res.status(200).json({
      status: 'success',
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update quiz',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/quizzes/:id
 * @desc    Delete a quiz
 * @access  Private
 */
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.USE_MOCK_DB) {
      const index = mockDB.quizzes.findIndex(q => q._id === id);
      if (index === -1) {
        return res.status(404).json({
          status: 'error',
          message: 'Quiz not found'
        });
      }

      mockDB.quizzes.splice(index, 1);
      mockDB.questions = mockDB.questions.filter(q => q.quizId !== id);
      return res.status(200).json({
        status: 'success',
        message: 'Quiz deleted'
      });
    }

    await Question.deleteMany({ quizId: id });
    await Quiz.findByIdAndDelete(id);
    res.status(200).json({
      status: 'success',
      message: 'Quiz deleted'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete quiz',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/quizzes/admin/all
 * @desc    Get admin quizzes
 * @access  Private
 */
const getAdminQuizzes = async (req, res) => {
  try {
    if (global.USE_MOCK_DB) {
      const quizzes = mockDB.quizzes.filter(q => q.createdBy === req.user.userId);
      return res.status(200).json({
        status: 'success',
        data: quizzes
      });
    }

    const quizzes = await Quiz.find({ createdBy: req.user.userId });
    res.status(200).json({
      status: 'success',
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch quizzes',
      error: error.message
    });
  }
};

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  publishQuiz,
  deleteQuiz,
  getAdminQuizzes
};
