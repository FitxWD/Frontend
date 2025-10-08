"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
    <div className="bg-gray-900 text-gray-200 flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-12 md:py-24 flex items-center">
        <div className="grid md:grid-cols-2 gap-16 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden md:block relative w-full h-[500px] rounded-2xl overflow-hidden"
          >
            <Image
              src="/hero-ai.png" 
              alt="AI-generated fitness image"
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-3xl font-bold">Track Your Progress.</h2>
              <p className="text-xl mt-2 text-gray-300">Achieve your goals one step at a time.</p>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full"
          >
            <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome Back</h1>
                <p className="text-gray-400 mt-2 text-xl">Sign in to continue your fitness journey.</p>
              </div>

              <form className="space-y-6" onSubmit={onSubmit}>
                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    id="email" type="email" required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-lg font-medium text-gray-300">Password</label>
                    <Link href="/reset-password" className="text-sm text-green-400 hover:text-green-500">Forgot password?</Link>
                  </div>
                  <input
                    id="password" type="password" required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit" disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-green-500/20"
                >
                  <span>{loading ? "Signing In..." : "Sign In"}</span>
                  {!loading && <ArrowRightIcon className="h-5 w-5" />}
                </motion.button>
              </form>

              <div className="text-center mt-8">
                <p className="text-gray-400 text-lg">
                  Don't have an account?{" "}
                  <Link href="/signup" className="font-medium text-green-400 hover:text-green-500">Sign Up</Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}