"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { FaMicrophone, FaWpforms, FaUtensils, FaDumbbell } from "react-icons/fa";
import VoiceAssistant from "@/components/VoiceAssistant";
import PlanForm from "@/components/PlanForm";

export default function GeneratePlanPage() {
  const [showPlanTypeModal, setShowPlanTypeModal] = useState(true);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      {/* Main content that will show once an option is selected */}
      {selectedOption === "voice" ? (
        <VoiceAssistant planType={selectedPlanType} />
      ) : selectedOption === "form" ? (
        <PlanForm 
          planType={selectedPlanType}
          onBack={() => {
            setSelectedOption(null);
            setShowMethodModal(true);
          }}
          onChangePlanType={() => {
            setSelectedOption(null);
            setSelectedPlanType(null);
            setShowMethodModal(false);
            setShowPlanTypeModal(true);
          }}
        />
      ) : (
        <div className="p-8">
          <h1 className="text-3xl font-bold">Generate Your Plan</h1>
          <p className="mt-2 text-gray-400">Please choose a plan type to continue.</p>
        </div>
      )}

      {/* Plan Type Selection Modal */}
      <AnimatePresence>
        {showPlanTypeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Choose Your Plan Type</h2>
                <Link href="/dashboard">
                  <button className="text-gray-400 hover:text-white">
                    <IoMdClose className="w-6 h-6" />
                  </button>
                </Link>
              </div>

              <p className="text-gray-300 mb-8">
                What type of plan would you like to create?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Diet Plan Option */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelectedPlanType("diet");
                    setShowPlanTypeModal(false);
                    setShowMethodModal(true);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-xl flex flex-col items-center text-center transition-colors"
                >
                  <FaUtensils className="w-12 h-12 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Diet Plan</h3>
                  <p className="text-sm opacity-90">
                    Create a personalized nutrition and meal plan
                  </p>
                </motion.button>

                {/* Fitness Plan Option */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelectedPlanType("fitness");
                    setShowPlanTypeModal(false);
                    setShowMethodModal(true);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-6 rounded-xl flex flex-col items-center text-center transition-colors"
                >
                  <FaDumbbell className="w-12 h-12 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Fitness Plan</h3>
                  <p className="text-sm opacity-90">
                    Design a workout routine tailored to your goals
                  </p>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Method Selection Modal */}
      <AnimatePresence>
        {showMethodModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Choose Your Method</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setShowMethodModal(false);
                      setShowPlanTypeModal(true);
                    }}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Back
                  </button>
                  <Link href="/dashboard">
                    <button className="text-gray-400 hover:text-white">
                      <IoMdClose className="w-6 h-6" />
                    </button>
                  </Link>
                </div>
              </div>

              <p className="text-gray-300 mb-2">
                How would you like to create your {selectedPlanType} plan?
              </p>
              <p className="text-sm text-gray-400 mb-8">
                Selected: {selectedPlanType === "diet" ? "Diet Plan" : "Fitness Plan"}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Voice Assistant Option */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelectedOption("voice");
                    setShowMethodModal(false);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-xl flex flex-col items-center text-center transition-colors"
                >
                  <FaMicrophone className="w-12 h-12 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Voice Assistant</h3>
                  <p className="text-sm opacity-90">
                    Talk naturally with our AI to create your plan through conversation
                  </p>
                </motion.button>

                {/* Form Option */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelectedOption("form");
                    setShowMethodModal(false);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-6 rounded-xl flex flex-col items-center text-center transition-colors"
                >
                  <FaWpforms className="w-12 h-12 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Fill Out Form</h3>
                  <p className="text-sm opacity-90">
                    Complete a structured questionnaire about your goals and preferences
                  </p>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}