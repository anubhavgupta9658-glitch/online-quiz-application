const Joi = require('joi');

/**
 * User Registration Validation Schema
 */
const registerSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters'
    }),
  lastName: Joi.string()
    .required()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required'
    }),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': 'Passwords must match',
      'string.empty': 'Confirm password is required'
    })
});

/**
 * User Login Validation Schema
 */
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required'
    })
});

/**
 * Quiz Creation Validation Schema
 */
const quizSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(5)
    .max(100)
    .messages({
      'string.empty': 'Quiz title is required',
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title cannot exceed 100 characters'
    }),
  description: Joi.string()
    .max(500)
    .messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
  instructions: Joi.string()
    .max(1000)
    .messages({
      'string.max': 'Instructions cannot exceed 1000 characters'
    }),
  timeLimit: Joi.number()
    .required()
    .min(60)
    .max(3600)
    .messages({
      'number.empty': 'Time limit is required',
      'number.min': 'Time limit must be at least 60 seconds',
      'number.max': 'Time limit cannot exceed 3600 seconds'
    }),
  totalQuestions: Joi.number()
    .required()
    .min(1)
    .max(50)
    .messages({
      'number.empty': 'Total questions is required',
      'number.min': 'Quiz must have at least 1 question',
      'number.max': 'Quiz cannot have more than 50 questions'
    }),
  totalMarks: Joi.number()
    .default(100)
    .min(1)
    .messages({
      'number.min': 'Total marks must be positive'
    }),
  passingScore: Joi.number()
    .default(40)
    .min(0)
    .max(100)
    .messages({
      'number.min': 'Passing score cannot be negative',
      'number.max': 'Passing score cannot exceed 100'
    })
});

/**
 * Question Creation Validation Schema
 */
const questionSchema = Joi.object({
  questionText: Joi.string()
    .required()
    .min(10)
    .max(1000)
    .messages({
      'string.empty': 'Question text is required',
      'string.min': 'Question must be at least 10 characters',
      'string.max': 'Question cannot exceed 1000 characters'
    }),
  options: Joi.array()
    .required()
    .length(4)
    .items(
      Joi.object({
        optionText: Joi.string().required().max(500),
        index: Joi.number().required().valid(0, 1, 2, 3)
      })
    )
    .messages({
      'array.length': 'Question must have exactly 4 options'
    }),
  correctOptionIndex: Joi.number()
    .required()
    .valid(0, 1, 2, 3)
    .messages({
      'any.only': 'Correct option must be 0, 1, 2, or 3'
    }),
  marks: Joi.number()
    .default(1)
    .min(1)
    .messages({
      'number.min': 'Marks must be positive'
    })
});

/**
 * Quiz Submission Validation Schema
 */
const submitQuizSchema = Joi.object({
  quizId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Quiz ID is required'
    }),
  answers: Joi.array()
    .required()
    .items(
      Joi.object({
        questionId: Joi.string().required(),
        selectedOptionIndex: Joi.number().allow(null).valid(0, 1, 2, 3, null)
      })
    )
    .messages({
      'array.empty': 'At least one answer is required'
    }),
  timeTaken: Joi.number()
    .required()
    .min(0)
    .messages({
      'number.min': 'Time taken cannot be negative'
    })
});

/**
 * Validate function - Returns formatted validation result
 * @param {Object} data - Data to validate
 * @param {Object} schema - Joi schema to validate against
 * @returns {Object} - { valid: boolean, error: null | string, data: object }
 */
const validate = (data, schema) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const messages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return {
      valid: false,
      errors: messages,
      data: null
    };
  }

  return {
    valid: true,
    errors: null,
    data: value
  };
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  quizSchema,
  questionSchema,
  submitQuizSchema
};
