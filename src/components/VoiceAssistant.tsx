"use client";
import { useState, useEffect, useRef } from "react";
import {
  FaMicrophone,
  FaStop,
  FaTrash,
  FaRobot,
  FaArrowLeft,
  FaPaperPlane,
} from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { TbWaveSine } from "react-icons/tb";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext"; // Add this import

// Add global type for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Define a type for conversation entries
type ConversationEntry = {
  id: number;
  userText: string;
  assistantReply: string;
  timestamp: Date;
};

// Define props interface
interface VoiceAssistantProps {
  planType?: string | null;
}

export default function VoiceAssistant({ planType }: VoiceAssistantProps) {
  const { user } = useAuth(); // Add this line
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    ConversationEntry[]
  >([]);
  const [realtimeTranscript, setRealtimeTranscript] = useState("");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reference to the SpeechRecognition object
  const recognitionRef = useRef<any>(null);
  const continuousRecognitionRef = useRef<any>(null);

  // Set a constant for playback speed internally
  const PLAYBACK_SPEED = 1;

  // Dynamic title based on plan type
  const getTitle = () => {
    if (planType === "diet") return "AI Nutrition Assistant";
    if (planType === "fitness") return "AI Fitness Assistant";
    return "AI Wellness Assistant";
  };

  const getSubtitle = () => {
    if (planType === "diet") return "Tell me about your nutrition goals";
    if (planType === "fitness") return "Tell me about your fitness goals";
    return "Tell me about your wellness goals";
  };

  // Scroll to bottom when conversation history changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory, realtimeTranscript]);

  // Timer for recording duration
  useEffect(() => {
    if (recording) {
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recording]);

  // Initialize speech recognition on component mount
  useEffect(() => {
    // Browser compatibility check for SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      return;
    }

    // Initialize speech recognition
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    // Handle results - completely rewritten to prevent duplication
    recognitionRef.current.onresult = (event: any) => {
      // Create a full transcript from all results
      let finalTranscript = "";
      let interimTranscript = "";

      // Process all results from the beginning
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Update the state with the combined transcript
      setRealtimeTranscript(finalTranscript.trim() + " " + interimTranscript);
    };

    // Handle errors
    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
    };

    // Clean up on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Continuous recognition for real-time transcript
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      return;
    }

    continuousRecognitionRef.current = new SpeechRecognition();
    continuousRecognitionRef.current.continuous = false;
    continuousRecognitionRef.current.interimResults = false;
    continuousRecognitionRef.current.lang = "en-US";
    continuousRecognitionRef.current.maxAlternatives = 1;

    continuousRecognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setRealtimeTranscript((prev) =>
        prev ? `${prev} ${transcript}` : transcript
      );

      // Restart for the next phrase
      continuousRecognitionRef.current.start();
    };

    continuousRecognitionRef.current.onend = () => {
      if (recording) {
        // Restart if we're still recording
        continuousRecognitionRef.current.start();
      }
    };

    // Clean up on unmount
    return () => {
      if (continuousRecognitionRef.current) {
        continuousRecognitionRef.current.stop();
      }
    };
  }, [recording]);

  const startRecording = async () => {
    try {
      // Clear previous transcript when starting new recording
      setRealtimeTranscript("");

      // Start speech recognition for real-time display
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      // Start audio recording for backend processing
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = async () => {
        // Stop speech recognition when recording stops
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }

        setLoading(true);
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        
        try {
          // Check if user is authenticated
          if (!user) {
            throw new Error("User not authenticated");
          }

          // Get user ID and token
          const token = await user.getIdToken();
          const userId = user.uid;

          const formData = new FormData();
          formData.append("file", audioBlob, "audio.wav");
          formData.append("planType", planType || "diet");
          formData.append("user_id", userId); // Add user_id

          const res = await fetch("http://localhost:8000/api/v1/assistant", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`, // Add auth header
            },
            body: formData,
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ detail: "Network error" }));
            throw new Error(errorData.detail || `HTTP ${res.status}: ${res.statusText}`);
          }

          const data = await res.json();

          // Add the new conversation to the history
          setConversationHistory((prevHistory) => [
            ...prevHistory,
            {
              id: Date.now(),
              userText: data.user_text || realtimeTranscript || "Audio input",
              assistantReply:
                data.reply || "I'm working on a response for you.",
              timestamp: new Date(),
            },
          ]);

          // Play reply audio with fixed speed
          if (data.audio_base64) {
            const audio = new Audio(
              "data:audio/mp3;base64," + data.audio_base64
            );
            audio.playbackRate = PLAYBACK_SPEED;
            audio.play();
          }
        } catch (error) {
          console.error("Error:", error);
          // Add error message to conversation
          setConversationHistory((prevHistory) => [
            ...prevHistory,
            {
              id: Date.now(),
              userText: realtimeTranscript || "Audio input",
              assistantReply:
                `Sorry, there was an error: ${error instanceof Error ? error.message : "Please try again."}`,
              timestamp: new Date(),
            },
          ]);
        } finally {
          setLoading(false);
          setRealtimeTranscript(""); // Clear real-time transcript after processing
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Stop media recorder
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    setRecording(false);
  };

  const clearConversation = () => {
    setConversationHistory([]);
  };

  // Format timestamp to readable time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date for message groups
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  // Format recording duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Group messages by date
  const getMessageDate = (timestamp: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (timestamp.toDateString() === today.toDateString()) {
      return "Today";
    } else if (timestamp.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return formatDate(timestamp);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-200 font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center shadow-md">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mr-3 shadow-lg">
            <FaRobot className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">
              {getTitle()}
            </h1>
            <p className="text-xs text-gray-400">
              {getSubtitle()}
            </p>
          </div>
        </div>
      </div>

      {/* Conversation Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        style={{
          backgroundImage: "url('/chat-bg-dark.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Welcome message */}
        {conversationHistory.length === 0 && !realtimeTranscript && (
          <div className="flex justify-center my-10">
            <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl max-w-md border border-gray-700">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mx-auto mb-4">
                <FaRobot className="text-white text-2xl" />
              </div>
              <h2 className="text-xl font-medium text-center mb-3">
                Welcome to {getTitle()}
              </h2>
              <p className="text-gray-400 text-center text-sm mb-4">
                {planType === "diet" 
                  ? "Tell me about your nutrition goals, dietary preferences, and health conditions. I'll create a personalized diet plan just for you."
                  : planType === "fitness"
                  ? "Tell me about your fitness goals, preferences, and lifestyle. I'll create a personalized workout plan just for you."
                  : "Tell me about your wellness goals and preferences. I'll create a personalized plan just for you."
                }
              </p>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startRecording}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition flex items-center gap-2 shadow-lg shadow-green-600/20"
                >
                  <FaMicrophone className="text-lg" /> Start Talking
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* Group messages by date */}
        {conversationHistory.length > 0 && (
          <>
            {Array.from(
              new Set(
                conversationHistory.map((entry) =>
                  getMessageDate(entry.timestamp)
                )
              )
            ).map((date) => (
              <div key={date} className="space-y-3">
                <div className="flex justify-center my-2">
                  <div className="bg-gray-800/80 px-3 py-1 rounded-full text-xs text-gray-400">
                    {date}
                  </div>
                </div>

                {conversationHistory
                  .filter((entry) => getMessageDate(entry.timestamp) === date)
                  .map((entry) => (
                    <div key={entry.id} className="space-y-3">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="max-w-[80%] bg-green-600/90 rounded-2xl rounded-tr-sm p-3 shadow-lg"
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="text-white">{entry.userText}</p>
                              <p className="text-right text-xs text-green-200/70 mt-1">
                                {formatTime(entry.timestamp)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Assistant Message */}
                      <div className="flex">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="max-w-[80%] bg-gray-800/90 rounded-2xl rounded-tl-sm p-3 shadow-lg border border-gray-700"
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="text-white">
                                {entry.assistantReply}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatTime(entry.timestamp)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </>
        )}

        {/* Real-time transcript as typing indicator */}
        {recording && realtimeTranscript && (
          <div className="flex justify-end">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[80%] bg-green-600/80 rounded-2xl rounded-tr-sm p-3 shadow-lg"
            >
              <p className="text-white">{realtimeTranscript}</p>
              <div className="flex justify-between items-center mt-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse delay-200"></div>
                </div>
                <div className="text-xs text-green-200/70">Listening...</div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[80%] bg-gray-800/90 rounded-2xl rounded-tl-sm p-4 shadow-lg border border-gray-700"
            >
              <div className="flex space-x-3 items-center">
                <BiLoaderAlt className="animate-spin text-green-400 text-xl" />
                <p className="text-gray-300 text-sm">
                  Processing your audio...
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Action Toolbar with both Clear and Record buttons */}
      <div className="p-3 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-center items-center gap-4">
          {conversationHistory.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearConversation}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-200 px-4 py-2 rounded-full text-sm transition"
            >
              <FaTrash size={14} /> Clear Conversation
            </motion.button>
          )}

          {/* Recording button now placed in the toolbar */}
          {!recording ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
                loading
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <FaMicrophone size={16} />{" "}
              {recording ? "Recording..." : "Start Recording"}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm transition"
            >
              <FaStop size={14} /> Stop Recording
            </motion.button>
          )}
        </div>
      </div>

      {/* Fixed Recording Control Panel - only shows when recording */}
      <AnimatePresence>
        {recording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-[calc(50%+128px)] transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm py-3 px-6 rounded-full shadow-xl border border-gray-700 flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <TbWaveSine className="text-green-400 animate-pulse" size={20} />
              <span className="text-sm font-medium text-gray-300">
                {formatDuration(recordingDuration)}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={stopRecording}
              className="bg-red-600 hover:bg-red-700 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all"
            >
              <FaStop size={14} />
            </motion.button>

            <div className="text-xs text-gray-400">Tap to stop recording</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}