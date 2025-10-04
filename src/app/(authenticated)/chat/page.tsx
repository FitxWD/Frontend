"use client";

import ChatInterface from "@/components/ChatInterface";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <div className="flex-none pl-12 pt-4 md:pt-6 md:pb-2 bg-gray-900 border-b border-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl lg:text-4xl font-bold text-white mt-3">
            Health Chat Assistant
          </h3>
            <p className="mt-2 text-sm text-gray-400 flex gap-2">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-400" />
              Ask questions about fitness, nutrition, and general health. Get
              personalized responses backed by reliable sources.
            </p>
        </motion.div>
      </div>

      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-hidden relative">
        <ChatInterface />
      </div>
    </div>
  );
}
