const mongoose = require('mongoose');

/**
 * Quiz Schema
 * Represents a quiz that can be taken by users
 * Created and managed by admin users
 */
const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      trim: true
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      trim: true
    },
    instructions: {
      type: String,
      maxlength: [1000, 'Instructions cannot exceed 1000 characters'],
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Quiz creator (admin) is required']
    },
    timeLimit: {
      type: Number, // in seconds
      required: [true, 'Time limit is required'],
      min: [60, 'Time limit must be at least 60 seconds (1 minute)'],
      max: [3600, 'Time limit cannot exceed 3600 seconds (1 hour)']
    },
    totalQuestions: {
      type: Number,
      required: [true, 'Total questions count is required'],
      min: [1, 'Quiz must have at least 1 question'],
      max: [50, 'Quiz cannot have more than 50 questions']
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      default: 100,
      min: [1, 'Total marks must be positive']
    },
    passingScore: {
      type: Number,
      required: [true, 'Passing score is required'],
      default: 40,
      min: [0, 'Passing score cannot be negative'],
      max: [100, 'Passing score cannot exceed 100']
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient queries
quizSchema.index({ isPublished: 1 });
quizSchema.index({ createdBy: 1 });
quizSchema.index({ createdAt: -1 });

/**
 * Virtual field: Get full name of quiz creator
 * Populated using populate() method
 */
quizSchema.virtual('creator', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Quiz', quizSchema);
