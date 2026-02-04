const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { validate, registerSchema, loginSchema } = require('../utils/validation');
const bcrypt = require('bcrypt');
const { mockDB, getNextUserId } = require('../config/mockData');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { firstName, lastName, email, password, confirmPassword }
 */
const register = async (req, res) => {
  try {
    // Validate input
    const validation = validate(req.body, registerSchema);
    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const { firstName, lastName, email, password } = validation.data;

    // Check if user already exists (mock or DB)
    if (global.USE_MOCK_DB) {
      const normalizedEmail = email.toLowerCase().trim();
      const existingUser = mockDB.users.find(u => u.email === normalizedEmail);
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already registered. Please login or use a different email.'
        });
      }

      // Create new user in mock DB
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('✅ New user registration:');
      console.log('   Email:', normalizedEmail);
      console.log('   Password hash:', hashedPassword);
      
      const newUser = {
        _id: getNextUserId(),
        firstName,
        lastName,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'USER',
        createdAt: new Date()
      };

      mockDB.users.push(newUser);

      const token = generateToken(newUser._id, newUser.role);

      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
          user: {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role
          },
          token
        }
      });
    }

    // Original MongoDB logic
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered. Please login or use a different email.'
      });
    }

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'USER'
    });

    await user.save();
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user and generate JWT token
 * @access  Public
 * @body    { email, password }
 */
const login = async (req, res) => {
  try {
    // Validate input
    const validation = validate(req.body, loginSchema);
    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const { email, password } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Mock DB mode
    if (global.USE_MOCK_DB) {
      const user = mockDB.users.find(u => u.email === normalizedEmail);
      
      if (!user) {
        console.error('❌ Login failed: User not found with email:', normalizedEmail);
        console.log('📝 Available users:', mockDB.users.map(u => u.email));
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }

      console.log('✅ User found:', user.email);
      console.log('🔐 Checking password...');
      console.log('📝 Provided password:', password);
      
      // Handle both hashed and plain text passwords
      let isPasswordValid = false;
      try {
        // Try bcrypt comparison first (for hashed passwords)
        isPasswordValid = await bcrypt.compare(password, user.password);
      } catch (err) {
        // If bcrypt fails, try plain text comparison (fallback for legacy data)
        isPasswordValid = password === user.password;
        console.log('⚠️ Using plain text comparison (legacy password)');
      }
      
      console.log('🔐 Password valid:', isPasswordValid);
      console.log('📝 Stored password:', user.password);
      
      if (!isPasswordValid) {
        console.error('❌ Login failed: Invalid password for user:', normalizedEmail);
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }

      console.log('✅ Login successful for:', normalizedEmail);
      const token = generateToken(user._id, user.role);

      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    }

    // MongoDB mode
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await user.matchPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user data
 * @access  Private
 */
const getCurrentUser = async (req, res) => {
  try {
    if (global.USE_MOCK_DB) {
      const user = mockDB.users.find(u => u._id === req.user.userId);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user data'
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
