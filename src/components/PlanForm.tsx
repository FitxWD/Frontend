"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCheck } from "react-icons/fa";

interface PlanFormProps {
  planType: string | null;
  onBack?: () => void;
  onChangePlanType?: () => void;
}

// Define different question sets for diet vs fitness
const dietQuestions = [
  {
    id: "age",
    label: "What is your age?",
    type: "number",
    placeholder: "e.g., 25"
  },
  {
    id: "gender",
    label: "What is your gender?",
    type: "select",
    options: ["Male", "Female"]
  },
  {
    id: "height",
    label: "What is your height in centimeters?",
    type: "number",
    placeholder: "e.g., 170"
  },
  {
    id: "weight",
    label: "What is your weight in kilograms?",
    type: "number",
    placeholder: "e.g., 50"
  },
  {
    id: "healthConditions",
    label: "Do you have any health conditions?",
    type: "select",
    options: ["Diabetes", "Hypertension", "Obesity", "None" ]
  },
  {
    id: "conditionSeverity",
    label: "How would you describe the severity of your condition?",
    type: "select",
    options: ["Mild", "Moderate", "Severe"]
  },
  {
    id: "activityLevel",
    label: "How active are you in your daily life?",
    type: "select",
    options: ["Sedentary", "Moderate", "Active"]
  },
  {
    id: "cholesterolLevel",
    label: "What is your cholesterol level in mg/dL?",
    type: "text",
    placeholder: "e.g., 200 mg/dL or 'Don't know'"
  },
  {
    id: "bloodPressure",
    label: "What is your blood pressure in mmHg?",
    type: "text",
    placeholder: "e.g., 120 or 'Don't know'"
  },
  {
    id: "glucoseLevel",
    label: "What is your glucose level in mg/dL?",
    type: "text",
    placeholder: "e.g., 100 or 'Don't know'"
  },
  {
    id: "dietaryRestrictions",
    label: "Do you have any dietary restrictions, such as low sodium or low sugar?",
    type: "select",
    options: ["Low Sodium", "Low Sugar", "None"]
  },
  {
    id: "foodAllergies",
    label: "Are you allergic to any foods, like gluten or peanuts?",
    type: "select",
    options: ["Gluten", "Peanuts", "None"]
  },
  {
    id: "cuisinePreference",
    label: "What type of cuisine do you prefer? (Mexican, Indian, Chinese, or Italian)",
    type: "select",
    options: ["Chinese", "Indian", "Italian", "Mexican"]
  },
  {
    id: "exerciseHours",
    label: "How many hours do you exercise per week?",
    type: "number",
    placeholder: "e.g., 5"
  }
];

const fitnessQuestions = [
  {
    id: "goal",
    label: "What is your primary fitness goal?",
    type: "select",
    options: [
      "Weight Loss",
      "Muscle Building",
      "Strength Training",
      "Endurance/Cardio",
      "General Fitness",
      "Athletic Performance",
      "Rehabilitation"
    ]
  },
  {
    id: "currentFitnessLevel",
    label: "What is your current fitness level?",
    type: "select",
    options: [
      "Beginner (little to no exercise experience)",
      "Intermediate (regular exercise for 6+ months)",
      "Advanced (consistent training for 2+ years)",
      "Expert (competitive athlete/trainer level)"
    ]
  },
  {
    id: "workoutFrequency",
    label: "How many days per week can you workout?",
    type: "select",
    options: ["1-2 days", "3-4 days", "5-6 days", "7 days"]
  },
  {
    id: "workoutDuration",
    label: "How long can you workout per session?",
    type: "select",
    options: [
      "15-30 minutes",
      "30-45 minutes",
      "45-60 minutes",
      "60-90 minutes",
      "More than 90 minutes"
    ]
  },
  {
    id: "equipment",
    label: "What equipment do you have access to?",
    type: "checkbox",
    options: [
      "Gym membership",
      "Home gym",
      "Dumbbells",
      "Resistance bands",
      "Bodyweight only",
      "Cardio machines",
      "Barbell and plates"
    ]
  },
  {
    id: "injuries",
    label: "Do you have any injuries or physical limitations?",
    type: "textarea",
    placeholder: "Please describe any injuries, pain, or limitations..."
  },
  {
    id: "experience",
    label: "Do you have experience with specific exercises?",
    type: "checkbox",
    options: [
      "Weightlifting",
      "Cardio training",
      "Yoga/Pilates",
      "Sports training",
      "Functional training",
      "Calisthenics",
      "None of the above"
    ]
  }
];

export default function PlanForm({ planType, onBack, onChangePlanType }: PlanFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = planType === "diet" ? dietQuestions : fitnessQuestions;
  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const handleInputChange = (value: any) => {
    setFormData(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("http://localhost:8000/api/v1/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType,
          formData,
          method: "form"
        }),
      });

      const result = await response.json();
      console.log("Plan generated:", result);
      
      // Handle success - redirect or show plan
      // You can add navigation logic here
      
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = () => {
    switch (currentQuestion.type) {
      case "select":
        return (
          <select
            value={formData[currentQuestion.id] || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select an option...</option>
            {currentQuestion.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[currentQuestion.id]?.includes(option) || false}
                  onChange={(e) => {
                    const currentValues = formData[currentQuestion.id] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option);
                    handleInputChange(newValues);
                  }}
                  className="w-5 h-5 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                />
                <span className="text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        );

      case "textarea":
        return (
          <textarea
            value={formData[currentQuestion.id] || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentQuestion.placeholder}
            rows={4}
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={formData[currentQuestion.id] || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        );

      default:
        return (
          <input
            type="text"
            value={formData[currentQuestion.id] || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        );
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold">
                {planType === "diet" ? "Diet Plan" : "Fitness Plan"} Questionnaire
              </h1>
              <p className="text-sm text-gray-400">
                Step {currentStep + 1} of {questions.length}
              </p>
            </div>
          </div>
          <button
            onClick={onChangePlanType}
            className="text-sm text-gray-400 hover:text-white"
          >
            Change plan type
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800 px-4 pb-4">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-gray-800 rounded-xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-white">
            {currentQuestion.label}
          </h2>

          {renderInput()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {isLastStep ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData[currentQuestion.id]}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating Plan...</span>
                  </>
                ) : (
                  <>
                    <FaCheck className="w-4 h-4" />
                    <span>Generate Plan</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!formData[currentQuestion.id]}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
