"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ArrowRightIcon, PlusIcon, ClockIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Link from "next/link";

// Mock data for recent plans - in a real app, you'd fetch this from Firestore
const recentPlans = [
  { id: "1", date: "September 5, 2025", type: "Strength & Calorie Deficit" },
  { id: "2", date: "August 28, 2025", type: "Cardio & Maintenance" },
  { id: "3", date: "August 21, 2025", type: "Flexibility & Lean Bulk" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

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

        {/* --- Main Action Cards --- */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Generate Plan Card */}
          <motion.div whileHover={{ scale: 1.03, y: -5 }}>
            <Link
              href="/generate-plan"
              className="block bg-green-500 text-white p-8 rounded-2xl shadow-2xl shadow-green-500/20 h-full"
            >
              <PlusIcon className="h-10 w-10 mb-4" />
              <h3 className="text-2xl font-bold">Generate a New Plan</h3>
              <p className="mt-2 opacity-80">
                Chat with our AI to create a brand new workout and diet plan
                tailored just for you.
              </p>
              <div className="flex items-center gap-2 mt-6 font-semibold">
                Start Chatting <ArrowRightIcon className="h-5 w-5" />
              </div>
            </Link>
          </motion.div>

          {/* View History Card */}
          <motion.div whileHover={{ scale: 1.03, y: -5 }}>
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

        {/* --- Recent Plans Section --- */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-white">Recent Activity</h3>
          <div className="mt-6 space-y-4">
            {recentPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-gray-800 p-5 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-white">{plan.type}</p>
                  <p className="text-sm text-gray-400">{plan.date}</p>
                </div>
                <Link
                  href={`/plans/${plan.id}`}
                  className="px-4 py-2 text-sm font-semibold bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
