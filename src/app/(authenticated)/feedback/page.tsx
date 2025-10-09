"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  ChevronDownIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

// Use the detailed types from your plan-history page
interface PlanHistory {
  attempt_number: number;
  plan_id: string;
  timestamp: string;
}

interface PlanHistoryData {
  diet_plans: PlanHistory[];
  fitness_plans: PlanHistory[];
  current_plans: {
    diet?: { plan_id: string };
    fitness?: { plan_id: string };
  };
}

// Combined plan type for easier handling
interface MergedPlan {
  id: string;
  name: string;
  type: "diet" | "fitness";
  isActive: boolean;
}

// Helper to format diet plan IDs (e.g., "Low_Carb_2100" -> "Low Carb 2100")
const formatDietPlanId = (planId: string): string => {
  if (!planId) return "Unnamed Diet Plan";
  return planId.replace(/_/g, " ");
};

// Helper to format fitness plan IDs (e.g., "play_and_perform" -> "Play And Perform")
const formatFitnessPlanId = (planId: string): string => {
  if (!planId) return "Unnamed Workout Plan";
  return planId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function FeedbackPage() {
  const { user } = useAuth();
  const [allPlans, setAllPlans] = useState<MergedPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessPlans = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/plan-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch plan history.");

        const data: PlanHistoryData = await response.json();
        const activeDietId = data.current_plans.diet?.plan_id;
        const activeFitnessId = data.current_plans.fitness?.plan_id;

        const merged: MergedPlan[] = [
          ...data.diet_plans.map((p) => ({
            id: p.plan_id,
            name: `${formatDietPlanId(p.plan_id)} (${format(new Date(p.timestamp), "MMM d, yyyy")})`,
            type: "diet" as const,
            isActive: p.plan_id === activeDietId,
          })),
          ...data.fitness_plans.map((p) => ({
            id: p.plan_id,
            name: `${formatFitnessPlanId(p.plan_id)} (${format(new Date(p.timestamp), "MMM d, yyyy")})`,
            type: "fitness" as const,
            isActive: p.plan_id === activeFitnessId,
          })),
        ];

        // Ensure unique plans and sort with active plans first
        const uniquePlans = Array.from(new Map(merged.map(p => [p.id, p])).values());
        uniquePlans.sort((a, b) => Number(b.isActive) - Number(a.isActive));

        setAllPlans(uniquePlans);
      } catch (err) {
        setError("Could not load your plan history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessPlans();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedPlanId || rating === 0 || !feedbackText.trim()) {
      setError("Please select a plan, provide a rating, and write a comment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId: selectedPlanId,
          rating,
          text: feedbackText,
        }),
      });

      if (!response.ok) throw new Error((await response.json()).error || "Failed to submit feedback.");
      
      setSuccess("Thank you! Your feedback has been submitted successfully.");
      setSelectedPlanId("");
      setRating(0);
      setFeedbackText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activePlans = allPlans.filter(p => p.isActive);
  const pastPlans = allPlans.filter(p => !p.isActive);

  return (
    <div className="p-8 md:p-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12">
           <span className="capitalize text-sm font-semibold bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
            Feedback
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3">Share Your Thoughts</h2>
          <p className="mt-4 text-gray-400 max-w-3xl">
            Your insights help us improve your wellness journey. Select a plan, rate your experience, and leave a comment.
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 md:p-8 space-y-6"
        >
          {/* Plan Selector */}
          <div>
            <label className="block text-lg font-semibold text-white mb-2">
              1. Which plan are you reviewing?
            </label>
            <div className="relative">
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-4 text-white appearance-none focus:ring-2 focus:ring-green-500 transition-all"
                disabled={isLoading || allPlans.length === 0}
              >
                <option value="" disabled>
                  {isLoading ? "Loading plans..." : "Select a plan..."}
                </option>
                {activePlans.length > 0 && <optgroup label="Active Plans">
                  {activePlans.map(plan => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
                </optgroup>}
                 {pastPlans.length > 0 && <optgroup label="Past Plans">
                  {pastPlans.map(plan => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
                </optgroup>}
              </select>
              <ChevronDownIcon className="h-6 w-6 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-lg font-semibold text-white mb-3">
              2. How would you rate it?
            </label>
            <div className="flex items-center gap-2" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div key={star} whileHover={{ scale: 1.2, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <StarIcon
                    className={`h-10 w-10 cursor-pointer transition-colors duration-200 ${
                      (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-600"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label htmlFor="feedbackText" className="block text-lg font-semibold text-white mb-2">
              3. What are your thoughts?
            </label>
            <textarea
              id="feedbackText"
              rows={5}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="Tell us what you liked or what could be improved..."
            />
          </div>

          {/* Messages & Submit Button */}
          <div className="pt-2">
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="bg-red-900/50 text-red-300 p-3 rounded-lg border border-red-700 mb-4 flex items-center gap-2">
                   <XCircleIcon className="h-5 w-5" /> {error}
                </motion.div>
              )}
              {success && (
                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="bg-green-900/50 text-green-300 p-3 rounded-lg border border-green-700 mb-4 flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5" /> {success}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}