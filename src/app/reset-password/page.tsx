"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMsg("Password reset email sent. Check your inbox.");
    } catch {
      setErr("Could not send reset email.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        <input
          type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-gray-200 rounded"
          placeholder="you@example.com"
        />
        {msg && <p className="text-green-600">{msg}</p>}
        {err && <p className="text-red-600">{err}</p>}
        <button className="w-full bg-black text-white py-3 rounded">Send Reset Email</button>
      </form>
    </div>
  );
}