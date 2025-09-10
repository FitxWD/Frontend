"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { FaMicrophone, FaWpforms } from "react-icons/fa";
import VoiceAssistant from "@/components/VoiceAssistant";

export default function GeneratePlanPage() {
  const [showModal, setShowModal] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      {/* Main content that will show once an option is selected */}
      {selectedOption === "voice" ? (
        <VoiceAssistant />
      ) : selectedOption === "form" ? (
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Plan Form (Form UI goes here)</h1>
          <button 
            onClick={() => {
              setSelectedOption(null);
              setShowModal(true);
            }}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            Go back to selection
          </button>
        </div>
      ) : (
        <div className="p-8">
          <h1 className="text-3xl font-bold">Generate Your Plan</h1>
          <p className="mt-2 text-gray-400">Please choose an option to continue.</p>
        </div>
      )}

      {/* Modal overlay */}
      <AnimatePresence>
        {showModal && (
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
                <Link href="/dashboard">
                  <button className="text-gray-400 hover:text-white">
                    <IoMdClose className="w-6 h-6" />
                  </button>
                </Link>
              </div>

              <p className="text-gray-300 mb-8">
                How would you like to create your personalized fitness and nutrition plan?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Voice Assistant Option */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelectedOption("voice");
                    setShowModal(false);
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
                    setShowModal(false);
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