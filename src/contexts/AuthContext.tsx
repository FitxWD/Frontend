"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut as fbSignOut, signInWithEmailAndPassword } from "firebase/auth";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

// Expose a custom login function for Cypress to call.
// This is safer because it uses the fully initialized `auth` instance from this module's scope.
if (typeof window !== 'undefined' && window.Cypress) {
  window.cypressLogin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  return <Ctx.Provider value={{ user, loading, signOut: () => fbSignOut(auth) }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
