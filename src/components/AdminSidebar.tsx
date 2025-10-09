"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  ChartBarIcon,
  UserGroupIcon,
  ArrowLeftCircleIcon,
  UserCircleIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";
import { FaDumbbell, FaUtensils } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Reuse the same animation variants
const textVariants = {
  hidden: { opacity: 0, x: -20, display: "none" },
  visible: { opacity: 1, x: 0, display: "inline-flex" },
};

// Admin navigation items
const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: ChartBarIcon },
  { label: "Diet Plans", href: "/admin/diet-plans", icon: FaUtensils},
  { label: "Workout Plans", href: "/admin/workout-plans", icon: FaDumbbell },
  { label: "User Management", href: "/admin/users", icon: UserGroupIcon },
  { label: "Feedback", href: "/admin/feedback", icon: ChatBubbleBottomCenterTextIcon,},
];

interface AdminSidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

export default function AdminSidebar({ onToggle }: AdminSidebarProps) {
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Load sidebar state
  useEffect(() => {
    const savedState = localStorage.getItem("adminSidebarCollapsed");
    if (savedState !== null) {
      setCollapsed(savedState === "true");
    }
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", String(collapsed));
  }, [collapsed]);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onToggle?.(newState);
  };

  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 288 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onClick={() => (collapsed ? toggleSidebar() : null)}
      className="bg-gray-800 text-white flex flex-col justify-between h-screen sticky top-0 p-4"
    >
      <div>
        {/* Logo Section */}
        <div className="flex items-center justify-between h-10 mb-12">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.jpeg"
                alt="Admin Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  key="logo-text"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={textVariants}
                  className="flex flex-col"
                >
                  <span className="text-lg font-bold text-white">Wellness Assistant</span>
                  <span className="text-xs text-blue-500">Admin Panel</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.button
                key="collapse-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSidebar();
                }}
                className="p-1 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white"
              >
                <ArrowLeftCircleIcon className="w-6 h-6" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-500/20 text-blue-300"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon className="h-6 w-6 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      key={`nav-text-${item.label}`}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={textVariants}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className={`whitespace-nowrap ${
                        isActive ? "font-semibold" : ""
                      }`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-700 pt-4 mt-4">
        <div className="flex items-center gap-3 p-3">
          <UserCircleIcon className="h-10 w-10 text-blue-500 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                key="user-info"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={textVariants}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <p className="font-semibold text-white">
                  {user?.displayName || user?.email?.split("@")[0] || "Admin"}
                </p>
                <p className="text-xs text-blue-400">Administrator</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.button
              key="sign-out-btn"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={textVariants}
              transition={{ duration: 0.2 }}
              onClick={() => {
                localStorage.clear();
                signOut();
              }}
              className="w-full p-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-white flex justify-center text-center"
            > 
              Sign Out
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
