"use client";

import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);
  

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Only render content if authenticated
  if (!user) {
    return null; // Return null during redirect
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children} <Toaster position="top-center" /></main>
    </div>
  );
}
