"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  UserGroupIcon, ChatBubbleBottomCenterTextIcon, ArrowRightIcon,
  ExclamationTriangleIcon, StarIcon, UserPlusIcon
} from "@heroicons/react/24/solid";
import { FaDumbbell, FaUtensils } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, formatDistanceToNowStrict, parseISO } from "date-fns";

// --- Types (No changes needed) ---
interface FeedbackCounts { new: number; reviewed: number; total: number; }
interface RecentFeedback { id: string; text: string; rating: number; userEmail: string; }
interface RecentUser { uid: string; email: string; createdAt: string; }
interface DailyGrowth { date: string; count: number; }
interface RecentPlan { id: string; name: string; type: 'diet' | 'workout'; lastEdited: string; }
interface DashboardStats {
  totalUsers: number; newUsersToday: number; feedbackCounts: FeedbackCounts;
  totalWorkoutPlans: number; totalDietPlans: number; workoutPlansEditedToday: number; 
  dietPlansEditedToday: number; recentlyEditedPlans: RecentPlan[];
  recentFeedbacks: RecentFeedback[]; recentUsers: RecentUser[]; userGrowthLast7Days: DailyGrowth[];
}

// --- Reusable Stat Card (No changes needed) ---
interface StatCardProps {
    title: string; value: number; detail?: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    colorClass: string; link?: { href: string; text: string };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, detail, icon: Icon, colorClass, link }) => (
    <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
        className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 flex flex-col justify-between"
    >
        <div>
            <div className={`p-3 rounded-lg ${colorClass} w-max mb-4`}>
                <Icon className="h-7 w-7 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
            <p className="text-gray-300 text-sm font-medium">{title}</p>
            {detail && <p className="text-green-400 text-xs font-semibold mt-1">{detail}</p>}
        </div>
        {link && (
            <Link href={link.href} className="flex items-center gap-2 mt-4 text-sm font-semibold text-green-400 hover:text-green-300">
                {link.text} <ArrowRightIcon className="h-4 w-4" />
            </Link>
        )}
    </motion.div>
);

// --- Main Admin Dashboard Page ---
export default function AdminDashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching and Security (No changes needed) ---
    useEffect(() => {
        if (user) {
            user.getIdTokenResult().then(tokenResult => {
                if (!tokenResult.claims.isAdmin) {
                    router.push("/login");
                    return;
                }
                fetchStats();
            });
        }
        const fetchStats = async () => { 
        setIsLoading(true); setError(null);
        try {
            if (!user) {
                throw new Error("User is not authenticated.");
            }
            const token = await user.getIdToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/dashboard-stats`, { headers: { Authorization: `Bearer ${token}` } });
            if (!response.ok) throw new Error((await response.json()).detail || "Failed to fetch stats.");
            setStats(await response.json());
        } catch (err) { 
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } 
        finally { setIsLoading(false); }
    };
},  [user, router]);

    const chartData = stats?.userGrowthLast7Days.map(d => ({ name: format(parseISO(d.date), 'MMM d'), Users: d.count })) || [];
    
    // --- Skeleton Loader (Updated for new layout) ---
    const SkeletonLoader = () => (
        <>
            {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-800/80 rounded-xl p-6 h-40 animate-pulse"></div>)}
            <div className="lg:col-span-4 bg-gray-800/80 rounded-xl p-6 h-72 animate-pulse"></div>
            {[...Array(3)].map((_, i) => <div key={i} className="lg:col-span-1 bg-gray-800/80 rounded-xl p-6 h-80 animate-pulse"></div>)}
        </>
    );

    return (
        <div className="p-8 md:p-12 min-h-screen">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-4xl lg:text-4xl font-bold text-white">Admin Overview</h2>
                <p className="mt-2 text-gray-400">Welcome back, here&apos;s a snapshot of your app&apos;s activity.</p>
            </motion.div>
            
            {error && (
                <div className="mt-6 bg-red-900/80 border border-red-700 text-red-200 rounded-lg p-4">
                    <ExclamationTriangleIcon className="h-5 w-5 inline mr-2 text-red-400" />
                    <span>{error}</span>
                </div>
            )}

            <motion.div 
                className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                initial="hidden"
                animate={!isLoading ? "visible" : "hidden"}
            >
                {isLoading ? <SkeletonLoader /> : stats && (
                    <>
                        {/* --- ROW 1: Top Stat Cards --- */}
                        <StatCard title="Total Users" value={stats.totalUsers} detail={`+${stats.newUsersToday} today`} icon={UserGroupIcon} colorClass="bg-gray-500" link={{ href: "/admin/users", text: "User Management" }} />
                        <StatCard title="New Feedbacks" value={stats.feedbackCounts.new} detail={`${stats.feedbackCounts.reviewed} reviewed`} icon={ChatBubbleBottomCenterTextIcon} colorClass="bg-yellow-500" link={{ href: "/admin/feedback", text: "Review Feedback" }}/>
                        <StatCard title="Diet Plans" value={stats.totalDietPlans} detail={`+${stats.dietPlansEditedToday} edited today`} icon={FaUtensils} colorClass="bg-orange-500" link={{ href: "/admin/diet-plans", text: "Edit Diet Plans" }}/>
                        <StatCard title="Workout Plans" value={stats.totalWorkoutPlans} detail={`+${stats.workoutPlansEditedToday} edited today`}  icon={FaDumbbell} colorClass="bg-purple-500" link={{ href: "/admin/workout-plans", text: "Edit Workout Plans" }}/>
                        
                        {/* --- ROW 2: User Growth Chart (Full Width) --- */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-4 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">User Sign-ups (Last 7 Days)</h3>
                            {/* FIX: Reduced chart height */}
                            <ResponsiveContainer width="100%" height={250}> 
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} allowDecimals={false} />
                                    <Tooltip cursor={{fill: 'rgba(107, 114, 128, 0.2)'}} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} />
                                    <Bar dataKey="Users" fill="#22C55E" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* --- ROW 3: Activity Feeds (Side-by-side) --- */}
                        {/* FIX: Changed grid layout to lg:grid-cols-3 and added this parent div */}
                        <div className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-1 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Latest Feedback</h3>
                                <div className="space-y-4">
                                    {stats.recentFeedbacks.length > 0 ? stats.recentFeedbacks.map(fb => (
                                        <div key={fb.id}>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-400 truncate max-w-[150px]">{fb.userEmail}</span>
                                                <div className="flex text-yellow-400"><StarIcon className="h-4 w-4 mr-1"/>{fb.rating}/5</div>
                                            </div>
                                            <p className="text-sm text-gray-200 mt-1 truncate">&quot;{fb.text}&quot;</p>
                                        </div>
                                    )) : <p className="text-sm text-gray-500 text-center pt-10">No new feedback.</p>}
                                </div>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-1 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Newest Users</h3>
                                <div className="space-y-3">
                                    {stats.recentUsers.map(ru => (
                                        <div key={ru.uid} className="flex items-center gap-3">
                                            <UserPlusIcon className="h-5 w-5 text-gray-400"/>
                                            <div>
                                                <p className="text-sm text-gray-200 truncate">{ru.email}</p>
                                                <p className="text-xs text-gray-500">Joined {format(parseISO(ru.createdAt), "MMM d, yyyy")}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-1 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Recently Edited Plans</h3>
                                <div className="space-y-3">
                                    {stats.recentlyEditedPlans.length > 0 ? stats.recentlyEditedPlans.map(plan => (
                                        <div key={plan.id} className="flex items-center gap-3">
                                            <div className={`p-2 rounded-md ${plan.type === 'diet' ? 'bg-orange-500/20' : 'bg-purple-500/20'}`}>
                                                {plan.type === 'diet' ? <FaUtensils className="h-5 w-5 text-orange-400"/> : <FaDumbbell className="h-5 w-5 text-purple-400"/>}
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-sm font-semibold text-gray-200 truncate">{plan.name}</p>
                                                <p className="text-xs text-gray-500">Edited {formatDistanceToNowStrict(parseISO(plan.lastEdited))} ago</p>
                                            </div>
                                        </div>
                                    )) : <p className="text-sm text-gray-500 text-center pt-10">No plans edited recently.</p>}
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}