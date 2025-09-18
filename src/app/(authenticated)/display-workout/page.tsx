"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FireIcon,
  ClockIcon,
  ShieldCheckIcon,
  MoonIcon,
  ChevronDownIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

// --- 1. Refined Type Definitions to match the new models ---
interface Exercise {
  name: string;
  duration_min?: number;
  sets?: number;
  reps?: string;
  example?: string;
}

interface Session {
  warmup?: Exercise[];
  main: Exercise[];
  cooldown?: Exercise[];
  safety?: string[];
}

interface DailyTemplate {
  day: string;
  sessions: Session[];
}

// We only need the types for the page, not the full plan
interface WorkoutPlan {
  name: string;
  description: string;
  level: string;
  weekly_template: DailyTemplate[];
}

const workoutPlanOptions = [
  { id: "gentle_start", name: "Gentle Start" },
  { id: "foundation_strength", name: "Foundation Strength" },
  { id: "play_and_perform", name: "Play and Perform" },
  { id: "the_endurance_engine", name: "The Endurance Engine" },
  { id: "the_express_burn", name: "The Express Burn" },
];

const WorkoutPlanSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-700 rounded-full w-32 mb-4"></div>
      <div className="h-10 bg-gray-700 rounded-lg w-1/2 mb-3"></div>
      <div className="h-5 bg-gray-700 rounded-lg w-full max-w-3xl mb-12"></div>
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-lg">
            <div className="h-8 bg-gray-700 rounded-lg w-1/4 mb-4"></div>
            <div className="h-5 bg-gray-600 rounded-lg w-1/2 mb-2"></div>
            <div className="h-5 bg-gray-600 rounded-lg w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );

// --- 2. Component refined to prioritize the new 'example' field ---
const ExerciseDetail = ({ exercise }: { exercise: Exercise }) => {
  const details = [
    exercise.sets && `Sets: ${exercise.sets}`,
    exercise.reps && `Reps: ${exercise.reps}`,
    exercise.duration_min && `${exercise.duration_min} min`,
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <div className="py-2 ml-4 border-l border-gray-700 pl-4">
      <p className="font-medium text-gray-200">{exercise.name}</p>
      {details && <p className="text-sm text-gray-400">{details}</p>}
      {/* If an example exists, display it prominently for clarity */}
      {exercise.example && (
        <div className="mt-1 flex items-start gap-2 text-sky-300/90 text-sm">
            <InformationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{exercise.example}</span>
        </div>
      )}
    </div>
  );
};


export default function WorkoutsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("gentle_start");
  const [planData, setPlanData] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPlan) return;
    const fetchPlanDetails = async () => {
      setIsLoading(true);
      setError(null);
      setTimeout(async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/v1/workout-plan/${selectedPlan}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch '${selectedPlan}'. Please try again.`);
          }
          const data: WorkoutPlan = await response.json();
          setPlanData(data);
        } catch (err: any) {
          setError(err.message);
          setPlanData(null);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    };
    fetchPlanDetails();
  }, [selectedPlan]);

  const FADE_IN_OUT_VARIANTS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="p-8 md:p-12 min-h-screen pb-40">
      <AnimatePresence mode="wait">
        {isLoading && <motion.div key="loader" {...FADE_IN_OUT_VARIANTS}><WorkoutPlanSkeleton /></motion.div>}
        {error && (
          <motion.div key="error" {...FADE_IN_OUT_VARIANTS} className="text-center bg-red-900/50 text-red-300 p-6 rounded-lg border border-red-700">
            <h3 className="font-bold text-xl mb-2">Something went wrong</h3>
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}
        {planData && !isLoading && (
          <motion.div key={selectedPlan} {...FADE_IN_OUT_VARIANTS}>
            <div>
              <span className="capitalize text-sm font-semibold bg-green-500/20 text-green-400 px-3 py-1 rounded-full">{planData.level}</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3">{planData.name}</h2>
              <p className="text-gray-400 mt-2 max-w-3xl">{planData.description}</p>
              <div className="mt-12 space-y-8">
                {planData.weekly_template.map((day) => (
                  <motion.div key={day.day} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                    className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700/50">
                    <h3 className="text-2xl font-bold text-green-400">{day.day}</h3>
                    {day.sessions.map((session, sIndex) => {
                      const isRestDay = session.main[0]?.name.toLowerCase().includes('rest');
                      if (isRestDay) {
                        return (
                          <div key={sIndex} className="flex items-center gap-3 text-gray-400 mt-4 p-4 bg-gray-900/50 rounded-lg">
                            <MoonIcon className="h-6 w-6 text-indigo-400" />
                            <p className="font-medium">{session.main[0].name}</p>
                          </div>
                        );
                      }
                      return (
                        <div key={sIndex} className="mt-4 space-y-4">
                          {session.warmup && session.warmup.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-white flex items-center gap-2 text-lg"><FireIcon className="h-5 w-5 text-orange-400"/>Warm-up</h4>
                              {session.warmup.map((ex, i) => <ExerciseDetail key={`warmup-${i}`} exercise={ex} />)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-white flex items-center gap-2 text-lg"><ClockIcon className="h-5 w-5 text-blue-400"/>Main Workout</h4>
                            {session.main.map((ex, i) => <ExerciseDetail key={`main-${i}`} exercise={ex} />)}
                          </div>
                          {session.cooldown && session.cooldown.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-white text-lg">Cooldown</h4>
                              {session.cooldown.map((ex, i) => <ExerciseDetail key={`cooldown-${i}`} exercise={ex} />)}
                            </div>
                          )}
                          {session.safety && session.safety.length > 0 && (
                            <div className="mt-4 p-4 rounded-lg bg-yellow-900/30 border border-yellow-700/50">
                              <h4 className="font-semibold text-yellow-300 flex items-center gap-2"><ShieldCheckIcon className="h-5 w-5"/>Safety Notes</h4>
                              <ul className="list-disc list-inside text-yellow-300/80 text-sm mt-2 ml-2">
                                {session.safety.map((note, nIndex) => <li key={nIndex}>{note}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4">
        <div className="relative bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-700">
          <label htmlFor="plan-select" className="block text-sm font-medium text-white mb-2 text-center">Change Workout Plan</label>
          <select id="plan-select" value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}
            className="w-full appearance-none bg-gray-800 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500">
            {workoutPlanOptions.map((opt) => (<option key={opt.id} value={opt.id}>{opt.name}</option>))}
          </select>
          <ChevronDownIcon className="h-6 w-6 text-gray-400 absolute right-7 top-[60px] pointer-events-none"/>
        </div>
      </div>
    </div>
  );
}