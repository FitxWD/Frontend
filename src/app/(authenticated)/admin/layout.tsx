"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200 overflow-hidden">
      <AdminSidebar
        onToggle={(collapsed) => setIsSidebarCollapsed(collapsed)}
      />
      <main className="flex-1 overflow-auto h-screen">
        <div className="p-4">{children}</div>
        <Toaster position="top-center" />
      </main>
    </div>
  );
}
