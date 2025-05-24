import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../../service/appService";
import { Book, Target, Calendar, Clock, Eye, ArrowLeft, XCircle, CheckCircle } from "lucide-react";

const ViewHistory = () => {
  const [assessmentData, setAssessmentData] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/questions/get-history`
        );
        setAssessmentData(response.data);
        console.log(response.data);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    fetchResult();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return "bg-green-100";
    if (percentage >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  if (selectedAssessment) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setSelectedAssessment(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {selectedAssessment.concept}
                </h1>
                <p className="text-sm text-gray-600">
                  {selectedAssessment.subject} • {selectedAssessment.topic}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div
                className={`p-3 rounded-lg ${getScoreBgColor(
                  selectedAssessment.percentage
                )}`}
              >
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    selectedAssessment.percentage
                  )}`}
                >
                  {selectedAssessment.percentage}%
                </div>
                <div className="text-xs text-gray-600">Score</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedAssessment.score}/{selectedAssessment.totalQuestions}
                </div>
                <div className="text-xs text-gray-600">Correct</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-1">
                  <Clock size={16} />
                  {selectedAssessment.timeElapsed}m
                </div>
                <div className="text-xs text-gray-600">Duration</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700">
                  {formatDate(selectedAssessment.completedAt)}
                </div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {selectedAssessment.questions.map((question, index) => (
              <div
                key={question._id}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      question.isCorrect
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900 mb-3 leading-relaxed">
                      {question.question}
                    </h3>

                    <div className="space-y-2">
                      {question.options.map((option) => {
                        const optionLetter = option.charAt(0);
                        const isCorrect =
                          optionLetter === question.correctAnswer;
                        const isUserAnswer =
                          optionLetter === question.userAnswer;

                        let bgColor = "bg-gray-50";
                        let textColor = "text-gray-700";
                        let borderColor = "border-gray-200";
                        let icon = null;

                        if (isCorrect) {
                          bgColor = "bg-green-50";
                          textColor = "text-green-800";
                          borderColor = "border-green-200";
                          icon = (
                            <CheckCircle size={16} className="text-green-600" />
                          );
                        } else if (isUserAnswer && !question.isCorrect) {
                          bgColor = "bg-red-50";
                          textColor = "text-red-800";
                          borderColor = "border-red-200";
                          icon = <XCircle size={16} className="text-red-600" />;
                        }

                        return (
                          <div
                            key={optionLetter}
                            className={`p-3 rounded-lg border ${bgColor} ${borderColor} flex items-center gap-2`}
                          >
                            <span className={`font-medium ${textColor}`}>
                              {optionLetter}.
                            </span>
                            <span className={`flex-1 ${textColor}`}>
                              {option.substring(3)}
                            </span>
                            {icon}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Assessment History
          </h1>
          <p className="text-gray-600">
            Review your past assessments and track your progress
          </p>
        </div>

        {assessmentData.history.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Book size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No assessments yet
            </h3>
            <p className="text-gray-600">
              Take your first assessment to see your history here
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {assessmentData.history.map((assessment) => (
              <div
                key={assessment._id}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {assessment.concept}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Book size={14} />
                        <span>{assessment.subject}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target size={14} />
                        <span>{assessment.topic}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span>{formatDate(assessment.completedAt)}</span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(
                      assessment.percentage
                    )} ${getScoreColor(assessment.percentage)}`}
                  >
                    {assessment.percentage}%
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      {assessment.score}
                    </div>
                    <div className="text-xs text-gray-600">Correct</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      {assessment.totalQuestions}
                    </div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                      <Clock size={14} />
                      {assessment.timeElapsed}m
                    </div>
                    <div className="text-xs text-gray-600">Time</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAssessment(assessment)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewHistory;
