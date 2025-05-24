import React, { useState } from "react";
import { baseURL } from "../../service/appService";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TopicAssessmentForm = () => {
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    concept: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Submitted Data:", formData);
    try {
      const response = await axios.post(
        `${baseURL}/api/questions/generate-questions`,
        formData
      );
      console.log("Response:", response.data.data);
      const questions = response?.data?.data?.questions;
      localStorage.setItem("assessment", JSON.stringify(questions));
      localStorage.setItem("subject", response.data.data.topic);
      localStorage.setItem("topic", response.data.data.topic);
      localStorage.setItem("concept", response.data.data.concept);
      navigate("/assessment");
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-500 via-indigo-500 to-indigo-700">
      {/* View History Button */}
      <button
        className="absolute top-4 right-4 text-black bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
        onClick={() => navigate("/assessment-history")}
      >
        View History
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-indigo-700 text-center">
          Select Topics for Assessment
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose a subject
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isLoading}
            >
              <option value="" disabled>
                Select a subject
              </option>
              <option value="Anatomy">Anatomy</option>
              <option value="Physiology">Physiology</option>
              <option value="Microbiology">Microbiology</option>
              <option value="Nutrition and Dietetics">
                Nutrition and Dietetics
              </option>
              <option value="Pharmacology">Pharmacology</option>
              <option value="Medical-Surgical Nursing">
                Medical-Surgical Nursing
              </option>
              <option value="Child Health Nursing">Child Health Nursing</option>
              <option value="Mental Health Nursing">
                Mental Health Nursing
              </option>
              <option value="Community Health Nursing">
                Community Health Nursing
              </option>
              <option value="Obstetric and Gynecological Nursing">
                Obstetric and Gynecological Nursing
              </option>
            </select>
          </div>

          {/* Input 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter topic name
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g. Arrays, Hooks"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isLoading}
            />
          </div>

          {/* Input 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter concept name
            </label>
            <input
              type="text"
              name="concept"
              value={formData.concept}
              onChange={handleChange}
              placeholder="e.g. forEach, useEffect"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-2 rounded-lg transition relative ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
                <span className="opacity-0">Get Questions</span>
              </>
            ) : (
              "Get Questions"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TopicAssessmentForm;
