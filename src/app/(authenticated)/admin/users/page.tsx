"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { UserGroupIcon, ShieldCheckIcon, ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { format, parseISO } from "date-fns";

// --- Types to match the API response ---
interface User {
  uid: string;
  email?: string;
  displayName?: string;
  isAdmin: boolean;
  creationTime: string;
}

// --- Reusable Admin Toggle Component ---
interface AdminToggleProps {
    isAdmin: boolean;
    onChange: () => void;
    disabled: boolean;
}

const AdminToggle = ({ isAdmin, onChange, disabled }: AdminToggleProps) => (
    <button
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            isAdmin ? "bg-green-500" : "bg-gray-600"
        }`}
    >
        <motion.span
            layout
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
            className={`inline-block w-4 h-4 transform bg-white rounded-full ${
                isAdmin ? "translate-x-6" : "translate-x-1"
            }`}
        />
    </button>
);

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userEmail: string;
    isDeleting: boolean;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, userEmail, isDeleting }: ConfirmationModalProps) => {
    if (!isOpen) return null;
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-800 rounded-xl border border-gray-700 p-8 w-full max-w-md"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/20 rounded-full">
                        <ExclamationTriangleIcon className="h-7 w-7 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Delete User</h2>
                        <p className="text-gray-400 mt-1">Are you sure you want to permanently delete this user?</p>
                    </div>
                </div>
                <p className="my-6 text-center bg-gray-900 p-3 rounded-lg font-mono text-red-300">{userEmail}</p>
                <p className="text-sm text-yellow-400 text-center">This action is irreversible.</p>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold flex items-center gap-2 disabled:bg-gray-500">
                        {isDeleting ? "Deleting..." : "Yes, Delete User"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};


// --- Main User Management Page Component ---
export default function UserManagementPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // --- Security & Data Fetching ---
    useEffect(() => {
        if (!user) return;
        user.getIdTokenResult().then(tokenResult => {
            if (!tokenResult.claims.isAdmin) {
                router.push("/dashboard");
                return;
            }
            fetchUsers();
        });
        
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const token = await user.getIdToken();
                const response = await fetch(`http://localhost:8000/api/v1/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Failed to fetch user list.");
                setUsers(await response.json());
            } catch (err) {
                toast.error(
                    typeof err === "object" && err !== null && "message" in err
                        ? (err as { message: string }).message
                        : "An error occurred."
                );
            } finally {
                setIsLoading(false);
            }
        };
    }, [user, router]);
    
    // --- Handler to update a user's admin status ---
    const handleUpdateStatus = async (targetUser: User) => {
        if (user?.uid === targetUser.uid && targetUser.isAdmin) {
            toast.error("You cannot revoke your own admin status.");
            return;
        }

        setUpdatingId(targetUser.uid);
        const newAdminStatus = !targetUser.isAdmin;

        try {
            const token = await user?.getIdToken();
            const response = await fetch(`http://localhost:8000/api/v1/admin/users/${targetUser.uid}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ isAdmin: newAdminStatus }),
            });

            if (!response.ok) {
                throw new Error((await response.json()).detail || "Failed to update status.");
            }
            
            // Update state locally for instant UI change
            setUsers(prevUsers =>
                prevUsers.map(u => u.uid === targetUser.uid ? { ...u, isAdmin: newAdminStatus } : u)
            );
            toast.success(`User status updated successfully.`);

        } catch (err) {
            toast.error(
                typeof err === "object" && err !== null && "message" in err
                    ? (err as { message: string }).message
                    : "An error occurred."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const openDeleteModal = (userToConfirm: User) => {
        setUserToDelete(userToConfirm);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setUserToDelete(null);
        setIsModalOpen(false);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            const token = await user?.getIdToken();
            const response = await fetch(`http://localhost:8000/api/v1/admin/users/${userToDelete.uid}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error((await response.json()).detail || "Failed to delete user.");
            }

            // Update state locally for instant UI change
            setUsers(prevUsers => prevUsers.filter(u => u.uid !== userToDelete.uid));
            toast.success("User deleted successfully.");
            closeDeleteModal();

        } catch (err) {
            toast.error(
                typeof err === "object" && err !== null && "message" in err
                    ? (err as { message: string }).message
                    : "An error occurred."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-8 md:p-12 min-h-screen">
            <Toaster position="top-center" />
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteUser}
                userEmail={userToDelete?.email || ''}
                isDeleting={isDeleting}
            />
            <h2 className="text-4xl lg:text-4xl font-bold text-white flex items-center gap-4">
                User Management
            </h2>
            <p className="mt-2 text-gray-400">View, manage, and assign roles to users in your application.</p>
            
            <div className="mt-8 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">User</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Role</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Joined Date</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="py-4 pl-4 pr-3 sm:pl-6"><div className="h-5 w-48 bg-gray-700 rounded"></div></td>
                                    <td className="px-3 py-4"><div className="h-5 w-20 bg-gray-700 rounded"></div></td>
                                    <td className="px-3 py-4"><div className="h-5 w-32 bg-gray-700 rounded"></div></td>
                                    <td className="py-4 pl-3 pr-4 sm:pr-6"><div className="h-6 w-11 bg-gray-700 rounded-full"></div></td>
                                </tr>
                            ))
                        ) : (
                            users.map((u) => (
                                <tr key={u.uid}>
                                    <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="font-medium text-white">{u.email || "No Email"}</div>
                                        <div className="text-gray-400">{u.uid}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                        {u.isAdmin ? (
                                            <span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                                                <ShieldCheckIcon className="h-3 w-3" /> Admin
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">User</span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                                        {format(parseISO(u.creationTime), "MMM d, yyyy")}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <div className="flex items-center justify-end gap-4">
                                            <AdminToggle
                                                isAdmin={u.isAdmin}
                                                onChange={() => handleUpdateStatus(u)}
                                                disabled={updatingId === u.uid}
                                            />
                                            {/* --- NEW: Delete Button --- */}
                                            {/* Client-side check to prevent self-deletion UI */}
                                            {user?.uid !== u.uid && (
                                                <button onClick={() => openDeleteModal(u)} className="p-2 text-gray-400 hover:text-red-400">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}