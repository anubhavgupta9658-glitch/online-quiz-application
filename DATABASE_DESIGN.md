# 📊 MONGODB DATABASE DESIGN & SCHEMAS

## 1. USER SCHEMA (Users Collection)

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, lowercase),
  password: String (hashed with bcrypt),
  role: String (enum: ["USER", "ADMIN"]),
  createdAt: Date,
  updatedAt: Date
}
```

### **Validation Rules**
- Email: Must be valid email format, unique
- Password: Minimum 6 characters
- Role: Default is "USER", can be "ADMIN"
- firstName & lastName: Required, max 50 characters

### **Indexes**
```javascript
db.users.createIndex({ email: 1 }, { unique: true });
```

---

## 2. QUIZ SCHEMA (Quizzes Collection)

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  instructions: String,
  createdBy: ObjectId (Reference to User),
  timeLimit: Number (in seconds),
  totalQuestions: Number,
  totalMarks: Number,
  passingScore: Number,
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Validation Rules**
- title: Required, max 100 characters
- description: Optional, max 500 characters
- timeLimit: Minimum 60 seconds
- totalMarks: Usually 100
- passingScore: Less than totalMarks
- createdBy: Must be valid User ID with ADMIN role
- isPublished: Only published quizzes visible to users

### **Indexes**
```javascript
db.quizzes.createIndex({ createdBy: 1 });
db.quizzes.createIndex({ isPublished: 1 });
```

---

## 3. QUESTION SCHEMA (Questions Collection)

```javascript
{
  _id: ObjectId,
  quizId: ObjectId (Reference to Quiz),
  questionNumber: Number (1, 2, 3, ...),
  questionText: String,
  options: [
    {
      _id: ObjectId,
      optionText: String,
      index: Number (0, 1, 2, 3)
    }
  ],
  correctOptionIndex: Number (0, 1, 2, or 3),
  marks: Number (marks for this question),
  createdAt: Date,
  updatedAt: Date
}
```

### **Validation Rules**
- questionText: Required, max 500 characters
- options: Exactly 4 options required
- correctOptionIndex: 0-3 (valid option index)
- marks: Positive number, sum across all questions = totalMarks
- quizId: Must reference existing Quiz

### **Indexes**
```javascript
db.questions.createIndex({ quizId: 1 });
```

---

## 4. RESULT/ATTEMPT SCHEMA (Results Collection)

```javascript
{
  _id: ObjectId,
  userId: ObjectId (Reference to User),
  quizId: ObjectId (Reference to Quiz),
  score: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  wrongAnswers: Number,
  totalMarks: Number,
  marksObtained: Number,
  timeTaken: Number (in seconds),
  passed: Boolean,
  answers: [
    {
      questionId: ObjectId,
      selectedOptionIndex: Number,
      correctOptionIndex: Number,
      isCorrect: Boolean
    }
  ],
  attemptedAt: Date,
  submittedAt: Date,
  createdAt: Date
}
```

### **Validation Rules**
- userId & quizId: Must be valid IDs
- score: 0-100 percentage
- marksObtained: 0 to totalMarks
- answers array: Length must equal totalQuestions
- timeTaken: Less than or equal to quiz timeLimit
- passed: (marksObtained / totalMarks) >= passingScore threshold

### **Indexes**
```javascript
db.results.createIndex({ userId: 1 });
db.results.createIndex({ quizId: 1 });
db.results.createIndex({ userId: 1, quizId: 1 });
```

---

## 5. RELATIONSHIPS EXPLAINED

### **One-to-Many Relationship**

#### **User → Quizzes**
- One user (admin) can create many quizzes
- Referenced by `createdBy` field in Quiz

#### **Quiz → Questions**
- One quiz contains multiple questions
- Referenced by `quizId` field in Question

#### **User → Results**
- One user can have multiple quiz attempts (results)
- Referenced by `userId` field in Result

#### **Quiz → Results**
- One quiz can be attempted by multiple users
- Referenced by `quizId` field in Result

### **Data Relationship Diagram**
```
Users (1) ──createdBy──→ (Many) Quizzes
           
Users (1) ──userId──→ (Many) Results ←─quizId─ (Many) Quizzes
                        ↓
                     Contains
                        ↓
                  Questions (answered by user)
```

---

## 6. COMPLETE MONGOOSE SCHEMA CODE

### **User Model** (`models/User.js`)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
      unique: [true, 'Email already exists'],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: {
        values: ['USER', 'ADMIN'],
        message: 'Role must be USER or ADMIN'
      },
      default: 'USER'
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
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

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

### **Quiz Model** (`models/Quiz.js`)
```javascript
const mongoose = require('mongoose');

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
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    instructions: {
      type: String,
      maxlength: [1000, 'Instructions cannot exceed 1000 characters']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Quiz creator is required']
    },
    timeLimit: {
      type: Number,
      required: [true, 'Time limit is required'],
      min: [60, 'Time limit must be at least 60 seconds']
    },
    totalQuestions: {
      type: Number,
      required: [true, 'Total questions count is required'],
      min: [1, 'Quiz must have at least 1 question']
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      default: 100
    },
    passingScore: {
      type: Number,
      required: [true, 'Passing score is required'],
      default: 40
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

// Index for filtering published quizzes
quizSchema.index({ isPublished: 1 });
quizSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
```

---

### **Question Model** (`models/Question.js`)
```javascript
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  optionText: {
    type: String,
    required: [true, 'Option text is required'],
    maxlength: [500, 'Option cannot exceed 500 characters']
  },
  index: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3]
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
      maxlength: [1000, 'Question cannot exceed 1000 characters']
    },
    options: {
      type: [optionSchema],
      validate: {
        validator: function(v) {
          return v.length === 4;
        },
        message: 'Question must have exactly 4 options'
      },
      required: [true, 'Options are required']
    },
    correctOptionIndex: {
      type: Number,
      required: [true, 'Correct answer is required'],
      enum: {
        values: [0, 1, 2, 3],
        message: 'Correct option must be 0, 1, 2, or 3'
      }
    },
    marks: {
      type: Number,
      required: [true, 'Marks is required'],
      min: [1, 'Marks must be positive'],
      default: 1
    }
  },
  {
    timestamps: true
  }
);

// Index for fetching questions by quiz
questionSchema.index({ quizId: 1 });

module.exports = mongoose.model('Question', questionSchema);
```

---

### **Result Model** (`models/Result.js`)
```javascript
const mongoose = require('mongoose');

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
      required: [true, 'Total questions is required']
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
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required']
    },
    marksObtained: {
      type: Number,
      required: [true, 'Marks obtained is required'],
      min: [0]
    },
    timeTaken: {
      type: Number,
      required: [true, 'Time taken is required'],
      min: [0]
    },
    passed: {
      type: Boolean,
      required: true
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOptionIndex: Number,
        correctOptionIndex: Number,
        isCorrect: Boolean
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

module.exports = mongoose.model('Result', resultSchema);
```

---

## 7. DATA VALIDATION LOGIC

### **Quiz Creation Validation**
```javascript
// Backend validation
- Title: required, 10-100 characters
- Description: optional, max 500 characters
- TimeLimit: minimum 60 seconds, maximum 3600 seconds (1 hour)
- TotalQuestions: minimum 1, maximum 50
- CreatedBy: must be authenticated ADMIN
```

### **Question Validation**
```javascript
- QuestionText: required, 10-500 characters
- Options: exactly 4 required
- CorrectOptionIndex: 0-3
- Marks: positive number, sum = quiz totalMarks
- No duplicate options
```

### **Result Validation**
```javascript
- User must exist
- Quiz must exist and be published
- Number of answers = Total questions
- Each answer: valid option index (0-3)
- TimeTaken <= Quiz timeLimit
- Only 1 result per user per quiz (optional but preferred)
```

---

## 8. QUERY EXAMPLES

### **Fetch All Published Quizzes**
```javascript
await Quiz.find({ isPublished: true })
  .select('title description timeLimit totalQuestions')
  .lean();
```

### **Fetch Quiz with All Questions**
```javascript
await Quiz.findById(quizId)
  .populate('createdBy', 'firstName lastName')
  .lean();

const questions = await Question.find({ quizId })
  .sort({ questionNumber: 1 })
  .lean();
```

### **Fetch User Results**
```javascript
await Result.find({ userId })
  .populate('quizId', 'title totalMarks passingScore')
  .sort({ createdAt: -1 })
  .limit(10);
```

### **Fetch Quiz Statistics (Admin)**
```javascript
await Result.aggregate([
  { $match: { quizId: quizId } },
  { $group: {
    _id: null,
    totalAttempts: { $sum: 1 },
    averageScore: { $avg: '$score' },
    passedCount: { $sum: { $cond: ['$passed', 1, 0] } }
  }}
]);
```

---

## 9. INTERVIEW EXPLANATION

**"How are your collections related?"**

> "We have a **one-to-many relationship** between Users and Quizzes (admin creates many quizzes), between Quizzes and Questions (quiz has many questions), and between Users and Results (user takes many quizzes). We use MongoDB references (`ObjectId`) to maintain these relationships. For performance, we've added indexes on frequently queried fields like `userId`, `quizId`, and `createdBy`. This design is normalized to avoid data duplication and maintain data integrity."

---

**Next Step**: Backend Project Setup

