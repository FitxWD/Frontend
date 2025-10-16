"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  StarIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

// --- Types to match the API response ---
interface UserInfo {
  uid: string;
  email?: string;
  displayName?: string;
}

interface Feedback {
  id: string;
  user: UserInfo;
  planId: string;
  rating: number;
  text: string;
  createdAt: string;
  status: "new" | "reviewed";
}

// --- Star Rating Component ---
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => (
      <StarIcon
        key={star}
        className={`h-5 w-5 ${
          rating >= star ? "text-yellow-400" : "text-gray-600"
        }`}
      />
    ))}
  </div>
);

// --- Main Admin Feedback Page ---
export default function AdminFeedbackPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filter, setFilter] = useState<"new" | "reviewed">("new");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // --- Client-Side Security Check ---
  // This provides a good UX by redirecting non-admins immediately.
  useEffect(() => {
    if (user) {
      user.getIdTokenResult().then((tokenResult) => {
        if (!tokenResult.claims.isAdmin) {
          toast.error("Access denied. Admin privileges required.");
          router.push("/login"); // Or your app's home page
        }
      });
    }
  }, [user, router]);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const token = await user.getIdToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/feedbacks?status=${filter}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch feedbacks.");

        const data = await response.json();
        setFeedbacks(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedbacks();
  }, [user, filter]);

  // --- Handler to update a feedback's status ---
  const handleMarkAsReviewed = async (feedbackId: string) => {
    setUpdatingId(feedbackId);
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/feedback/${feedbackId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "reviewed" }),
        }
      );
      if (!response.ok) throw new Error("Failed to update status.");

      // Update state locally for instant UI change
      setFeedbacks((prev) => prev.filter((fb) => fb.id !== feedbackId));
      toast.success("Feedback marked as reviewed");
    } catch (err) {
      toast.error("Error updating status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 md:p-12 min-h-screen">
      <h2 className="text-4xl lg:text-4xl font-bold text-white">
        Admin Feedback Review
      </h2>
      <p className="mt-2 text-gray-400">
        Review and manage feedback submitted by users.
      </p>

      {/* Filter Buttons */}
      <div className="mt-8 flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setFilter("new")}
          className={`px-4 py-2 font-semibold transition-colors ${
            filter === "new"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          New Feedback
        </button>
        <button
          onClick={() => setFilter("reviewed")}
          className={`px-4 py-2 font-semibold transition-colors ${
            filter === "reviewed"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Reviewed
        </button>
      </div>

      {/* Feedback List */}
      <div className="mt-8 space-y-4">
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        <AnimatePresence>
          {!isLoading && feedbacks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-10 text-center"
            >
              <p className="text-gray-400">No {filter} feedback to show.</p>
            </motion.div>
          )}

          {feedbacks.map((fb) => (
            <motion.div
              key={fb.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <StarRating rating={fb.rating} />
                  <p className="text-white mt-4">{fb.text}</p>
                </div>
                {fb.status === "new" && (
                  <button
                    onClick={() => handleMarkAsReviewed(fb.id)}
                    disabled={updatingId === fb.id}
                    className="flex items-center gap-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1.5 rounded-lg text-sm transition-all disabled:opacity-50"
                  >
                    {updatingId === fb.id ? (
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircleIcon className="h-4 w-4" />
                    )}
                    Mark as Reviewed
                  </button>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400 flex justify-between">
                <span>
                  <strong className="text-gray-300">User:</strong>{" "}
                  {fb.user.email || fb.user.displayName || fb.user.uid}
                </span>
                <span>
                  <strong className="text-gray-300">Plan ID:</strong>{" "}
                  {fb.planId}
                </span>
                <span>
                  {formatDistanceToNow(new Date(fb.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
