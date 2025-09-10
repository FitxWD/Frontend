"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();
  return (
    <nav className="...">
      <div className="ml-auto flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm opacity-80">{user.displayName || user.email}</span>
            <button onClick={signOut} className="px-3 py-1 rounded bg-gray-700">Sign out</button>
          </>
        ) : (
          <>
            <a href="/login" className="px-3 py-1 rounded bg-gray-700">Sign in</a>
            <a href="/signup" className="px-3 py-1 rounded bg-green-600">Sign up</a>
          </>
        )}
      </div>
    </nav>
  );
}
