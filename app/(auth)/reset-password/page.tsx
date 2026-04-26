"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Invalid or missing token");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/reset-password`,
        { token, password }
      );

      setSuccess(true);
    //   router.push("/login");
    } catch (error) {
      console.error("Password reset failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Success UI
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-[400px] bg-surface-card rounded-xl p-8 text-center space-y-4">
          <div className="text-4xl">✅</div>

          <h1 className="text-xl font-bold">
            Password Reset Successful
          </h1>

          <p className="text-sm text-on-surface-variant">
            Your password has been updated. You can now log in with your new password.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="w-full py-3 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px] bg-surface-card rounded-xl p-8 space-y-5 shadow-md">

        {/* Heading */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold">Reset your password</h1>
          <p className="text-sm text-on-surface-variant">
            Please enter your new password below. Make sure it&apos;s strong and secure.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-on-surface">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />

            <p className="text-xs text-on-surface-variant">
              Must be at least 6 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-on-surface">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Resetting..." : "Reset Password"}
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