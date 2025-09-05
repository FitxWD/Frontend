"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { UserPlusIcon } from "@heroicons/react/24/solid";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullname: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: form.fullname });
        // Optional but recommended:
        // await sendEmailVerification(cred.user);

        // Create a Firestore profile doc
        await setDoc(doc(db, "users", cred.user.uid), {
          email: form.email,
          name: form.fullname,
          createdAt: serverTimestamp(),
          preferences: {},
          customizedWorkoutPlans: [],
          customizedDietPlans: [],
        });
      }
      router.replace("/dashboard");
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/email-already-in-use") setError("Email already in use.");
      else if (code === "auth/invalid-email") setError("Invalid email address.");
      else if (code === "auth/weak-password") setError("Password is too weak (min 6 chars).");
      else setError("Something went wrong. Please try again.");
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
              <h1 className="text-3xl md:text-4xl font-bold text-white">Start Your Journey</h1>
              <p className="text-gray-400 mt-2">Create an account to get your personalized plan.</p>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  id="fullname" required
                  value={form.fullname}
                  onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                  placeholder="e.g., Alex Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  id="email" type="email" required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  id="password" type="password" required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                  placeholder="Minimum 6 characters"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit" disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <span>{loading ? "Creating..." : "Create My Free Account"}</span>
                <UserPlusIcon className="h-5 w-5" />
              </button>
            </form>

            <div className="text-center mt-8">
              <p className="text-gray-400">
                Already have an account?{" "}
                <a href="/login" className="font-medium text-green-400 hover:text-green-500">Sign In</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}