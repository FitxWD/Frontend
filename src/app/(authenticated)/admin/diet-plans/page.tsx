"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import {
  ArrowUturnLeftIcon, TrashIcon, PlusIcon, ChevronDownIcon, ArrowDownTrayIcon,
  InformationCircleIcon, SparklesIcon
} from "@heroicons/react/24/solid";
import Link from "next/link";
// We can reuse the EditableSection component from the workout editor
import EditableSection from "../workout-plans/EditableSection"; 

// --- Types (from your view page) ---
interface MacroTargets { carbs_g: number; protein_g: number; fat_g: number; }
interface AlternativeMeal { name: string; approx_kcal: number; }
interface Meal { name: string; description: string; ingredients: string[]; approx_kcal: number; alternatives: AlternativeMeal[]; }
interface DailyDiet { day: number; meals: Meal[]; }
interface DietPlan {
  diet_type: string; calorie_range: string; macro_targets: MacroTargets;
  notes: string; days: DailyDiet[];
}

// --- Hardcoded list of plans (from your view page) ---
const dietPlanOptions = [
    { type: "Balanced", calories: [1700, 1900, 2100, 2300, 2500, 2700, 2900, 3100] },
    { type: "Low Carb", id_prefix: "Low_Carb", calories: [1700, 1900, 2100, 2300, 2500, 2700, 2900, 3100] },
    { type: "Low Sodium", id_prefix: "Low_Sodium", calories: [1700, 1900, 2100, 2300, 2500, 2700, 2900, 3100] },
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

// Define the EditableStringListProps interface
interface EditableStringListProps {
    items: string[];
    onUpdate: (listName: string, index?: number, value?: string) => void;
    listName: string;
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

// --- Main Edit Page Component ---
export default function EditDietPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [selectedPlanId, setSelectedPlanId] = useState<string>("Balanced_1700");
    const [planData, setPlanData] = useState<DietPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<string | number>('core');

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
                const response = await fetch(`http://localhost:8000/api/v1/diet-plan/${selectedPlanId}`);
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
    const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: keyof MacroTargets) => {
        const { name, value } = e.target;
        setPlanData(prev => {
            if (!prev) return null;
            const newPlan = structuredClone(prev);
            if (field) {
                (newPlan.macro_targets as any)[field] = parseInt(value) || 0;
            } else {
                (newPlan as any)[name] = value;
            }
            return newPlan;
        });
    };

    const handleMealChange = (dayIndex: number, mealIndex: number, field: keyof Meal, value: any) => {
        setPlanData(prev => {
            if (!prev) return null;
            const newPlan = structuredClone(prev);
            (newPlan.days[dayIndex].meals[mealIndex] as any)[field] = value;
            return newPlan;
        });
    };
    
    const handleMealStringListUpdate = (dayIndex: number, mealIndex: number, listName: 'ingredients', itemIndex?: number, value?: string) => {
        setPlanData(prev => {
            if (!prev) return null;
            const newPlan = structuredClone(prev);
            const list = newPlan.days[dayIndex].meals[mealIndex][listName];
            
            if (itemIndex !== undefined && value !== undefined) {
                list[itemIndex] = value; // Update
            } else if (itemIndex !== undefined && value === undefined) {
                list.splice(itemIndex, 1); // Delete
            } else {
                list.push(''); // Add
            }
            return newPlan;
        });
    };

    const handleAlternativeUpdate = (dayIndex: number, mealIndex: number, altIndex?: number, field?: keyof AlternativeMeal, value?: string | number) => {
        setPlanData(prev => {
            if (!prev) return null;
            const newPlan = structuredClone(prev);
            const alternatives = newPlan.days[dayIndex].meals[mealIndex].alternatives;

            if (altIndex !== undefined && field && value !== undefined) {
                // Update a specific field of an alternative
                (alternatives[altIndex] as any)[field] = value;
            } else if (altIndex !== undefined && !field) {
                // Delete an alternative
                alternatives.splice(altIndex, 1);
            } else {
                // Add a new, blank alternative
                alternatives.push({ name: '', approx_kcal: 0 });
            }
            return newPlan;
        });
    };

    const handleSave = async () => {
        if (!planData || !selectedPlanId) return;
        setIsSaving(true);
        const toastId = toast.loading("Saving changes...");

        const updatePayload = {
            macro_targets: planData.macro_targets,
            notes: planData.notes,
            days: planData.days,
        };

        try {
            const token = await user?.getIdToken();
            const response = await fetch(`http://localhost:8000/api/v1/admin/diet-plan/${selectedPlanId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                // Send the curated payload, not the whole planData object
                body: JSON.stringify(updatePayload)
            });

            if (!response.ok) {
                // Try to parse the error for a more specific message
                let errorDetail = "Failed to save plan.";
                try {
                    const errorJson = await response.json();
                    errorDetail = errorJson.detail || errorDetail;
                } catch (e) {
                    // Ignore if response is not JSON
                }
                throw new Error(errorDetail);
            }
            
            toast.success("Plan updated successfully!", { id: toastId });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "An error occurred.", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [{ id: 'core', label: 'Core Details' }, ...(planData?.days.map(d => ({ id: d.day, label: `Day ${d.day}` })) || [])];

    return (
        <div className="p-8 md:p-12 min-h-screen">
            <Toaster position="top-center" />
            
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-4xl lg:text-4xl font-bold text-white">Diet Plan Editor</h2>
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
                <select value={selectedPlanId} onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full appearance-none bg-gray-800 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500">
                    {dietPlanOptions.map((group) => (
                        <optgroup key={group.type} label={group.type}>
                            {group.calories.map((cal) => {
                                const id = `${group.id_prefix || group.type}_${cal}`;
                                return <option key={id} value={id}>{cal} kcal</option>;
                            })}
                        </optgroup>
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
                        <div className="mb-8 p-2 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center gap-2 overflow-x-auto">
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                        activeTab === tab.id ? "bg-green-500/20 text-green-400" : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                                    }`}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
                                {activeTab === 'core' && (
                                    <EditableSection title="Core Details & Macro Targets">
                                        <div className="space-y-4">
                                            <EditableField label="Plan Notes" name="notes" value={planData.notes} onChange={handleSimpleChange} type="textarea" />
                                            <div className="grid grid-cols-3 gap-4">
                                                <EditableField label="Protein (g)" name="protein_g" value={planData.macro_targets.protein_g} onChange={e => handleSimpleChange(e, 'protein_g')} type="number" />
                                                <EditableField label="Carbs (g)" name="carbs_g" value={planData.macro_targets.carbs_g} onChange={e => handleSimpleChange(e, 'carbs_g')} type="number" />
                                                <EditableField label="Fat (g)" name="fat_g" value={planData.macro_targets.fat_g} onChange={e => handleSimpleChange(e, 'fat_g')} type="number" />
                                            </div>
                                        </div>
                                    </EditableSection>
                                )}
                                
                                {planData.days.map((day, dayIndex) => (
                                    activeTab === day.day && (
                                        <EditableSection key={day.day} title={`Day ${day.day} Meals`}>
                                            <div className="space-y-4">
                                                {day.meals.map((meal, mealIndex) => (
                                                    <div key={mealIndex} className="bg-gray-900 p-4 rounded-lg space-y-2">
                                                        <EditableField label="Meal Name" name="name" value={meal.name} 
                                                            onChange={e => handleMealChange(dayIndex, mealIndex, 'name', e.target.value)} />
                                                        <EditableField label="Description" name="description" value={meal.description} type="textarea"
                                                            onChange={e => handleMealChange(dayIndex, mealIndex, 'description', e.target.value)} />
                                                        <EditableField label="Approx. Kcal" name="approx_kcal" value={meal.approx_kcal} type="number"
                                                            onChange={e => handleMealChange(dayIndex, mealIndex, 'approx_kcal', parseInt(e.target.value) || 0)} />
                                                        <div className="pt-4 border-t border-gray-700">
                                                            <h4 className="font-semibold text-gray-300 mb-2">Ingredients</h4>
                                                            <EditableStringList
                                                                items={meal.ingredients}
                                                                listName="ingredients"
                                                                onUpdate={(listName, itemIndex, value) => handleMealStringListUpdate(dayIndex, mealIndex, 'ingredients', itemIndex, value)}
                                                            />
                                                        </div>
                                                        <div className="pt-4 border-t border-gray-700">
                                                            <h4 className="font-semibold text-gray-300 mb-2">Alternatives</h4>
                                                            <div className="space-y-3">
                                                                {meal.alternatives.map((alt, altIndex) => (
                                                                    <div key={altIndex} className="flex items-end gap-2 p-3 bg-gray-800 rounded-lg">
                                                                        <div className="flex-grow">
                                                                            <EditableField label="Name" name="name" value={alt.name} onChange={e => handleAlternativeUpdate(dayIndex, mealIndex, altIndex, 'name', e.target.value)} />
                                                                        </div>
                                                                        <div className="w-32">
                                                                            <EditableField label="Approx. Kcal" name="approx_kcal" value={alt.approx_kcal} type="number" onChange={e => handleAlternativeUpdate(dayIndex, mealIndex, altIndex, 'approx_kcal', parseInt(e.target.value) || 0)} />
                                                                        </div>
                                                                        <button onClick={() => handleAlternativeUpdate(dayIndex, mealIndex, altIndex)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-md h-10">
                                                                            <TrashIcon className="h-5 w-5 text-red-400"/>
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                <button onClick={() => handleAlternativeUpdate(dayIndex, mealIndex)} className="flex items-center gap-2 text-sm text-green-400 font-semibold mt-2">
                                                                    <PlusIcon className="h-4 w-4"/> Add Alternative
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button className="flex items-center gap-2 text-sm text-green-400 font-semibold mt-4">
                                                    <PlusIcon className="h-4 w-4"/> Add Meal to Day {day.day}
                                                </button>
                                            </div>
                                        </EditableSection>
                                    )
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}