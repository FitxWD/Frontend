"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

interface HealthData {
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
}

interface PlanFormProps {
  planType: string | null;
  onBack: () => void;
  onChangePlanType: () => void;
  initialHealthData?: HealthData | null;
}

// Define different question sets for diet vs fitness
const dietQuestions = [
  {
    id: "age",
    label: "What is your age?",
    type: "number",
    placeholder: "e.g., 25",
  },
  {
    id: "gender",
    label: "What is your gender?",
    type: "select",
    options: ["Male", "Female"],
  },
  {
    id: "height",
    label: "What is your height in centimeters?",
    type: "number",
    placeholder: "e.g., 170",
  },
  {
    id: "weight",
    label: "What is your weight in kilograms?",
    type: "number",
    placeholder: "e.g., 50",
  },
  {
    id: "healthConditions",
    label: "Do you have any health conditions?",
    type: "select",
    options: ["Diabetes", "Hypertension", "Obesity", "None"],
  },
  {
    id: "conditionSeverity",
    label: "How would you describe the severity of your condition?",
    type: "select",
    options: ["Mild", "Moderate", "Severe"],
  },
  {
    id: "activityLevel",
    label: "How active are you in your daily life?",
    type: "select",
    options: ["Sedentary", "Moderate", "Active"],
  },
  {
    id: "cholesterolLevel",
    label: "What is your cholesterol level in (mg/dL)?",
    type: "text",
    placeholder: "e.g., 200 or 'Don't know'",
  },
  {
    id: "bloodPressure",
    label: "What is your blood pressure in mmHg?",
    type: "text",
    placeholder: "e.g., 120 or 'Don't know'",
  },
  {
    id: "glucoseLevel",
    label: "What is your glucose level in mg/dL?",
    type: "text",
    placeholder: "e.g., 100 or 'Don't know'",
  },
  {
    id: "dietaryRestrictions",
    label:
      "Do you have any dietary restrictions, such as low sodium or low sugar?",
    type: "select",
    options: ["Low Sodium", "Low Sugar", "None"],
  },
  {
    id: "foodAllergies",
    label: "Are you allergic to any foods, like gluten or peanuts?",
    type: "select",
    options: ["Gluten", "Peanuts", "None"],
  },
  {
    id: "cuisinePreference",
    label:
      "What type of cuisine do you prefer? (Mexican, Indian, Chinese, or Italian)",
    type: "select",
    options: ["Chinese", "Indian", "Italian", "Mexican"],
  },
  {
    id: "exerciseHours",
    label: "How many hours do you exercise per week?",
    type: "number",
    placeholder: "e.g., 5",
  },
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
      "Rehabilitation",
    ],
  },
  {
    id: "currentFitnessLevel",
    label: "What is your current fitness level?",
    type: "select",
    options: [
      "Beginner (little to no exercise experience)",
      "Intermediate (regular exercise for 6+ months)",
      "Advanced (consistent training for 2+ years)",
      "Expert (competitive athlete/trainer level)",
    ],
  },
  {
    id: "workoutFrequency",
    label: "How many days per week can you workout?",
    type: "select",
    options: ["1-2 days", "3-4 days", "5-6 days", "7 days"],
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
      "More than 90 minutes",
    ],
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
      "Barbell and plates",
    ],
  },
  {
    id: "injuries",
    label: "Do you have any injuries or physical limitations?",
    type: "textarea",
    placeholder: "Please describe any injuries, pain, or limitations...",
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
      "None of the above",
    ],
  },
];

export default function PlanForm({
  planType,
  onBack,
  onChangePlanType,
  initialHealthData,
}: PlanFormProps) {
  // Initialize formData with health data from localStorage
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    try {
      const storedHealthData = localStorage.getItem("userHealthData");
      if (storedHealthData) {
        const healthData = JSON.parse(storedHealthData);
        return {
          age: healthData.age || "",
          gender:
            healthData.gender?.charAt(0).toUpperCase() +
              healthData.gender?.slice(1) || "",
          height: healthData.height || "",
          weight: healthData.weight || "",
        };
      }
    } catch (error) {
      console.error("Error loading health data:", error);
    }
    return {};
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const questions = planType === "diet" ? dietQuestions : fitnessQuestions;

  const handleInputChange = (questionId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const isFormComplete = () => {
    return questions.every((question) => {
      const value = formData[question.id];
      if (question.type === "checkbox") {
        return value && value.length > 0;
      }
      return value && value.toString().trim() !== "";
    });
  };

  const getCompletedCount = () => {
    return questions.filter((question) => {
      const value = formData[question.id];
      if (question.type === "checkbox") {
        return value && value.length > 0;
      }
      return value && value.toString().trim() !== "";
    }).length;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        throw new Error("Authentication required");
      }

      // Transform formData to match required format
      const transformedData = questions.reduce((acc, question, index) => {
        acc[`Q${index}`] = formData[question.id]?.toString() || "";
        return acc;
      }, {} as Record<string, string>);

      const response = await fetch(
        "http://localhost:8000/api/v1/generate-plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan_type: planType,
            user_answers: transformedData,
            user_id: userId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Plan generated:", result);

      if (result.status === "success") {
        // Store the generated plan details
        localStorage.setItem("generatedPlan", JSON.stringify(result.plan));
        localStorage.setItem("planType", result.plan_type);
        localStorage.setItem("assignedPlanId", result.plan.assigned_plan_id);

        // Show success toast
        toast.success(
          `${
            planType === "diet" ? "Diet" : "Fitness"
          } plan generated successfully!`,
          {
            duration: 4000,
            position: "top-center",
          }
        );

        // Navigate to plan display page with assigned plan ID
        const planId = result.plan.assigned_plan_id;
        router.push(`/display-${planType}Plan?plan=${planId}`);
      } else {
        throw new Error("Failed to generate plan");
      }
    } catch (error: unknown) {
      console.error("Error generating plan:", error);
      if (
        error instanceof Error &&
        error.message === "Authentication required"
      ) {
        // Handle auth error with toast
        toast.error("Please sign in to generate a plan", {
          duration: 4000,
          position: "top-center",
        });
      } else {
        // Handle general errors with toast
        toast.error(
          `Error generating ${planType} plan: ${
            error instanceof Error ? error.message : "Unknown error occurred"
          }`,
          {
            duration: 4000,
            position: "top-center",
          }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add prefilled indicator to renderInput
  const renderInput = (question: any) => {
    const value = formData[question.id] || "";
    const isAnswered =
      question.type === "checkbox"
        ? value && value.length > 0
        : value && value.toString().trim() !== "";

    const isPrefilled = ["age", "gender", "height", "weight"].includes(
      question.id
    );

    const inputClassName = `w-full p-3 border rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
      isAnswered
        ? "bg-gray-700 border-green-500"
        : "bg-gray-700 border-gray-600"
    }`;

    return (
      <div className="relative">
        {/* Existing input field */}
        {renderInputField(question, value, inputClassName)}

        {/* Prefilled indicator */}
        {isPrefilled && value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
              Pre-filled
            </span>
            <button
              type="button"
              onClick={() => handleInputChange(question.id, "")}
              className="text-xs text-gray-400 hover:text-white"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    );
  };

  // Separate renderInputField function for clarity
  const renderInputField = (
    question: any,
    value: any,
    inputClassName: string
  ) => {
    const isAnswered =
      question.type === "checkbox"
        ? value && value.length > 0
        : value && value.toString().trim() !== "";

    switch (question.type) {
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={inputClassName}
          >
            <option value="">Select an option...</option>
            {question.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div
            className={`space-y-2 p-3 border rounded-lg ${
              isAnswered
                ? "border-green-500 bg-gray-750"
                : "border-gray-600 bg-gray-700"
            }`}
          >
            {question.options?.map((option: string) => (
              <label
                key={option}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value?.includes(option) || false}
                  onChange={(e) => {
                    const currentValues = value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option);
                    handleInputChange(question.id, newValues);
                  }}
                  className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                />
                <span className="text-gray-300 text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={3}
            className={`${inputClassName} resize-none`}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={inputClassName}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={inputClassName}
          />
        );
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      {/* Add Toaster component */}
      <Toaster />

      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="text-gray-400 hover:text-white">
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold">
                {planType === "diet" ? "Diet Plan" : "Fitness Plan"}{" "}
                Questionnaire
              </h1>
              <p className="text-sm text-gray-400">
                Fill out all questions to generate your personalized plan (
                {getCompletedCount()}/{questions.length} completed)
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

      {/* Form Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-8 text-white text-center">
            Complete Your {planType === "diet" ? "Diet" : "Fitness"} Assessment
          </h2>

          {/* All Questions in Single Column */}
          <div className="space-y-6 mb-8">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <label className="block text-lg font-medium text-gray-300">
                  {index + 1}. {question.label}
                </label>
                {renderInput(question)}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormComplete()}
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 text-lg font-semibold"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Your Plan...</span>
                </>
              ) : (
                <>
                  <FaCheck className="w-5 h-5" />
                  <span>
                    Generate {planType === "diet" ? "Diet" : "Fitness"} Plan
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
