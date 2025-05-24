import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AssessmentResult = () => {
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem('assessmentAnswers');
    if (!data) {
      navigate('/topic-selection');
      return;
    }
    const parsedData = JSON.parse(data);
    setResultData(parsedData);

    // Calculate score
    let correctAnswers = 0;
    parsedData.questions.forEach((question, index) => {
      if (question.correctAnswer === parsedData.answers[index]) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
  }, [navigate]);

  if (!resultData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-indigo-500 to-indigo-700 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-2">Assessment Results</h2>
          <p className="text-gray-600">
            {resultData.subject} - {resultData.topic} ({resultData.concept})
          </p>
          <div className="mt-4 text-2xl font-semibold">
            Score: {score} out of {resultData.questions.length}
          </div>
          <div className="mt-2 text-lg">
            Percentage: {((score / resultData.questions.length) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="space-y-8">
          {resultData.questions.map((question, index) => {
            const userAnswer = resultData.answers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div
                key={index}
                className={`p-6 rounded-xl border-2 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <p className="text-gray-800 mb-4">{question.question}</p>

                <div className="space-y-2">
                  {question.options.map((option, optIndex) => {
                    const optionLetter = String.fromCharCode(65 + optIndex);
                    const isUserAnswer = optionLetter === userAnswer;
                    const isCorrectAnswer = optionLetter === question.correctAnswer;

                    return (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-lg border ${
                          isCorrectAnswer
                            ? 'border-green-500 bg-green-100'
                            : isUserAnswer
                            ? 'border-red-500 bg-red-100'
                            : 'border-gray-200'
                        }`}
                      >
                        <span className="font-medium mr-2">{optionLetter}.</span>
                        {option}
                        {isCorrectAnswer && (
                          <span className="ml-2 text-green-700">✓ Correct Answer</span>
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <span className="ml-2 text-red-700">✗ Your Answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Take Another Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResult;


