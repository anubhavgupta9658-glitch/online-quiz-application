const mongoose = require('mongoose');

/**
 * Question Schema
 * Represents a multiple choice question in a quiz
 * Each question has 4 options and 1 correct answer
 */

// Option sub-schema
const optionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  optionText: {
    type: String,
    required: [true, 'Option text is required'],
    maxlength: [500, 'Option cannot exceed 500 characters'],
    trim: true
  },
  index: {
    type: Number,
    required: true,
    enum: {
      values: [0, 1, 2, 3],
      message: 'Option index must be 0, 1, 2, or 3'
    }
  }
});

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Quiz ID is required']
    },
    questionNumber: {
      type: Number,
      required: [true, 'Question number is required'],
      min: [1, 'Question number must be positive']
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      maxlength: [1000, 'Question text cannot exceed 1000 characters'],
      trim: true
    },
    options: {
      type: [optionSchema],
      validate: {
        validator: function(v) {
          return v && v.length === 4;
        },
        message: 'Question must have exactly 4 options'
      },
      required: [true, 'Options are required']
    },
    correctOptionIndex: {
      type: Number,
      required: [true, 'Correct answer index is required'],
      enum: {
        values: [0, 1, 2, 3],
        message: 'Correct option index must be 0, 1, 2, or 3'
      }
    },
    marks: {
      type: Number,
      required: [true, 'Marks for this question is required'],
      min: [1, 'Marks must be positive'],
      default: 1
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient querying of questions by quiz
questionSchema.index({ quizId: 1, questionNumber: 1 });

/**
 * Pre-save: Ensure options have unique indices
 */
questionSchema.pre('save', function(next) {
  if (this.options) {
    const indices = this.options.map(opt => opt.index);
    const uniqueIndices = new Set(indices);
    
    if (uniqueIndices.size !== 4) {
      return next(new Error('Options must have unique indices (0, 1, 2, 3)'));
    }
  }
  next();
});

module.exports = mongoose.model('Question', questionSchema);
