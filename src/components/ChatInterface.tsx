"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaperAirplaneIcon, LinkIcon } from "@heroicons/react/24/solid";
import { BiLoaderAlt } from "react-icons/bi";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { TbWaveSine } from "react-icons/tb";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date; // Make timestamp required, not optional
  sources?: string[];
  status?: string; // Add status property as optional
}

interface ChatInterfaceProps {
  initialMessages?: Partial<ChatMessage>[]; // Make initial messages partial to allow missing fields
}

const defaultInitialMessages: Partial<ChatMessage>[] = [
  {
    role: "assistant",
    content:
      "👋 Hello! I'm your AI Health Assistant. How can I help you today?",
    timestamp: new Date(),
  },
  {
    role: "assistant",
    content: `I specialize in:
• 💪 Personalized workout plans
• 🥗 Nutrition advice
• 🏃‍♂️ Fitness guidance
• 🎯 Goal setting
• ❓ Health-related questions`,
    timestamp: new Date(),
  },
  {
    role: "assistant",
    content: `Try asking me:
• "What's a good workout for beginners?"
• "How can I improve my diet?"
• "What exercises help with weight loss?"
• "Can you explain proper workout form?"`,
    timestamp: new Date(),
  },
];

export default function ChatInterface({
  initialMessages = defaultInitialMessages,
}: ChatInterfaceProps) {
  // Transform initial messages to include required fields
  const formattedInitialMessages: ChatMessage[] = initialMessages.map(
    (msg) => ({
      id: Math.random().toString(36).slice(2),
      role: msg.role || "assistant",
      content: msg.content || "",
      timestamp: msg.timestamp || new Date(),
      sources: msg.sources,
    })
  );

  const [messages, setMessages] = useState<ChatMessage[]>(
    formattedInitialMessages
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript.trim() + " " + interimTranscript);
      setInput(finalTranscript.trim() + " " + interimTranscript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      stopRecording();
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    setTranscript("");
    recognitionRef.current?.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognitionRef.current?.stop();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Clear both input and transcript, and stop recording if active
    setInput("");
    setTranscript("");
    if (isRecording) {
      stopRecording();
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(), // Always set timestamp
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/rag/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage.content,
          top_k: 3,
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(), // Always set timestamp
        status: data.status,
        sources: Array.isArray(data.source)
          ? data.source
          : data.source === "none"
          ? undefined
          : data.source === "Knowledge Base"
          ? ["Knowledge Base"]
          : [data.source],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
        timestamp: new Date(), // Always set timestamp
        status: "error",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === "user"
                    ? "bg-green-600/90 text-white rounded-tr-sm"
                    : "bg-gray-800/90 text-gray-100 rounded-tl-sm border border-gray-700"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>

                {/* Sources Section */}
                {message.sources &&
                  message.sources.length > 0 &&
                  message.sources[0] !== "Knowledge Base" && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        Sources:
                      </p>
                      <div className="space-y-1">
                        {message.sources.map((source, index) => (
                          <a
                            key={index}
                            href={source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-400 hover:text-blue-300 truncate"
                          >
                            {source}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Knowledge Base indicator */}
                {message.sources?.includes("Knowledge Base") && (
                  <p className="mt-2 text-sm text-gray-400 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Source: Knowledge Base
                  </p>
                )}

                <span className="text-xs text-gray-400 mt-2 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800/90 rounded-2xl rounded-tl-sm p-4 border border-gray-700 flex items-center gap-3">
              <BiLoaderAlt className="animate-spin text-green-400" size={20} />
              <span className="text-gray-400">AI is thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Real-time transcript display */}
      <AnimatePresence>
        {isRecording && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-4 py-2 bg-gray-800/90 border-t border-gray-700"
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TbWaveSine className="text-green-400 animate-pulse" />
              <span>{transcript}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area with Voice Button */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-700 bg-gray-800"
      >
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything about fitness..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none overflow-x-auto whitespace-nowrap"
              style={{
                height: "50px",
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE/Edge
              }}
            />
            {/* Voice Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-3 rounded-lg flex items-center justify-center transition-colors ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {isRecording ? (
                <FaStop className="h-4 w-4 text-white" />
              ) : (
                <FaMicrophone className="h-4 w-4 text-gray-300" />
              )}
            </motion.button>
          </div>

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || (!input.trim() && !transcript)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Recording Indicator */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="mt-2 flex items-center gap-2 text-sm text-gray-400"
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse delay-200"></div>
              </div>
              <span>Listening...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
