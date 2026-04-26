"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await API.post("/users/forgot-password", { email });

      setMessage("If an account exists, a reset link has been sent.");
    } catch (err) {
        console.error("Forgot password error:", err);
      setError("Something went wrong. Try again." );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px] bg-surface-card rounded-xl p-8 space-y-5 shadow-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-xl">
            📧
          </div>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-xl font-bold">Forgot your password?</h1>
          <p className="text-sm text-on-surface-variant">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-on-surface">Email</label>

            <input
              type="email"
              placeholder="eg. username@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          {/* Error / Success */}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-500">{message}</p>}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>

        {/* Back */}
        <button
          onClick={() => router.push("/login")}
          className="text-sm text-center w-full text-on-surface-variant hover:text-primary"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
