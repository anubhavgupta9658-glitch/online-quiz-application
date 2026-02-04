const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const { validate, questionSchema } = require('../utils/validation');
const { mockDB, getNextQuestionId } = require('../config/mockData');

/**
 * @route   POST /api/questions
 * @desc    Add a question to a quiz (Admin only)
 * @access  Private (Admin)
 */
const addQuestion = async (req, res) => {
  try {
    const { quizId } = req.body;

    if (global.USE_MOCK_DB) {
      // Check if quiz exists
      const quiz = mockDB.quizzes.find(q => q._id === quizId);
      
      if (!quiz) {
        return res.status(404).json({
          status: 'error',
          message: 'Quiz not found'
        });
      }

      // Check authorization
      if (quiz.createdBy !== req.user.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to add questions to this quiz'
        });
      }

      // Prevent adding questions to published quizzes
      if (quiz.isPublished) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot add questions to a published quiz'
        });
      }

      // Validate input
      const validation = validate(req.body, questionSchema);
      if (!validation.valid) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      // Check current question count
      const currentCount = mockDB.questions.filter(q => q.quizId === quizId).length;
      if (currentCount >= quiz.totalQuestions) {
        return res.status(400).json({
          status: 'error',
          message: `Quiz already has ${quiz.totalQuestions} questions`
        });
      }

      // Calculate marks per question to ensure total = totalMarks
      const marksPerQuestion = quiz.totalMarks / quiz.totalQuestions;

      // Create question
      const question = {
        _id: getNextQuestionId(),
        quizId,
        questionNumber: currentCount + 1,
        questionText: validation.data.questionText,
        options: validation.data.options,
        correctOptionIndex: validation.data.correctOptionIndex,
        marks: marksPerQuestion,
        createdAt: new Date()
      };

      mockDB.questions.push(question);

      return res.status(201).json({
        status: 'success',
        message: 'Question added successfully',
        data: question
      });
    }

    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return res.status(404).json({
        status: 'error',
        message: 'Quiz not found'
      });
    }

    // Check authorization
    if (quiz.createdBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to add questions to this quiz'
      });
    }

    // Prevent adding questions to published quizzes
    if (quiz.isPublished) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot add questions to a published quiz'
      });
    }

    // Validate input
    const validation = validate(req.body, questionSchema);
    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Check current question count
    const currentCount = await Question.countDocuments({ quizId });
    if (currentCount >= quiz.totalQuestions) {
      return res.status(400).json({
        status: 'error',
        message: `Quiz already has ${quiz.totalQuestions} questions`
      });
    }

    // Calculate marks per question to ensure total = totalMarks
    const marksPerQuestion = quiz.totalMarks / quiz.totalQuestions;

    // Create question
    const question = new Question({
      quizId,
      questionNumber: currentCount + 1,
      questionText: validation.data.questionText,
      options: validation.data.options,
      correctOptionIndex: validation.data.correctOptionIndex,
      marks: marksPerQuestion
    });

    await question.save();

    res.status(201).json({
      status: 'success',
      message: 'Question added successfully',
      data: question
    });
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add question',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/questions/:quizId
 * @desc    Get all questions for a quiz
 * @access  Private
 */
const getQuestionsByQuizId = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (global.USE_MOCK_DB) {
      const quiz = mockDB.quizzes.find(q => q._id === quizId);
      
      if (!quiz) {
        return res.status(404).json({
          status: 'error',
          message: 'Quiz not found'
        });
      }

      // Check if user has access to this quiz
      if (!quiz.isPublished && quiz.createdBy !== req.user.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }

      const questions = mockDB.questions
        .filter(q => q.quizId === quizId)
        .sort((a, b) => a.questionNumber - b.questionNumber);

      return res.status(200).json({
        status: 'success',
        count: questions.length,
        data: questions
      });
    }

    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return res.status(404).json({
        status: 'error',
        message: 'Quiz not found'
      });
    }

    // Check if user has access to this quiz
    if (!quiz.isPublished && quiz.createdBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const questions = await Question.find({ quizId })
      .sort({ questionNumber: 1 });

    res.status(200).json({
      status: 'success',
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch questions'
    });
  }
};

/**
 * @route   PUT /api/questions/:id
 * @desc    Update a question (Admin only)
 * @access  Private (Admin)
 */
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    
    if (!question) {
      return res.status(404).json({
        status: 'error',
        message: 'Question not found'
      });
    }

    // Check if quiz is published
    const quiz = await Quiz.findById(question.quizId);
    if (quiz.isPublished) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot update question in a published quiz'
      });
    }

    // Check authorization
    if (quiz.createdBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this question'
      });
    }

    // Validate input
    const validation = validate(req.body, questionSchema);
    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Update question
    question.questionText = validation.data.questionText;
    question.options = validation.data.options;
    question.correctOptionIndex = validation.data.correctOptionIndex;
    
    await question.save();

    res.status(200).json({
      status: 'success',
      message: 'Question updated successfully',
      data: question
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update question'
    });
  }
};

/**
 * @route   DELETE /api/questions/:id
 * @desc    Delete a question (Admin only)
 * @access  Private (Admin)
 */
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    
    if (!question) {
      return res.status(404).json({
        status: 'error',
        message: 'Question not found'
      });
    }

    // Check if quiz is published
    const quiz = await Quiz.findById(question.quizId);
    if (quiz.isPublished) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete question from a published quiz'
      });
    }

    // Check authorization
    if (quiz.createdBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this question'
      });
    }

    await Question.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete question'
    });
  }
};

module.exports = {
  addQuestion,
  getQuestionsByQuizId,
  updateQuestion,
  deleteQuestion
};
