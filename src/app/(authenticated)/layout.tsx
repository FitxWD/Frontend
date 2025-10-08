"use client";

import Sidebar from "@/components/Sidebar";
import FloatingChat from "@/components/FloatingChat";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  // Add a check for the health-data route
  const showSidebar = pathname !== "/health-data";

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      {showSidebar && (
        <Sidebar onToggle={(collapsed) => setIsSidebarCollapsed(collapsed)} />
      )}
      <main
        className={`flex-1 overflow-auto relative ${
          !showSidebar ? "w-full" : ""
        }`}
      >
        {children}
        <FloatingChat />
        <Toaster position="top-center" />
      </main>
    </div>
  );
}
