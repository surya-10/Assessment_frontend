import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Clock, BookOpen } from 'lucide-react';
import axios from 'axios';
import { baseURL } from '../../service/appService';

// const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Assessment = () => {
  const [assessmentData, setAssessmentData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [concept, setConcept] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load assessment data from localStorage
    const data = JSON.parse(localStorage.getItem('assessment'));
    const subject = localStorage.getItem("subject");
    const topic = localStorage.getItem("topic");
    const concept = localStorage.getItem("concept");
    setSubject(subject);
    setTopic(topic);
    setConcept(concept)
    console.log(data);
    if (!data) {
      // Handle case where no data is found - you might want to navigate back
      console.error('No assessment data found in localStorage');
      return;
    }
    setAssessmentData(data);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex) => {
    const questionId = assessmentData[currentQuestion]._id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: String.fromCharCode(65 + optionIndex) // Convert to A, B, C, D
    }));
  };

  const handleNext = () => {
    if (currentQuestion < assessmentData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsCompleted(true);
      // alert("yes")
      saveAssessmentResult()

    }
  };

  const saveAssessmentResult = async () => {
    try {
      setIsSubmitting(true);
      const score = calculateScore();
      const percentage = Math.round((score / assessmentData.length) * 100);
      
      // Prepare questions data with user answers
      const questionsData = assessmentData.map(question => ({
        questionId: question._id,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userAnswer: answers[question._id] || 'N/A', // Handle unanswered questions
        isCorrect: answers[question._id] === question.correctAnswer
      }));

      const assessmentResultData = {
        subject: subject,
        topic: topic,
        concept: concept,
        questions: questionsData,
        score: score,
        totalQuestions: assessmentData.length,
        percentage: percentage,
        timeElapsed: timeElapsed,
        completedAt: new Date()
      };

      // API call to save assessment result
      const response = await axios.post(`${baseURL}/api/questions/save-assessment`, assessmentResultData);
      
      if (response.data.success) {
        console.log('Assessment result saved successfully:', response.data.result);
        setShowResults(true);
        return response.data.result;
      } else {
        throw new Error(response.data.message || 'Failed to save assessment result');
      }
    } catch (error) {
      console.error('Error saving assessment result:', error);
      alert('Failed to save assessment result. Please try again.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    assessmentData.forEach(question => {
      if (answers[question._id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const currentQ = assessmentData[currentQuestion];
  const selectedAnswer = answers[currentQ?._id];
  const progress = ((currentQuestion + 1) / assessmentData.length) * 100;
  const answeredCount = Object.keys(answers).length;

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / assessmentData.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-4">
        <div className="max-w-md mx-auto">
          {/* Header with overall score */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6 mt-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Assessment Complete!</h2>
              
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-4 mb-4">
                <div className={`text-3xl font-bold mb-1 ${getScoreColor(score, assessmentData.length)}`}>
                  {score}/{assessmentData.length}
                </div>
                <div className={`text-xl font-semibold ${getScoreColor(score, assessmentData.length)}`}>
                  {percentage}%
                </div>
              </div>

              {/* <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Time</p>
                  <p className="font-semibold text-blue-600 text-sm">{formatTime(timeElapsed)}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <BookOpen className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Questions</p>
                  <p className="font-semibold text-green-600 text-sm">{assessmentData.length}</p>
                </div>
              </div> */}
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4 mb-6">
            <h3 className="text-white text-lg font-semibold text-center mb-4">Question Review</h3>
            
            {assessmentData.map((question, index) => {
              const userAnswer = answers[question._id];
              const isCorrect = userAnswer === question.correctAnswer;
              const correctIndex = question.correctAnswer.charCodeAt(0) - 65; // Convert A,B,C,D to 0,1,2,3
              const userIndex = userAnswer ? userAnswer.charCodeAt(0) - 65 : -1;
              
              return (
                <div key={question._id} className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-full text-sm font-medium">
                      Q{index + 1}
                    </span>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isCorrect 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  </div>
                  
                  <p className="text-gray-800 font-medium mb-3 text-sm leading-relaxed">
                    {question.question}
                  </p>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => {
                      const optionLetter = String.fromCharCode(65 + optIndex);
                      const isUserChoice = optIndex === userIndex;
                      const isCorrectAnswer = optIndex === correctIndex;
                      
                      let bgColor = 'bg-gray-50';
                      let textColor = 'text-gray-700';
                      let borderColor = '';
                      
                      if (isCorrectAnswer) {
                        bgColor = 'bg-green-50';
                        textColor = 'text-green-700';
                        borderColor = 'border-2 border-green-200';
                      }
                      
                      if (isUserChoice && !isCorrect) {
                        bgColor = 'bg-red-50';
                        textColor = 'text-red-700';
                        borderColor = 'border-2 border-red-200';
                      }
                      
                      if (isUserChoice && isCorrect) {
                        bgColor = 'bg-green-50';
                        textColor = 'text-green-700';
                        borderColor = 'border-2 border-green-200';
                      }
                      
                      return (
                        <div key={optIndex} className={`p-3 rounded-xl ${bgColor} ${borderColor}`}>
                          <div className="flex items-center">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mr-3 ${
                              isCorrectAnswer 
                                ? 'bg-green-200 text-green-700' 
                                : isUserChoice 
                                  ? 'bg-red-200 text-red-700'
                                  : 'bg-gray-200 text-gray-600'
                            }`}>
                              {optionLetter}
                            </span>
                            <span className={`flex-1 text-sm ${textColor}`}>
                              {option}
                            </span>
                            <div className="flex items-center space-x-1">
                              {isCorrectAnswer && (
                                <Check className="w-4 h-4 text-green-600" />
                              )}
                              {isUserChoice && (
                                <span className="text-xs font-medium">
                                  {isCorrect ? 'Your answer' : 'Your answer'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="pb-6">
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers({});
                setIsCompleted(false);
                setShowResults(false);
                setTimeElapsed(0);
              }}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg transform transition hover:scale-105 active:scale-95"
            >
              Take Assessment Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Saving Results...</h2>
                <p className="text-gray-600">Please wait while we save your assessment results.</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Assessment Complete!</h2>
                <p className="text-gray-600 mb-6">
                  You've answered all {assessmentData.length} questions. Ready to see your results?
                </p>
                <button
                  onClick={() => setShowResults(true)}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg transform transition hover:scale-105 active:scale-95"
                >
                  View Results
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!assessmentData || assessmentData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-4 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 text-white">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">React Assessment</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
          </div>
          
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentQuestion + 1} of {assessmentData.length}</span>
            <span>{answeredCount}/{assessmentData.length} answered</span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Q{currentQuestion + 1}
              </span>
              {selectedAnswer && (
                <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                  Answered
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index);
              const isSelected = selectedAnswer === optionLetter;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 rounded-2xl text-left transition-all duration-200 transform ${
                    isSelected 
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg scale-105' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:scale-102'
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ${
                      isSelected 
                        ? 'bg-white text-violet-500' 
                        : 'bg-violet-100 text-violet-600'
                    }`}>
                      {optionLetter}
                    </span>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all ${
              currentQuestion === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white text-violet-600 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all ${
              !selectedAnswer
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
            }`}
          >
            <span>{currentQuestion === assessmentData.length - 1 ? 'Finish' : 'Next'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;