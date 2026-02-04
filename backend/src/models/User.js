const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * User Schema
 * Represents a user in the quiz application
 * Can be either a regular USER or ADMIN
 */
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists in the system'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['USER', 'ADMIN'],
        message: 'Role must be either USER or ADMIN'
      },
      default: 'USER'
    }
  },
  {
    timestamps: true
  }
);

// Create unique index on email
userSchema.index({ email: 1 }, { unique: true });

/**
 * Pre-save middleware: Hash password before saving
 * Only hash if password field has been modified
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method: Compare provided password with hashed password
 * Used during login verification
 * @param {String} enteredPassword - Plain text password from user input
 * @returns {Promise<Boolean>} - True if passwords match, false otherwise
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Instance method: Get user data without sensitive information
 * @returns {Object} - User data without password
 */
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
