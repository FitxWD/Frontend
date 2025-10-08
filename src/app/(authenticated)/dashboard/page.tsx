"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import {
  BeakerIcon,
  ChartBarIcon,
  ArrowRightIcon,
  PlusIcon,
  ClockIcon,
  FireIcon,
  ScaleIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";

// Mock data for recent plans - in a real app, you'd fetch this from Firestore
const recentPlans = [
  { id: "1", date: "September 5, 2025", type: "Strength & Calorie Deficit" },
  { id: "2", date: "August 28, 2025", type: "Cardio & Maintenance" },
  { id: "3", date: "August 21, 2025", type: "Flexibility & Lean Bulk" },
];

interface MacroTargets {
  carbs_g: number;
  fat_g: number;
  protein_g: number;
}

interface DietPlan {
  plan_id: string;
  accepted_at: string;
  status: string;
  calorie_range: string;
  macro_targets: MacroTargets;
  notes: string;
}

interface FitnessPlan {
  plan_id: string;
  accepted_at: string;
  status: string;
  name: string;
  level: string;
  description: string;
  durationMinutes: number;
}

interface CurrentPlans {
  diet?: DietPlan;
  fitness?: FitnessPlan;
  has_active_plans: boolean;
  last_updated: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentPlans, setCurrentPlans] = useState<CurrentPlans | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  useEffect(() => {
    const fetchCurrentPlans = async () => {
      try {
        const token = await user?.getIdToken();
        const response = await fetch(
          "http://localhost:8000/api/v1/current-plans",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setCurrentPlans(data);
      } catch (error) {
        console.error("Error fetching current plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCurrentPlans();
    }
  }, [user]);

  const MacroBar = ({ macros }: { macros: MacroTargets }) => {
    const total = macros.carbs_g + macros.protein_g + macros.fat_g;
    const carbsPercent = (macros.carbs_g / total) * 100;
    const proteinPercent = (macros.protein_g / total) * 100;
    const fatPercent = (macros.fat_g / total) * 100;

    return (
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden flex">
        <div className="bg-blue-400" style={{ width: `${carbsPercent}%` }} />
        <div className="bg-red-400" style={{ width: `${proteinPercent}%` }} />
        <div className="bg-yellow-400" style={{ width: `${fatPercent}%` }} />
      </div>
    );
  };

  // Loading skeleton for current plans
  const LoadingSkeleton = () => (
    <div className="mt-12 space-y-6">
      <div className="h-10 w-72 bg-gray-800 rounded-lg animate-pulse" />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-48 bg-gray-800 rounded-xl animate-pulse" />
        <div className="h-48 bg-gray-800 rounded-xl animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="p-8 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-white">
          Welcome, {displayName}!
        </h2>
        <p className="text-gray-400 mt-2">
          Ready to take the next step in your wellness journey?
        </p>

        {/* Show loading skeleton while fetching */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Current Plans Section */}
            {currentPlans?.has_active_plans && (
              <div className="mt-12">
                <h3 className="text-3xl font-bold text-white flex items-center gap-2">
                  <FireIcon className="h-8 w-8 text-orange-400" />
                  Current Plans
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    Last updated:{" "}
                    {format(new Date(currentPlans.last_updated), "PPp")}
                  </span>
                </h3>

                <div className="grid md:grid-cols-2 gap-8 mt-6">
                  {/* Diet Plan Card */}
                  {currentPlans.diet && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <BeakerIcon className="h-6 w-6 text-blue-400" />
                            <h4 className="text-xl font-bold text-white">
                              Current Diet Plan
                            </h4>
                          </div>
                          <p className="text-green-400 text-sm mt-1">
                            {currentPlans.diet.plan_id}
                          </p>
                        </div>
                        <Link
                          href={`/display-dietPlan?plan=${currentPlans.diet.plan_id}&show=true`}
                          className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-500/30 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <ScaleIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-300">
                            Target: {currentPlans.diet.calorie_range} calories
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>
                              Carbs: {currentPlans.diet.macro_targets.carbs_g}g
                            </span>
                            <span>
                              Protein:{" "}
                              {currentPlans.diet.macro_targets.protein_g}g
                            </span>
                            <span>
                              Fat: {currentPlans.diet.macro_targets.fat_g}g
                            </span>
                          </div>
                          <MacroBar macros={currentPlans.diet.macro_targets} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Fitness Plan Card */}
                  {currentPlans.fitness && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <ChartBarIcon className="h-6 w-6 text-green-400" />
                            <h4 className="text-xl font-bold text-white">
                              Current Workout Plan
                            </h4>
                          </div>
                          <p className="text-green-400 text-sm mt-1">
                            {currentPlans.fitness.name}
                          </p>
                        </div>
                        <Link
                          href={`/display-workout?id=${currentPlans.fitness.plan_id}&show=true`}
                          className="text-sm bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-500/30 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>

                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-300">
                          {currentPlans.fitness.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400">
                            Level:{" "}
                            <span className="text-white capitalize">
                              {currentPlans.fitness.level}
                            </span>
                          </span>
                          <span className="text-gray-400">
                            Duration:{" "}
                            <span className="text-white">
                              {currentPlans.fitness.durationMinutes} minutes
                            </span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* No Active Plans Message */}
            {!currentPlans?.has_active_plans && (
              <div className="mt-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <FireIcon className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        No Active Plans
                      </h3>
                      <p className="text-gray-400 mt-1">
                        Get started by generating your personalized diet and
                        fitness plans.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Action Cards - Only show after loading */}
            {!isLoading && (
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                {/* Generate Plan Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <Link
                    href="/generate-plan"
                    className="block bg-green-500 text-white p-8 rounded-2xl shadow-2xl shadow-green-500/20 h-full"
                  >
                    <PlusIcon className="h-10 w-10 mb-4" />
                    <h3 className="text-2xl font-bold">Generate a New Plan</h3>
                    <p className="mt-2 opacity-80">
                      Chat with our AI to create a brand new workout and diet
                      plan tailored just for you.
                    </p>
                    <div className="flex items-center gap-2 mt-6 font-semibold">
                      Start Chatting <ArrowRightIcon className="h-5 w-5" />
                    </div>
                  </Link>
                </motion.div>

                {/* View History Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <Link
                    href="/plan-history"
                    className="block bg-gray-800 hover:bg-gray-700/80 p-8 rounded-2xl shadow-lg h-full transition-colors"
                  >
                    <ClockIcon className="h-10 w-10 mb-4 text-green-400" />
                    <h3 className="text-2xl font-bold text-white">
                      View Plan History
                    </h3>
                    <p className="mt-2 text-gray-400">
                      Review your past plans, track your progress, and provide
                      feedback.
                    </p>
                    <div className="flex items-center gap-2 mt-6 font-semibold text-green-400">
                      See My Plans <ArrowRightIcon className="h-5 w-5" />
                    </div>
                  </Link>
                </motion.div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
