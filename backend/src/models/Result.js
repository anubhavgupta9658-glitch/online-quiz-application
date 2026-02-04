const mongoose = require('mongoose');

/**
 * Result Schema
 * Represents a user's quiz attempt and their score
 * Stores all answers and performance metrics
 */
const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Quiz ID is required']
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100']
    },
    totalQuestions: {
      type: Number,
      required: [true, 'Total questions count is required'],
      min: [1]
    },
    correctAnswers: {
      type: Number,
      required: [true, 'Correct answers count is required'],
      min: [0]
    },
    wrongAnswers: {
      type: Number,
      required: [true, 'Wrong answers count is required'],
      min: [0]
    },
    skippedAnswers: {
      type: Number,
      default: 0,
      min: [0]
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      min: [1]
    },
    marksObtained: {
      type: Number,
      required: [true, 'Marks obtained is required'],
      min: [0]
    },
    timeTaken: {
      type: Number, // in seconds
      required: [true, 'Time taken is required'],
      min: [0]
    },
    passed: {
      type: Boolean,
      required: true
    },
    // Detailed answer breakdown
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        questionText: String,
        selectedOptionIndex: {
          type: Number,
          enum: [null, 0, 1, 2, 3], // null for skipped
        },
        correctOptionIndex: Number,
        isCorrect: Boolean,
        marksAwarded: Number
      }
    ],
    attemptedAt: {
      type: Date,
      default: Date.now
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient querying
resultSchema.index({ userId: 1 });
resultSchema.index({ quizId: 1 });
resultSchema.index({ userId: 1, quizId: 1 });
resultSchema.index({ createdAt: -1 });

/**
 * Static method: Prevent multiple attempts for same user on same quiz
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} quizId - Quiz ID
 * @returns {Promise<Boolean>} - True if user has already attempted
 */
resultSchema.statics.hasAttempted = async function(userId, quizId) {
  const result = await this.findOne({ userId, quizId });
  return !!result;
};

/**
 * Instance method: Get result summary
 * @returns {Object} - Formatted result summary
 */
resultSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    quiz: this.quizId,
    score: this.score,
    correctAnswers: this.correctAnswers,
    wrongAnswers: this.wrongAnswers,
    totalQuestions: this.totalQuestions,
    marksObtained: this.marksObtained,
    totalMarks: this.totalMarks,
    passed: this.passed,
    timeTaken: this.timeTaken,
    submittedAt: this.submittedAt
  };
};

module.exports = mongoose.model('Result', resultSchema);
