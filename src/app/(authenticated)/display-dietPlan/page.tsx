"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FireIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  SparklesIcon, // Icon for meals
  HeartIcon, // Icon for plan stats
  BookOpenIcon // Icon for plan notes
} from "@heroicons/react/24/solid";

// --- Type Definitions to match Pydantic models ---
interface MacroTargets {
  carbs_g: number;
  protein_g: number;
  fat_g: number;
}

interface AlternativeMeal {
  name: string;
  approx_kcal: number;
}

interface Meal {
  name: string;
  description: string;
  ingredients: string[];
  approx_kcal: number;
  alternatives: AlternativeMeal[];
}

interface DailyDiet {
  day: number;
  meals: Meal[];
}

interface DietPlan {
  diet_type: string;
  calorie_range: string;
  macro_targets: MacroTargets;
  notes: string;
  days: DailyDiet[];
}

// --- List of available plans for the dropdown ---
const dietPlanOptions = [
    { type: "Balanced", calories: [1700, 1900, 2100, 2300, 2500, 2700, 2900, 3100] },
    { type: "Low Carb", id_prefix: "Low_Carb", calories: [1700, 1900, 2100, 2300, 2500, 2700, 2900, 3100] },
    { type: "Low Sodium", id_prefix: "Low_Sodium", calories: [1700, 1900, 2100, 2300, 2500, 2700, 2900, 3100] },
];

// --- Sub-components for a cleaner layout ---

const DietPlanSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-10 bg-gray-700 rounded-lg w-1/2 mb-3"></div>
        <div className="h-5 bg-gray-700 rounded-lg w-full max-w-3xl mb-12"></div>
        <div className="flex space-x-4 border-b-2 border-gray-700 mb-6">
            <div className="h-10 bg-gray-700 rounded-t-lg w-20"></div>
            <div className="h-10 bg-gray-800 rounded-t-lg w-20"></div>
            <div className="h-10 bg-gray-800 rounded-t-lg w-20"></div>
        </div>
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-800 p-4 rounded-lg">
                    <div className="h-6 bg-gray-700 rounded-lg w-1/4 mb-3"></div>
                    <div className="h-4 bg-gray-600 rounded-lg w-3/4"></div>
                </div>
            ))}
        </div>
    </div>
);

const MealCard = ({ meal }: { meal: Meal }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800/80 p-5 rounded-xl border border-gray-700/50"
    >
        <div className="flex justify-between items-center">
            <h4 className="text-xl font-bold text-green-400">{meal.name}</h4>
            <span className="font-semibold text-white bg-gray-700 px-3 py-1 rounded-full text-sm">~{meal.approx_kcal} kcal</span>
        </div>
        <p className="text-gray-300 mt-2">{meal.description}</p>
        <div className="mt-4">
            <h5 className="font-semibold text-gray-200">Ingredients:</h5>
            <ul className="list-disc list-inside text-gray-400 mt-1 pl-2">
                {meal.ingredients.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </div>
        {meal.alternatives && meal.alternatives.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-700">
                <h5 className="font-semibold text-gray-200">Alternatives:</h5>
                <ul className="list-disc list-inside text-gray-400 mt-1 pl-2 text-sm">
                    {meal.alternatives.map((alt, i) => (
                        <li key={i}>{alt.name} (~{alt.approx_kcal} kcal)</li>
                    ))}
                </ul>
            </div>
        )}
    </motion.div>
);


// --- Main Page Component ---
export default function DietsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("Balanced_1700");
  const [planData, setPlanData] = useState<DietPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<number>(1);

  useEffect(() => {
    if (!selectedPlan) return;
    const fetchPlanDetails = async () => {
      setIsLoading(true);
      setError(null);
      setTimeout(async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/v1/diet-plan/${selectedPlan}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch '${selectedPlan}'. Please try again.`);
          }
          const data: DietPlan = await response.json();
          setPlanData(data);
          setActiveDay(1); // Reset to day 1 on new plan load
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

  const activeDayMeals = planData?.days.find(d => d.day === activeDay)?.meals;

  return (
    <div className="p-8 md:p-12 min-h-screen pb-40">
      <AnimatePresence mode="wait">
        {isLoading && <motion.div key="loader" {...FADE_IN_OUT_VARIANTS}><DietPlanSkeleton /></motion.div>}
        {error && (
          <motion.div key="error" {...FADE_IN_OUT_VARIANTS} className="text-center bg-red-900/50 text-red-300 p-6 rounded-lg border border-red-700">
            <h3 className="font-bold text-xl mb-2">Something went wrong</h3>
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}
        {planData && !isLoading && (
          <motion.div key={selectedPlan} {...FADE_IN_OUT_VARIANTS}>
            {/* --- Plan Header --- */}
            <div>
              <span className="capitalize text-sm font-semibold bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">{planData.diet_type}</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3">{selectedPlan.replace(/_/g, " ")}</h2>
              
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-bold text-white flex items-center gap-2"><HeartIcon className="h-5 w-5 text-pink-400"/> Daily Targets</h3>
                    <div className="mt-2 text-sm text-gray-300 flex justify-around">
                        <span><strong className="text-white">{planData.calorie_range}</strong> kcal</span>
                        <span><strong className="text-white">{planData.macro_targets.protein_g}g</strong> Protein</span>
                        <span><strong className="text-white">{planData.macro_targets.carbs_g}g</strong> Carbs</span>
                        <span><strong className="text-white">{planData.macro_targets.fat_g}g</strong> Fat</span>
                    </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-bold text-white flex items-center gap-2"><BookOpenIcon className="h-5 w-5 text-orange-400"/>Plan Notes</h3>
                    <p className="text-sm text-gray-300 mt-2">{planData.notes}</p>
                </div>
              </div>
            </div>

            {/* --- Day Tabs --- */}
            <div className="mt-10">
                <div className="border-b border-gray-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {planData.days.map((day) => (
                            <button
                                key={day.day}
                                onClick={() => setActiveDay(day.day)}
                                className={`${
                                    activeDay === day.day
                                    ? 'border-green-400 text-green-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
                            >
                                Day {day.day}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* --- Meals Display --- */}
            <div className="mt-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeDay}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        {activeDayMeals ? (
                            activeDayMeals.map(meal => <MealCard key={meal.name} meal={meal} />)
                        ) : (
                            <p>No meals found for this day.</p>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Dropdown Selection Menu --- */}
      <div className="fixed top-0 right-0 w-full max-w-md p-4">
        <div className="relative bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-700">
          <label htmlFor="plan-select" className="block text-sm font-medium text-white mb-2 text-center">Change Diet Plan</label>
          <select id="plan-select" value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}
            className="w-full appearance-none bg-gray-800 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500">
            {dietPlanOptions.map((group) => (
                <optgroup key={group.type} label={group.type}>
                    {group.calories.map(cal => {
                        const id = `${group.id_prefix || group.type}_${cal}`;
                        return <option key={id} value={id}>{cal} kcal</option>
                    })}
                </optgroup>
            ))}
          </select>
          <ChevronDownIcon className="h-6 w-6 text-gray-400 absolute right-7 top-[60px] pointer-events-none"/>
        </div>
      </div>
    </div>
  );
}