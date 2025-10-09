"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  BeakerIcon,
  ChartBarIcon,
  HeartIcon,
  UserIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface HealthConditions {
  obesity?: boolean;
  hypertension?: boolean;
  diabetes?: boolean;
  asthma?: boolean;
}

interface DietPlanHistory {
  attempt_number: number;
  plan_id: string;
  user_inputs: {
    blood_pressure: number;
    health_conditions: HealthConditions;
    cuisine_preference: string;
    cholesterol: number;
    exercise_hours: number;
    gender: string;
    bmi: number;
    height: number;
    weight: number;
    age: number;
    glucose: number;
    calories: number;
    severity: string;
    activity_level: string;
  };
  ml_prediction: number;
  timestamp: string;
}

interface FitnessPlanHistory {
  attempt_number: number;
  plan_id: string;
  fitness_category: string;
  user_inputs: {
    calories_burned: number;
    blood_pressure: {
      diastolic: number;
      systolic: number;
    };
    stress_level: number;
    health_conditions: HealthConditions;
    endurance_level: string;
    gender: string;
    bmi: number;
    height: number;
    weight: number;
    sleep_hours: number;
    daily_steps: number;
    age: number;
    workout_duration: number;
    fitness_level: string;
    resting_heart_rate: number;
    intensity: string;
  };
  ml_prediction: number;
  timestamp: string;
}

interface CurrentPlan {
  plan_id: string;
  accepted_at: string;
  status: string;
}

interface PlanHistoryData {
  diet_plans: DietPlanHistory[];
  fitness_plans: FitnessPlanHistory[];
  current_plans: {
    diet?: CurrentPlan;
    fitness?: CurrentPlan;
  };
}

const HistoryCard = ({
  title,
  timestamp,
  planId,
  isActive,
  details,
  type,
}: {
  title: string;
  timestamp: string;
  planId: string;
  isActive: boolean;
  details: any;
  type: "diet" | "fitness";
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleViewPlan = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card expansion when clicking the button
    const route = type === "diet" ? "display-dietPlan" : "display-workout";
    const queryParam = type === "diet" ? "plan" : "id";
    router.push(`/${route}?${queryParam}=${planId}&show=true`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
    >
      <div
        className="p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {type === "diet" ? (
              <BeakerIcon className="h-6 w-6 text-blue-400" />
            ) : (
              <ChartBarIcon className="h-6 w-6 text-green-400" />
            )}
            <div>
              <h3 className="font-bold text-white">{title}</h3>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                {format(new Date(timestamp), "PPp")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isActive && (
              <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                Active Plan
              </span>
            )}
            {/* Add View Plan button */}
            <button
              onClick={handleViewPlan}
              className="flex items-center gap-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors px-3 py-1.5 rounded-lg text-sm"
            >
              <EyeIcon className="h-4 w-4" />
              View Plan
            </button>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-700"
          >
            <div className="p-4 space-y-4">
              {type === "diet" ? (
                // Diet Plan Details
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <DetailItem
                      icon={<UserIcon className="h-5 w-5 text-blue-400" />}
                      label="Basic Info"
                      value={`${details.user_inputs.age}y, ${
                        details.user_inputs.gender
                      }, BMI: ${details.user_inputs.bmi.toFixed(1)}`}
                    />
                    <DetailItem
                      icon={<HeartIcon className="h-5 w-5 text-pink-400" />}
                      label="Health Metrics"
                      value={`BP: ${details.user_inputs.blood_pressure}, Glucose: ${details.user_inputs.glucose}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <DetailItem
                      icon={<BeakerIcon className="h-5 w-5 text-purple-400" />}
                      label="Diet Preferences"
                      value={`${details.user_inputs.cuisine_preference} cuisine, ${details.user_inputs.calories} kcal`}
                    />
                    <DetailItem
                      icon={
                        <DocumentDuplicateIcon className="h-5 w-5 text-yellow-400" />
                      }
                      label="Activity Level"
                      value={details.user_inputs.activity_level}
                    />
                  </div>
                </div>
              ) : (
                // Fitness Plan Details
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <DetailItem
                      icon={<UserIcon className="h-5 w-5 text-blue-400" />}
                      label="Fitness Level"
                      value={`${details.user_inputs.fitness_level}, ${details.user_inputs.intensity} Intensity`}
                    />
                    <DetailItem
                      icon={<HeartIcon className="h-5 w-5 text-pink-400" />}
                      label="Health Metrics"
                      value={`BP: ${details.user_inputs.blood_pressure.systolic}/${details.user_inputs.blood_pressure.diastolic}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <DetailItem
                      icon={<ChartBarIcon className="h-5 w-5 text-green-400" />}
                      label="Activity Stats"
                      value={`${details.user_inputs.daily_steps} steps, ${details.user_inputs.workout_duration} mins`}
                    />
                    <DetailItem
                      icon={<ClockIcon className="h-5 w-5 text-orange-400" />}
                      label="Recovery"
                      value={`${details.user_inputs.sleep_hours}h sleep, Stress: ${details.user_inputs.stress_level}/10`}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-2">
    {icon}
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  </div>
);

export default function PlanHistoryPage() {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState<PlanHistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await user?.getIdToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/plan-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch plan history");
        }

        const data = await response.json();
        setHistoryData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (isLoading) {
    return (
      <div className="p-8 md:p-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 md:p-12">
        <div className="bg-red-900/50 text-red-300 p-6 rounded-xl border border-red-700">
          <h3 className="font-bold text-xl mb-2">Error Loading History</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 min-h-screen">
      <div className="mb-12">
        <span className="capitalize text-sm font-semibold bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
          History
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3">
          Plan History
        </h2>
        <p className="mt-4 text-gray-400 max-w-3xl">
          View your past diet and fitness plans, including your current active
          plans and previous attempts.
        </p>
      </div>

      <div className="space-y-8">
        {/* Current Plans Section */}
        {(historyData?.current_plans?.diet ||
          historyData?.current_plans?.fitness) && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircleIcon className="h-6 w-6 text-green-400" />
              Active Plans
            </h3>
            <div className="space-y-4">
              {historyData?.current_plans?.diet && (
                <HistoryCard
                  title={`Diet Plan: ${historyData.current_plans.diet.plan_id}`}
                  timestamp={historyData.current_plans.diet.accepted_at}
                  planId={historyData.current_plans.diet.plan_id}
                  isActive={true}
                  details={historyData.diet_plans[0]}
                  type="diet"
                />
              )}
              {historyData?.current_plans?.fitness && (
                <HistoryCard
                  title={`Fitness Plan: ${historyData.current_plans.fitness.plan_id}`}
                  timestamp={historyData.current_plans.fitness.accepted_at}
                  planId={historyData.current_plans.fitness.plan_id}
                  isActive={true}
                  details={historyData.fitness_plans[0]}
                  type="fitness"
                />
              )}
            </div>
          </div>
        )}

        {/* Past Diet Plans */}
        {historyData?.diet_plans && historyData.diet_plans.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BeakerIcon className="h-6 w-6 text-blue-400" />
              Diet Plan History
            </h3>
            <div className="space-y-4">
              {historyData.diet_plans.map((plan) => (
                <HistoryCard
                  key={`${plan.plan_id}-${plan.timestamp}`}
                  title={`Diet Plan: ${plan.plan_id}`}
                  timestamp={plan.timestamp}
                  planId={plan.plan_id}
                  isActive={false}
                  details={plan}
                  type="diet"
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Fitness Plans */}
        {historyData?.fitness_plans && historyData.fitness_plans.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ChartBarIcon className="h-6 w-6 text-green-400" />
              Fitness Plan History
            </h3>
            <div className="space-y-4">
              {historyData.fitness_plans.map((plan) => (
                <HistoryCard
                  key={`${plan.plan_id}-${plan.timestamp}`}
                  title={`Fitness Plan: ${plan.plan_id}`}
                  timestamp={plan.timestamp}
                  planId={plan.plan_id}
                  isActive={false}
                  details={plan}
                  type="fitness"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
