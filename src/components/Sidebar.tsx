"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  ChartBarIcon,
  ClockIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  PlusCircleIcon,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Check for user's sidebar preference in local storage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState !== null) {
      setCollapsed(savedState === "true");
    }
  }, []);

  // Save preference when changed
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(collapsed));
  }, [collapsed]);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  // Navigation items
  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: ChartBarIcon,
    },
    {
      label: "Generate Plan",
      href: "/generate-plan",
      icon: PlusCircleIcon,
    },
    {
      label: "Plan History",
      href: "/plan-history",
      icon: ClockIcon,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <>
      {/* Sidebar Toggle Button (visible when collapsed) */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed left-4 top-4 z-30 bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        >
          <ArrowRightCircleIcon className="h-6 w-6 text-green-400" />
        </button>
      )}

      <AnimatePresence>
        {/* Sidebar */}
        <motion.aside
          initial={{ width: collapsed ? 0 : 256 }}
          animate={{ width: collapsed ? 0 : 256 }}
          exit={{ width: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`bg-gray-800 flex-shrink-0 flex flex-col justify-between h-screen sticky top-0 overflow-hidden z-20 ${
            collapsed ? "p-0" : "p-6"
          }`}
        >
          <div className="relative">
            {/* Collapse button */}
            <button
              onClick={() => setCollapsed(true)}
              className="absolute right-0 top-0 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeftCircleIcon className="h-6 w-6" />
            </button>

            <h1 className="text-2xl font-bold text-white mb-10 mt-1">
              AI Coach
            </h1>

            <nav className="space-y-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-green-500/20 text-green-400"
                        : "hover:bg-gray-700 text-gray-200"
                    }`}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className={isActive ? "font-semibold" : ""}>
                      {item.label}
                    </span>

                    {/* Highlight for active generate-plan route */}
                    {isActive && item.href === "/generate-plan" && (
                      <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-green-800 bg-green-400 rounded">
                        New
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <UserCircleIcon className="h-10 w-10 text-gray-500" />
              <div>
                <p className="font-semibold text-white">{displayName}</p>
                <p className="text-sm text-gray-400">Welcome back!</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="w-full text-left p-3 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
            >
              Sign Out
            </button>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Overlay to close sidebar on mobile */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-10"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}
