"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  ChartBarIcon,
  ClockIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  PlusCircleIcon,
  ArrowLeftCircleIcon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

type NavItems = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Variants for framer-motion to handle text fade-in/out
const textVariants = {
  hidden: { opacity: 0, x: -20, display: "none" },
  visible: { opacity: 1, x: 0, display: "inline-flex" },
};

// --- Sub-components for better structure ---
const Logo = ({
  collapsed,
  toggleSidebar,
}: {
  collapsed: boolean;
  toggleSidebar: () => void;
}) => (
  <div className="flex items-center justify-between h-10 mb-10">
    <div className="flex items-center gap-3">
      <Image
        key={collapsed.toString()}
        src="/logo.jpeg"
        alt="AI Coach Logo"
        width={40}
        height={40}
        className="rounded-lg"
      />
      <AnimatePresence>
        {!collapsed && (
          <motion.h1
            // animation props are the same
            key="logo-text"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={textVariants}
            transition={{ duration: 0.2 }}
            className="text-xl font-bold text-white whitespace-nowrap flex flex-col"
          >
            Wellness Assistant
          </motion.h1>
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
            e.stopPropagation(); // Prevents the main aside's onClick from firing
            toggleSidebar();
          }}
          className="p-1 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white"
        >
          <ArrowLeftCircleIcon className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  </div>
);

const Navigation = ({
  navItems,
  collapsed,
}: {
  navItems: NavItems[];
  collapsed: boolean;
}) => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-green-500/20 text-green-300"
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
  );
};

type UserProfileProps = {
  user: { displayName?: string | null; email?: string | null } | null;
  signOut: () => void;
  collapsed: boolean;
};

const UserProfile = ({ user, signOut, collapsed }: UserProfileProps) => {
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  const handleSignOut = () => {
    // Clear all localStorage items
    localStorage.clear();
    // Call the original signOut function
    signOut();
  };

  return (
    <div className="border-t border-gray-700 pt-4 mt-4">
      <div className="flex items-center gap-3 p-3">
        <UserCircleIcon className="h-10 w-10 text-gray-500 flex-shrink-0" />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              key="user-info"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={textVariants}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="flex flex-col"
            >
              <p className="font-semibold text-white">{displayName}</p>
              <p className="text-sm text-gray-400">Welcome back!</p>
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
            transition={{ duration: 0.2, delay: 0.2 }}
            onClick={handleSignOut}
            className="w-full p-3 rounded-lg transition-colors gap-3
                       bg-green-500 text-white  hover:bg-green-600 shadow-sm border border-green-600 flex justify-center text-center"
          >
            Sign Out
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// Add the onToggle prop to the interface
interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

// Update the component definition to accept props
export default function Sidebar({ onToggle }: SidebarProps) {
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Load sidebar state from local storage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState !== null) {
      setCollapsed(savedState === "true");
    }
  }, []);

  // Save state to local storage on change
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(collapsed));
  }, [collapsed]);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
    { label: "Generate Plan", href: "/generate-plan", icon: PlusCircleIcon },
    { label: "Plan History", href: "/plan-history", icon: ClockIcon },
    // {
    //   label: "Display Diet Plans",
    //   href: "/display-dietPlan",
    //   icon: PlayCircleIcon,
    // },
    // {
    //   label: "Display Workout Plans",
    //   href: "/display-workout",
    //   icon: PlayCircleIcon,
    // },
    {
      label: "Chat Assistant",
      href: "/chat",
      icon: ChatBubbleLeftRightIcon, // Import this from heroicons
    },
    { label: "Feedback", href: "/feedback", icon: ChatBubbleBottomCenterTextIcon },
    { label: "Settings", href: "/settings", icon: Cog6ToothIcon },
  ];

  // Update the toggle function to call onToggle
  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    // Call the onToggle prop if provided
    onToggle?.(newState);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 288 }} // Collapsed width 80px, Expanded 288px
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onClick={() => (collapsed ? toggleSidebar() : null)}
      className="bg-gray-800 text-white flex flex-col justify-between h-screen sticky top-0 p-4"
    >
      <div>
        <Logo collapsed={collapsed} toggleSidebar={toggleSidebar} />
        <Navigation navItems={navItems} collapsed={collapsed} />
      </div>
      <UserProfile user={user} signOut={signOut} collapsed={collapsed} />
    </motion.aside>
  );
}
