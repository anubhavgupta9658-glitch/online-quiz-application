# Result Dashboard - Visual Structure Guide

## 📊 Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Quiz Completed!                                                │
│  Here's your detailed result and performance analysis           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [85% Score]        [85/100 Marks]        [PASSED ✓]          │
│                                                                 │
│             PERFORMANCE OVERVIEW                               │
│                 (Gradient Background)                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────┐
│                          │                          │
│  ANSWER DISTRIBUTION     │  QUESTION-WISE PERF.    │
│                          │                          │
│      [Pie Chart]         │      [Bar Chart]        │
│                          │                          │
│  • Correct: 8            │  Q1 Q2 Q3 Q4 Q5        │
│  • Wrong: 2              │  ██ ██ ░░ ██ ██        │
│  • Unanswered: 0         │                          │
└──────────────────────────┴──────────────────────────┘

┌──────────────────────────┬──────────────────────────┐
│                          │                          │
│  SCORE ANALYSIS          │  TIME MANAGEMENT        │
│                          │                          │
│  ██ Marks Obtained: 85   │  • Time Used: 8:30     │
│  ░░ Total Marks: 100     │  • Time Limit: 10:00   │
│                          │  • Time Saved: 1:30    │
│  [Bar Chart]             │  [Bar Chart]           │
└──────────────────────────┴──────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  SUMMARY STATISTICS                                             │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │    ✓     │  │    ✗     │  │    ?     │  │    T     │       │
│  │ Correct  │  │  Wrong   │  │Unanswer. │  │  Total   │       │
│  │    8     │  │    2     │  │    0     │  │   10     │       │
│  │  80%     │  │  20%     │  │   0%     │  │  100%    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  📝 DETAILED ANSWER BREAKDOWN                                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Question 1                              [✓ Correct]     │   │
│  │ What is the output of this code?                        │   │
│  │ Your answer: Option A                                  │   │
│  │ ALL OPTIONS:                                            │   │
│  │ A. Option A ✓   B. Option B   C. Option C  D. Option D │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Question 2                              [✗ Wrong]       │   │
│  │ What is the correct syntax?                             │   │
│  │ Your answer: Option B                                  │   │
│  │ Correct answer: Option C                               │   │
│  │ ALL OPTIONS:                                            │   │
│  │ A. Option A   B. Option B   C. Option C ✓  D. Option D │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  [Take Another Quiz]              [Go to Dashboard]         │
└──────────────────────────────────────────────────────────────┘
```

## 🎨 Color Coding System

| Element | Color | Meaning |
|---------|-------|---------|
| Correct Answers | 🟢 Green (#10b981) | Correctly answered questions |
| Wrong Answers | 🔴 Red (#ef4444) | Incorrectly answered questions |
| Unanswered | 🟠 Orange (#f59e0b) | Questions not attempted |
| Score/Total | 🔵 Blue (#3b82f6) | Main metrics and charts |
| Background | ⚪ Light Gray (#f9fafb) | Page background |
| Cards | ⚪ White | Section containers |

## 📱 Responsive Behavior

### Desktop (1024px+)
```
┌─────────────────────────────────────────────────────┐
│  Performance Overview (Full Width)                   │
├──────────────────────┬──────────────────────────────┤
│  Chart 1 (50%)       │  Chart 2 (50%)               │
├──────────────────────┼──────────────────────────────┤
│  Chart 3 (50%)       │  Chart 4 (50%)               │
├──────────────────────┴──────────────────────────────┤
│  Summary Statistics (Full Width)                     │
└─────────────────────────────────────────────────────┘
```

### Tablet (768px - 1023px)
```
┌─────────────────────────────────────┐
│  Performance Overview (Full Width)  │
├──────────────────────┬──────────────┤
│  Chart 1             │  Chart 2     │
├──────────────────────┼──────────────┤
│  Chart 3             │  Chart 4     │
├──────────────────────┴──────────────┤
│  Summary Stats (Full Width)         │
└─────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌────────────────────────────┐
│  Performance Overview      │
├────────────────────────────┤
│  Chart 1 (Full Width)      │
├────────────────────────────┤
│  Chart 2 (Full Width)      │
├────────────────────────────┤
│  Chart 3 (Full Width)      │
├────────────────────────────┤
│  Chart 4 (Full Width)      │
├────────────────────────────┤
│  Stat Card 1 (Full Width)  │
├────────────────────────────┤
│  Stat Card 2 (Full Width)  │
├────────────────────────────┤
│  Stat Card 3 (Full Width)  │
├────────────────────────────┤
│  Stat Card 4 (Full Width)  │
└────────────────────────────┘
```

## 🔄 Data Flow

```
Quiz Completion
       ↓
Result Data Collected:
  - obtainedMarks
  - totalMarks
  - correctAnswers
  - wrongAnswers
  - timeTaken
  - answerBreakdown[]
       ↓
Result Page (/result/:resultId)
       ↓
ResultDashboard Component
       ↓
┌────────────────────────────────────┐
│  Data Processing                   │
│  ├─ Calculate percentages          │
│  ├─ Format time (MM:SS)            │
│  ├─ Prepare chart data             │
│  └─ Calculate statistics           │
└────────────────────────────────────┘
       ↓
┌────────────────────────────────────┐
│  Render Charts                     │
│  ├─ PieChart (Answer Distribution) │
│  ├─ BarChart (Question Performance)│
│  ├─ BarChart (Score Analysis)      │
│  ├─ BarChart (Time Management)     │
│  └─ StatCards (Summary)            │
└────────────────────────────────────┘
```

## 💡 Interactive Features

### Hover Effects
- **Chart Sections**: Subtle shadow increase and border color change
- **Stat Cards**: Slight background color change
- **Answer Cards**: Border highlight and shadow effect

### Tooltips
- All charts display detailed information on hover
- Custom tooltip styling for consistency
- Shows exact values and percentages

### Animations
- **Page Load**: Staggered slide-in animations for each section (0s - 0.5s)
- **Smooth Transitions**: 0.3s ease timing on all interactive elements

## 📊 Chart Specifications

### Pie Chart (Answer Distribution)
- **Data Points**: Correct, Wrong, Unanswered
- **Outer Radius**: 80px
- **Label Format**: Name: Count
- **Color Scheme**: Green, Red, Gray

### Bar Charts
- **X-Axis**: Categories (Questions or Score Types)
- **Y-Axis**: Numeric values (Marks or Counts)
- **Bar Radius**: 8px (rounded corners)
- **Color Scheme**: Primary blue for main data

### Summary Cards
- **Layout**: 4-column grid (responsive to 1 column on mobile)
- **Icon Size**: 50px diameter circles
- **Typography**: Hierarchical (label, number, percentage)

## 🎯 Key Metrics Displayed

1. **Overall Performance**
   - Score percentage
   - Marks obtained/total
   - Pass/Fail status

2. **Question Analysis**
   - Correct count and percentage
   - Wrong count and percentage
   - Unanswered count and percentage
   - Total questions

3. **Time Analysis**
   - Time used (MM:SS)
   - Time limit (MM:SS)
   - Time saved (MM:SS)

4. **Detailed Breakdown**
   - Individual question review
   - User's answer
   - Correct answer (if wrong)
   - All options displayed

