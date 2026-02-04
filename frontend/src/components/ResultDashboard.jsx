import React from 'react';
import {
  BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import '../styles/dashboard.css';

/**
 * ResultDashboard Component
 * Display quiz results with interactive charts and performance metrics
 */
const ResultDashboard = ({ result }) => {
  if (!result) return null;

  // Prepare data for charts
  const performanceData = [
    { name: 'Correct', value: result.correctAnswers, fill: '#10b981' },
    { name: 'Wrong', value: result.wrongAnswers, fill: '#ef4444' },
    { name: 'Unanswered', value: (result.totalQuestions || 0) - result.correctAnswers - result.wrongAnswers, fill: '#9ca3af' }
  ];

  const scoreData = [
    {
      category: 'Score',
      obtained: result.obtainedMarks,
      total: result.totalMarks,
      percentage: result.scorePercentage
    }
  ];

  const questionPerformance = result.answerBreakdown?.map((answer, index) => ({
    question: `Q${index + 1}`,
    status: answer.isCorrect ? 10 : 0,
    marks: answer.isCorrect ? (result.totalMarks / (result.totalQuestions || 1)) : 0
  })) || [];

  const timeData = [
    { name: 'Time Used', value: result.timeTaken || 0, fill: '#3b82f6' },
    { name: 'Time Left', value: Math.max(0, (result.timeLimit || 600) - (result.timeTaken || 0)), fill: '#e5e7eb' }
  ];

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      return (
        <div className="tooltip-box">
          <p className="tooltip-text">{payload[0].name}: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="result-dashboard">
      {/* Main Score Section */}
      <div className="dashboard-section score-section">
        <h2 className="dashboard-title">Performance Overview</h2>
        <div className="score-display">
          <div className="score-percentage">
            <div className="percentage-value">{Math.round(result.scorePercentage)}%</div>
            <div className="percentage-label">Score</div>
          </div>
          <div className="score-metrics">
            <div className="metric">
              <span className="metric-label">Total Marks</span>
              <span className="metric-value">{result.obtainedMarks}/{result.totalMarks}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Status</span>
              <span className={`metric-value ${result.passed ? 'passed' : 'failed'}`}>
                {result.passed ? '✓ PASSED' : '✗ FAILED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pie Chart - Answer Distribution */}
      <div className="dashboard-section chart-section">
        <h3 className="chart-title">Answer Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={performanceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {performanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="chart-legend">
          {performanceData.map((item, index) => (
            <div key={index} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: item.fill }}></span>
              <span className="legend-label">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart - Question-wise Performance */}
      {questionPerformance.length > 0 && (
        <div className="dashboard-section chart-section">
          <h3 className="chart-title">Question-wise Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={questionPerformance} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="question" />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="tooltip-box">
                        <p className="tooltip-text">{data.question}</p>
                        <p className="tooltip-text" style={{ color: data.marks > 0 ? '#10b981' : '#ef4444' }}>
                          {data.marks > 0 ? '✓ Correct' : '✗ Wrong'}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="marks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Score Breakdown Bar Chart */}
      <div className="dashboard-section chart-section">
        <h3 className="chart-title">Score Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip content={customTooltip} />
            <Legend />
            <Bar dataKey="obtained" name="Marks Obtained" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="total" name="Total Marks" fill="#dbeafe" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Time Management Chart */}
      <div className="dashboard-section chart-section">
        <h3 className="chart-title">Time Management</h3>
        <div className="time-stats">
          <div className="time-stat">
            <span className="time-label">Time Used</span>
            <span className="time-value">
              {Math.floor(result.timeTaken / 60)}:{String(result.timeTaken % 60).padStart(2, '0')}
            </span>
          </div>
          <div className="time-stat">
            <span className="time-label">Time Limit</span>
            <span className="time-value">
              {Math.floor((result.timeLimit || 600) / 60)}:{String((result.timeLimit || 600) % 60).padStart(2, '0')}
            </span>
          </div>
          <div className="time-stat">
            <span className="time-label">Time Saved</span>
            <span className="time-value">
              {Math.floor(Math.max(0, ((result.timeLimit || 600) - result.timeTaken) / 60))}:{String(Math.max(0, (result.timeLimit || 600) - result.timeTaken) % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={timeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`} />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="dashboard-section summary-section">
        <h3 className="dashboard-title">Summary Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon correct">✓</div>
            <div className="stat-content">
              <p className="stat-label">Correct Answers</p>
              <p className="stat-number">{result.correctAnswers}</p>
              <p className="stat-percentage">{((result.correctAnswers / (result.totalQuestions || 1)) * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon wrong">✗</div>
            <div className="stat-content">
              <p className="stat-label">Wrong Answers</p>
              <p className="stat-number">{result.wrongAnswers}</p>
              <p className="stat-percentage">{((result.wrongAnswers / (result.totalQuestions || 1)) * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon unanswered">?</div>
            <div className="stat-content">
              <p className="stat-label">Unanswered</p>
              <p className="stat-number">
                {(result.totalQuestions || 0) - result.correctAnswers - result.wrongAnswers}
              </p>
              <p className="stat-percentage">
                {(((result.totalQuestions || 0) - result.correctAnswers - result.wrongAnswers) / (result.totalQuestions || 1) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon total">T</div>
            <div className="stat-content">
              <p className="stat-label">Total Questions</p>
              <p className="stat-number">{result.totalQuestions || 0}</p>
              <p className="stat-percentage">100%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDashboard;
