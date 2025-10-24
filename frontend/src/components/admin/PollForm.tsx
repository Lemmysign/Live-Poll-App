import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
import '../styles/PollForm.css';

interface Answer {
  text: string;
  answerOrder: number;
}

interface Question {
  text: string;
  questionOrder: number;
  answers: Answer[];
}

interface FormData {
  title: string;
  pollStatusId: number;
  chartTypeId: number;
  allowViewResults: boolean;
  requiredDemographics: string[];
  questions: Question[];
}

const PollForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    pollStatusId: 1,
    chartTypeId: 1,
    allowViewResults: false,
    requiredDemographics: [],
    questions: [
      {
        text: '',
        questionOrder: 1,
        answers: [
          { text: '', answerOrder: 1 },
          { text: '', answerOrder: 2 },
        ],
      },
    ],
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      title: e.target.value,
    });
  };

  const handleQuestionChange = (
    questionIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].text = e.target.value;
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].answers[answerIndex].text = e.target.value;
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const addAnswer = (questionIndex: number) => {
    const updatedQuestions = [...formData.questions];
    const newAnswerOrder =
      updatedQuestions[questionIndex].answers.length + 1;
    updatedQuestions[questionIndex].answers.push({
      text: '',
      answerOrder: newAnswerOrder,
    });
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...formData.questions];
    if (updatedQuestions[questionIndex].answers.length > 2) {
      updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
      updatedQuestions[questionIndex].answers = updatedQuestions[
        questionIndex
      ].answers.map((answer, index) => ({
        ...answer,
        answerOrder: index + 1,
      }));
      setFormData({
        ...formData,
        questions: updatedQuestions,
      });
    }
  };

  const addQuestion = () => {
    const newQuestionOrder = formData.questions.length + 1;
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          text: '',
          questionOrder: newQuestionOrder,
          answers: [
            { text: '', answerOrder: 1 },
            { text: '', answerOrder: 2 },
          ],
        },
      ],
    });
  };

  const removeQuestion = (questionIndex: number) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = formData.questions.filter(
        (_, index) => index !== questionIndex
      );
      updatedQuestions.forEach((q, index) => {
        q.questionOrder = index + 1;
      });
      setFormData({
        ...formData,
        questions: updatedQuestions,
      });
    }
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'allowViewResults' | 'demographic'
  ) => {
    if (type === 'allowViewResults') {
      setFormData({
        ...formData,
        allowViewResults: e.target.checked,
      });
    } else if (type === 'demographic') {
      const value = e.target.value;
      let updatedDemographics = [...formData.requiredDemographics];
      if (e.target.checked) {
        updatedDemographics.push(value);
      } else {
        updatedDemographics = updatedDemographics.filter((d) => d !== value);
      }
      setFormData({
        ...formData,
        requiredDemographics: updatedDemographics,
      });
    }
  };

  const handleChartTypeChange = (chartTypeId: number) => {
    setFormData({
      ...formData,
      chartTypeId,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.title.trim()) {
      newErrors.push('Poll title is required');
    }

    formData.questions.forEach((question, index) => {
      if (!question.text.trim()) {
        newErrors.push(`Question ${index + 1} text is required`);
      }
      if (question.answers.length < 2) {
        newErrors.push(
          `Question ${index + 1} must have at least 2 answers`
        );
      }
      question.answers.forEach((answer, ansIndex) => {
        if (!answer.text.trim()) {
          newErrors.push(
            `Question ${index + 1}, Answer ${ansIndex + 1} is required`
          );
        }
      });
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const adminId = localStorage.getItem('adminId');
      if (!adminId) {
        setErrors(['Admin session expired. Please login again.']);
        setLoading(false);
        return;
      }

      const pollData = {
        title: formData.title,
        pollStatusId: formData.pollStatusId,
        chartTypeId: formData.chartTypeId,
        allowViewResults: formData.allowViewResults,
        requiredDemographics: formData.requiredDemographics,
        questions: formData.questions.map((q) => ({
          text: q.text,
          questionOrder: q.questionOrder,
          answers: q.answers.map((a) => a.text),
        })),
      };

      const response = await axios.post(
        `${config.createPollUrl}?adminId=${adminId}`,
        pollData
      );

      if (response.status === 201 || response.status === 200) {
        navigate('/admin/dashboard', {
          state: { successMessage: 'Poll created successfully!' },
        });
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      if (axios.isAxiosError(error)) {
        setErrors([
          error.response?.data?.message ||
            'Failed to create poll. Please try again.',
        ]);
      } else {
        setErrors(['An unexpected error occurred. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="poll-form-container">
      {/* Header */}
      <div className="poll-form-header">
        <div className="poll-form-header-content">
          <button
            className="back-btn"
            onClick={() => navigate('/admin/dashboard')}
          >
            ← Back
          </button>
          <h1 className="form-title">Create New Poll</h1>
        </div>
      </div>

      {/* Main Layout */}
      <div className="poll-form-layout">
        {/* Left Column - Main Form */}
        <div className="form-left-column">
          {errors.length > 0 && (
            <div className="error-container">
              {errors.map((error, index) => (
                <div key={index} className="error-message">
                  {error}
                </div>
              ))}
            </div>
          )}

          {/* Poll Title */}
          <div className="form-card">
            <label htmlFor="pollTitle" className="form-label">
              Poll Title
            </label>
            <input
              type="text"
              id="pollTitle"
              className="form-input title-input"
              placeholder="Enter a poll title..."
              value={formData.title}
              onChange={handleTitleChange}
            />
          </div>

          {/* Questions */}
          <form onSubmit={handleSubmit}>
            {formData.questions.map((question, qIndex) => (
              <div key={qIndex} className="question-card">
                <div className="question-header">
                  <h3>Question {qIndex + 1}</h3>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeQuestion(qIndex)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  id={`question-${qIndex}`}
                  className="form-input"
                  placeholder="Enter your question..."
                  value={question.text}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                />

                {/* Answers */}
                <div className="answers-container">
                  <h4 className="answers-title">Answer Options</h4>
                  {question.answers.map((answer, aIndex) => (
                    <div key={aIndex} className="answer-row">
                      <span className="answer-number">{aIndex + 1}.</span>
                      <input
                        type="text"
                        className="form-input answer-input"
                        placeholder={`Answer option ${aIndex + 1}`}
                        value={answer.text}
                        onChange={(e) =>
                          handleAnswerChange(qIndex, aIndex, e)
                        }
                      />
                      {question.answers.length > 2 && (
                        <button
                          type="button"
                          className="remove-answer-btn"
                          onClick={() => removeAnswer(qIndex, aIndex)}
                          title="Remove answer"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-answer-btn"
                    onClick={() => addAnswer(qIndex)}
                  >
                    + Add Answer Option
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="add-question-btn"
              onClick={addQuestion}
            >
              + Add Another Question
            </button>
          </form>
        </div>

        {/* Right Column - Settings Sidebar */}
        <div className="form-right-column">
          <div className="settings-sticky">
            {/* Chart Type */}
            <div className="settings-card">
              <label className="settings-label">Chart Type</label>
              <div className="chart-options">
                <label
                  className={`radio-label ${
                    formData.chartTypeId === 1 ? 'active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="chartType"
                    value="1"
                    checked={formData.chartTypeId === 1}
                    onChange={() => handleChartTypeChange(1)}
                    className="radio-input"
                  />
                  <span className="radio-icon">📊</span>
                  <span className="radio-text">Pie Chart</span>
                </label>
                <label
                  className={`radio-label ${
                    formData.chartTypeId === 2 ? 'active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="chartType"
                    value="2"
                    checked={formData.chartTypeId === 2}
                    onChange={() => handleChartTypeChange(2)}
                    className="radio-input"
                  />
                  <span className="radio-icon">📈</span>
                  <span className="radio-text">Bar Chart</span>
                </label>
              </div>
            </div>

            {/* Demographics */}
            <div className="settings-card">
              <label className="settings-label">
                Required Demographics
              </label>
              <div className="demographics-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="name"
                    checked={formData.requiredDemographics.includes('name')}
                    onChange={(e) => handleCheckboxChange(e, 'demographic')}
                    className="checkbox-input"
                  />
                  <span className="checkbox-icon">👤</span>
                  <span className="checkbox-text">Name</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="gender"
                    checked={formData.requiredDemographics.includes('gender')}
                    onChange={(e) => handleCheckboxChange(e, 'demographic')}
                    className="checkbox-input"
                  />
                  <span className="checkbox-icon">⚧</span>
                  <span className="checkbox-text">Gender</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="age"
                    checked={formData.requiredDemographics.includes('age')}
                    onChange={(e) => handleCheckboxChange(e, 'demographic')}
                    className="checkbox-input"
                  />
                  <span className="checkbox-icon">🎂</span>
                  <span className="checkbox-text">Age</span>
                </label>
              </div>
            </div>

            {/* View Results */}
            <div className="settings-card">
              <label className="view-results-toggle">
                <input
                  type="checkbox"
                  checked={formData.allowViewResults}
                  onChange={(e) =>
                    handleCheckboxChange(e, 'allowViewResults')
                  }
                  className="toggle-checkbox"
                />
                <div className="toggle-content">
                  <div className="toggle-title">Allow View Results</div>
                  <div className="toggle-description">
                    Users can see poll results after voting
                  </div>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? 'Creating Poll...' : '✓ Create Poll'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollForm;