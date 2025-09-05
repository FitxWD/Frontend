"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      router.replace("/dashboard");
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") setError("Invalid email or password.");
      else if (code === "auth/user-not-found") setError("No account exists with that email.");
      else setError("Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 text-gray-200 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome Back</h1>
              <p className="text-gray-400 mt-2">Sign in to continue your fitness journey.</p>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  id="email" type="email" required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                  <a href="/reset-password" className="text-sm text-green-400 hover:text-green-500">Forgot password?</a>
                </div>
                <input
                  id="password" type="password" required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit" disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <span>{loading ? "Signing In..." : "Sign In"}</span>
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </form>

            <div className="text-center mt-8">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <a href="/signup" className="font-medium text-green-400 hover:text-green-500">Sign Up</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}