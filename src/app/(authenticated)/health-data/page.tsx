"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function HealthDataPage() {
  const router = useRouter();
  const [form, setForm] = useState({ gender: "", age: "", weight: "", height: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in. Please sign in again.");
      const token = await user.getIdToken();

      const res = await fetch("http://127.0.0.1:8000/api/v1/profile-health-update", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          healthData: {
            gender: form.gender,
            age: form.age ? parseInt(form.age, 10) : undefined,
            weight: form.weight ? parseFloat(form.weight) : undefined,
            height: form.height ? parseFloat(form.height) : undefined,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save health data");
      }

      // On success, maybe redirect to a chat interface or the dashboard
      router.replace("/dashboard");

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 text-gray-200 flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-12 md:py-24 flex items-center">
        <div className="grid md:grid-cols-2 gap-16 items-center w-full">

          {/* Left Column: Decorative Image & Text */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden md:block relative w-full h-[550px] rounded-2xl overflow-hidden"
          >
            <Image
              src="/hero-ai.png" // IMPORTANT: Add a relevant image here
              alt="Fitness data visualization"
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <h2 className="text-4xl font-bold leading-tight">The First Step to a<br/>Smarter Plan.</h2>
              <p className="text-lg mt-3 text-gray-300 max-w-md">
                Your answers help our AI understand your body's unique needs to craft the perfect plan.
              </p>
            </div>
          </motion.div>

          {/* Right Column: The Form */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="bg-gray-800 shadow-2xl rounded-2xl p-8 md:p-12 w-full"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Tell Us About You
            </h1>
            <p className="text-gray-400 mb-8">
              Let's get some basics to personalize your experience.
            </p>

            <form className="space-y-6" onSubmit={onSubmit}>
              {/* Form inputs remain the same */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                <select id="gender" required value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 transition">
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                <input id="age" type="number" required value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 transition" placeholder="e.g., 25"/>
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-2">Height (cm)</label>
                <input id="height" type="number" required value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 transition" placeholder="e.g., 175"/>
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
                <input id="weight" type="number" required value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 transition" placeholder="e.g., 70"/>
              </div>

              {error && <p className="text-red-400 text-sm text-center pt-2">{error}</p>}

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit" disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-lg flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-green-500/20"
                >
                  <span>{loading ? "Saving Profile..." : "Save & Continue"}</span>
                  {!loading && <ArrowRightIcon className="h-5 w-5"/>}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}