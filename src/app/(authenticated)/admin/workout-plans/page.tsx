"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import {
  ArrowUturnLeftIcon, TrashIcon, PlusIcon, ChevronDownIcon, ArrowDownTrayIcon, InformationCircleIcon, CalendarDaysIcon,
  BoltIcon, ArrowTrendingUpIcon, AdjustmentsVerticalIcon
} from "@heroicons/react/24/solid";
import Link from "next/link";
import EditableSection from "./EditableSection";

// --- Types ---
interface Exercise { name: string; duration_min?: number; sets?: number; reps?: string; example?: string; }
interface Session { warmup?: Exercise[]; main: Exercise[]; cooldown?: Exercise[]; safety?: string[]; }
interface DailyTemplate { day: string; sessions: Session[]; }
interface MicroWorkout { name: string; duration_min: number; example?: string; drills?: string[]; }
interface WorkoutPlan {
  name: string; description: string; level: string; goals?: string[];
  durationMinutes?: number; weekly_template: DailyTemplate[]; micro_workouts: MicroWorkout[];
  progression_4_weeks: string[]; personalization_rules: string[];
}

// --- Hardcoded list of workout plans ---
const workoutPlanOptions = [
  { id: "gentle_start", name: "Gentle Start" },
  { id: "foundation_strength", name: "Foundation Strength" },
  { id: "play_and_perform", name: "Play and Perform" },
  { id: "the_endurance_engine", name: "The Endurance Engine" },
  { id: "the_express_burn", name: "The Express Burn" },
];

// Reusable component for a simple editable text field
const EditableField = ({ label, value, name, onChange, type = 'text', placeholder = '' }: { label: string; value: string | number; name: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; placeholder?: string; }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        {type === 'textarea' ? (
            <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={4}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-green-500" />
        ) : (
            <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-green-500" />
        )}
    </div>
);

interface EditableStringListProps {
    items: string[];
    onUpdate: (listName: keyof WorkoutPlan, index?: number, value?: string) => void;
    listName: keyof WorkoutPlan;
}

const EditableStringList = ({ items, onUpdate, listName }: EditableStringListProps) => (
    <div className="space-y-2">
        {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
                <input type="text" value={item} onChange={(e) => onUpdate(listName, index, e.target.value)}
                    className="flex-grow bg-gray-900 border border-gray-700 rounded-lg p-2 text-white" />
                <button onClick={() => onUpdate(listName, index)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-md">
                    <TrashIcon className="h-5 w-5 text-red-400"/>
                </button>
            </div>
        ))}
        <button onClick={() => onUpdate(listName)} className="flex items-center gap-2 text-sm text-green-400 font-semibold mt-2">
           <PlusIcon className="h-4 w-4"/> Add Item
        </button>
    </div>
);

interface TabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
}

const TabButton = ({ label, isActive, onClick, icon: Icon }: TabButtonProps) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            isActive ? "bg-green-500/20 text-green-400" : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
        }`}
    >
        <Icon className="h-5 w-5" />
        {label}
    </button>
);

// --- Main Edit Page Component ---
export default function EditWorkoutPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [selectedPlanId, setSelectedPlanId] = useState<string>("gentle_start");
    const [planData, setPlanData] = useState<WorkoutPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('core');

    useEffect(() => {
        if (user) {
            user.getIdTokenResult().then(tokenResult => {
                if (!tokenResult.claims.isAdmin) router.push("/dashboard");
            });
        }
        
        if (!selectedPlanId) return;

        const fetchPlanDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/api/v1/workout-plan/${selectedPlanId}`);
                if (!response.ok) throw new Error("Failed to fetch plan details.");
                setPlanData(await response.json());
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(err.message);
                } else {
                    toast.error("An error occurred.");
                }
                setPlanData(null); // Clear data on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlanDetails();
    }, [selectedPlanId, user, router]);

    // --- IMMUTABLE STATE UPDATE HANDLERS ---
    // How it works: structuredClone() creates a deep copy of the plan.
    // We can safely modify the copy and then update the state with the new version.
    // This is the modern, safe way to handle complex nested state in React.

    const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setPlanData(prev => prev ? ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }) : null);
    };

    const handleListUpdate = (listName: keyof WorkoutPlan, index?: number, value?: string) => {
        setPlanData(prev => {
            if (!prev) return null;
            const newPlan = structuredClone(prev);
            const list = newPlan[listName] as string[];
            if (index !== undefined && value === undefined) {
                list.splice(index, 1); // Delete
            } else if (index !== undefined && value !== undefined) {
                list[index] = value; // Update
            } else {
                list.push(''); // Add
            }
            return newPlan;
        });
    };

    const handleMicroWorkoutChange = (index: number, field: keyof MicroWorkout, value: string | number) => {
        setPlanData(prev => {
            if (!prev) return null;
            const newPlan = structuredClone(prev);
            (newPlan.micro_workouts[index] as any)[field] = value;
            return newPlan;
        });
    };

    const handleMicroWorkoutListUpdate = (index?: number) => {
        setPlanData(prev => {
            if (!prev) return null;
            const newPlan = structuredClone(prev);
            if (index !== undefined) {
                newPlan.micro_workouts.splice(index, 1); // Delete
            } else {
                newPlan.micro_workouts.push({ name: '', duration_min: 0, drills: [], example: '' }); // Add
            }
            return newPlan;
        });
    };

    const handleExerciseChange = (dayIndex: number, sessionIndex: number, type: 'warmup' | 'main' | 'cooldown', exIndex: number, field: keyof Exercise, value: string | number) => {
        setPlanData(prev => {
            if (!prev) return null;
            const newPlan = structuredClone(prev);
            (newPlan.weekly_template[dayIndex].sessions[sessionIndex][type]![exIndex] as any)[field] = value;
            return newPlan;
        });
    };
    
    // ... (Add/delete handlers for exercises and safety notes would follow the same structuredClone pattern)

    const handleSave = async () => {
        if (!planData || !selectedPlanId) return;
        setIsSaving(true);
        const toastId = toast.loading("Saving changes...");

        try {
            const token = await user?.getIdToken();
            const response = await fetch(`http://localhost:8000/api/v1/admin/workout-plan/${selectedPlanId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(planData)
            });
            if (!response.ok) throw new Error((await response.json()).detail || "Failed to save plan.");
            toast.success("Plan updated successfully!", { id: toastId });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "An error occurred.", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'core', label: 'Core Details', icon: InformationCircleIcon },
        { id: 'schedule', label: 'Weekly Schedule', icon: CalendarDaysIcon },
        { id: 'micro', label: 'Micro Workouts', icon: BoltIcon },
        { id: 'progression', label: 'Progression', icon: ArrowTrendingUpIcon },
        { id: 'rules', label: 'Personalization', icon: AdjustmentsVerticalIcon },
    ];
    
    return (
        <div className="p-8 md:p-12 min-h-screen">
            <Toaster position="top-center" />
            
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-4xl font-bold text-white">Workout Plan Editor</h2>
                    <p className="text-gray-400 mt-1">Select a plan from the dropdown to begin editing.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleSave} disabled={isSaving || !planData}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed h-10">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
            <div className="max-w-md mb-8 relative">
                <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full appearance-none bg-gray-800 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500"
                >
                    {workoutPlanOptions.map((plan) => (
                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                    ))}
                </select>
                <ChevronDownIcon className="h-6 w-6 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-center p-12 text-gray-400">Loading plan details...
                    </motion.div>
                )}
                {planData && !isLoading && (
                    <motion.div key={selectedPlanId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {/* --- Main Edit Form --- */}
                        <div className="mb-8 p-2 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center gap-2">
                            {tabs.map(tab => (
                                <TabButton
                                    key={tab.id}
                                    label={tab.label}
                                    icon={tab.icon}
                                    isActive={activeTab === tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                />
                            ))}
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                {activeTab === 'core' && (
                                    <>
                                        <EditableSection title="Core Details">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <EditableField label="Description" name="description" value={planData.description} onChange={handleSimpleChange} type="textarea" />
                                                <EditableField label="Duration (Minutes)" name="durationMinutes" value={planData.durationMinutes || ''} onChange={handleSimpleChange} type="number" />
                                            </div>
                                        </EditableSection>
                                        <EditableSection title="Goals">
                                            <EditableStringList items={planData.goals || []} listName="goals" onUpdate={handleListUpdate} />
                                        </EditableSection>
                                    </>
                                )}

                                {activeTab === 'schedule' && (
                                    <EditableSection title="Weekly Schedule">
                                        <div className="space-y-6">
                                            {planData.weekly_template.map((day, dayIndex) => (
                                                <div key={dayIndex} className="bg-gray-900 p-4 rounded-lg">
                                                    <h4 className="text-lg font-bold text-green-400">{day.day}</h4>
                                                    {day.sessions.map((session, sessionIndex) => (
                                                        <div key={sessionIndex} className="mt-2 border-t border-gray-700 pt-2">
                                                            {/* Warmup */}
                                                            <h5 className="font-semibold text-gray-300">Warmup</h5>
                                                            {session.warmup?.map((ex, exIndex) => (
                                                                <div key={exIndex} className="ml-4 my-2 p-2 bg-gray-800 rounded">
                                                                    <EditableField label="Exercise Name" name="name" value={ex.name} onChange={e => handleExerciseChange(dayIndex, sessionIndex, 'warmup', exIndex, 'name', e.target.value)} />
                                                                    {/* Add fields for reps, sets, etc. following the same pattern */}
                                                                </div>
                                                            ))}
                                                            {/* Main */}
                                                            <h5 className="font-semibold text-gray-300 mt-4">Main Workout</h5>
                                                            {session.main.map((ex, exIndex) => (
                                                                <div key={exIndex} className="ml-4 my-2 p-2 bg-gray-800 rounded">
                                                                    <EditableField label="Exercise Name" name="name" value={ex.name} onChange={e => handleExerciseChange(dayIndex, sessionIndex, 'main', exIndex, 'name', e.target.value)} />
                                                                </div>
                                                            ))}
                                                            {/* Cooldown */}
                                                                <h5 className="font-semibold text-gray-300 mt-4">Cooldown</h5>
                                                            {session.cooldown?.map((ex, exIndex) => (
                                                                <div key={exIndex} className="ml-4 my-2 p-2 bg-gray-800 rounded">
                                                                    <EditableField label="Exercise Name" name="name" value={ex.name} onChange={e => handleExerciseChange(dayIndex, sessionIndex, 'cooldown', exIndex, 'name', e.target.value)} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </EditableSection>
                                )}

                                {activeTab === 'micro' && (
                                    <EditableSection title="Micro Workouts">
                                         <div className="space-y-4">
                                            {planData.micro_workouts.map((mw, index) => (
                                                <div key={index} className="bg-gray-900 p-4 rounded-lg space-y-2 relative">
                                                    <button onClick={() => handleMicroWorkoutListUpdate(index)} className="absolute top-2 right-2 p-1 bg-red-500/20 rounded-md">
                                                        <TrashIcon className="h-4 w-4 text-red-400"/>
                                                    </button>
                                                    <EditableField label="Name" name="name" value={mw.name} onChange={e => handleMicroWorkoutChange(index, 'name', e.target.value)} />
                                                    <EditableField label="Duration (min)" name="duration_min" value={mw.duration_min} onChange={e => handleMicroWorkoutChange(index, 'duration_min', parseInt(e.target.value) || 0)} type="number" />
                                                    {/* You can add drills here using another EditableStringList */}
                                                </div>
                                            ))}
                                            <button onClick={() => handleMicroWorkoutListUpdate()} className="flex items-center gap-2 text-sm text-green-400 font-semibold mt-2">
                                            <PlusIcon className="h-4 w-4"/> Add Micro Workout
                                            </button>
                                        </div>
                                    </EditableSection>
                                )}

                                {activeTab === 'progression' && (
                                    <EditableSection title="Progression (4 Weeks)">
                                        <EditableStringList items={planData.progression_4_weeks} listName="progression_4_weeks" onUpdate={handleListUpdate} />
                                    </EditableSection>
                                )}

                                {activeTab === 'rules' && (
                                    <EditableSection title="Personalization Rules">
                                        <EditableStringList items={planData.personalization_rules} listName="personalization_rules" onUpdate={handleListUpdate} />
                                    </EditableSection>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}