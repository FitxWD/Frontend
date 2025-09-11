"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

// Define a type for our form data
type HealthData = {
  name: string;
  age: number | string;
  gender: "male" | "female" | "other" | "";
  height: number | string;
  weight: number | string;
};

// Animation variants
const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};
const formItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthData>({
    name: "User",
    age: "",
    gender: "",
    height: "",
    weight: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch user's health data from backend
  useEffect(() => {
    if (!user) return;

    const fetchHealthData = async () => {
      setIsLoading(true);
      try {
        const token = await user.getIdToken();

        const res = await fetch("http://127.0.0.1:8000/api/v1/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch health data");

        const data = await res.json();
        setHealthData({
        name: user.displayName || "User",
        age: data.healthData?.age || "",
        gender: data.healthData?.gender || "",
        height: data.healthData?.height || "",
        weight: data.healthData?.weight || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch your data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHealthData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Save changes through backend API
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    const toastId = toast.loading("Updating your profile...");

    try {
      const token = await user.getIdToken();

      const res = await fetch("http://127.0.0.1:8000/api/v1/profile-health-update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            healthData: {
                gender: healthData.gender,
                age: healthData.age ? Number(healthData.age) : undefined,
                height: healthData.height ? Number(healthData.height) : undefined,
                weight: healthData.weight ? Number(healthData.weight) : undefined,
            },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update health data");
      }

      toast.success("Profile updated successfully!", { id: toastId });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  // Loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ArrowPathIcon className="h-8 w-8 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* --- DYNAMIC HEADING --- */}
        <h2 className="text-4xl font-bold text-white capitalize">{healthData.name}</h2>
        <p className="text-gray-400 mt-2">
          Keep your health data current for the most accurate AI-generated plans.
        </p>

        <motion.form
          onSubmit={handleSaveChanges}
          className="mt-12 max-w-2xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-lg"
          variants={formContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age */}
            <motion.div variants={formItemVariants}>
              <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                id="age"
                value={healthData.age}
                onChange={handleChange}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-green-500 focus:border-green-500"
              />
            </motion.div>
            {/* Gender */}
            <motion.div variants={formItemVariants}>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={healthData.gender}
                onChange={handleChange}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </motion.div>
            {/* Height */}
            <motion.div variants={formItemVariants}>
              <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                id="height"
                value={healthData.height}
                onChange={handleChange}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-green-500 focus:border-green-500"
              />
            </motion.div>
            {/* Weight */}
            <motion.div variants={formItemVariants}>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                id="weight"
                value={healthData.weight}
                onChange={handleChange}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-green-500 focus:border-green-500"
              />
            </motion.div>
          </div>
          <motion.div className="mt-8" variants={formItemVariants}>
            <motion.button
              type="submit"
              disabled={isUpdating}
              className="w-full md:w-auto px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center origin-left"
              whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 17 } }}
            >
              {isUpdating && <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />}
              {isUpdating ? "Saving..." : "Save Changes"}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}
