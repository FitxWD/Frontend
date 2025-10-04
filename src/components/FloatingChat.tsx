"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import ChatInterface from "./ChatInterface";
import { usePathname } from "next/navigation";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const pathname = usePathname();

  // Show tooltip after delay and hide after some time
  useEffect(() => {
    const tooltipTimer = setTimeout(() => setShowTooltip(true), 2000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
    return () => {
      clearTimeout(tooltipTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Don't show on the chat page
  if (pathname === "/chat") {
    return null;
  }

  return (
    <>
      {/* Floating button and tooltip container */}
      <div
        className="fixed bottom-6 right-6 z-50"
        style={{
          right: "calc(1.5rem + var(128px))",
        }}
      >
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full right-0 mb-4 bg-gray-800/90 backdrop-blur-sm text-white rounded-lg p-3 text-sm whitespace-nowrap shadow-lg border border-gray-700"
            >
              <div className="relative">
                Need help? Chat with your AI Health Assistant! 👋
                <div
                  className="absolute -bottom-2 right-4 w-0 h-0 
                              border-l-[8px] border-l-transparent
                              border-t-[8px] border-t-gray-800
                              border-r-[8px] border-r-transparent"
                ></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className={`bg-green-500 text-white p-4 rounded-full shadow-lg ${
            isOpen ? "hidden" : "flex"
          } hover:bg-green-600 transition-colors`}
        >
          <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
              style={{
                marginLeft: "var(256px)",
              }}
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] md:w-[400px] bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col"
              style={{
                right: "calc(1.5rem + var(128px))",
                height: "min(600px, calc(100vh - 100px))",
              }}
            >
              {/* Fixed Header */}
              <div className="bg-gray-800/90 backdrop-blur-sm p-4 flex items-center justify-between border-b border-gray-700 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                    <UserCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">
                      AI Health Assistant
                    </h3>
                    <p className="text-sm text-gray-400">Always here to help</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Scrollable Chat Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <ChatInterface />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
