"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useState } from "react";
import FormField from "@/components/ui/FormField";
import API from "@/lib/axios";
import { initializeSession } from "@/lib/auth-client";

const signupSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const router = useRouter();

  const initialFormData: SignupFormData = {
    name: "",
    username: "",
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState<SignupFormData>({
    ...initialFormData,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});

  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const result = signupSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        username: fieldErrors.username?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    setApiError("");
    setIsSubmitting(true);

    try {
      const res = await API.post("/users/signup", {
        ...result.data,
      });

      await initializeSession(res.data);

      setFormData(initialFormData);
      setErrors({});
      router.replace("/home");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setApiError(
          error.response?.data?.message || "Signup failed. Please try again.",
        );
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background selection:bg-primary-container selection:text-on-primary overflow-hidden relative font-manrope celestial-mesh">
      <main className="flex items-center justify-center w-full px-4 relative z-10 py-10">
        <div className="w-full max-w-[400px] bg-surface-card rounded-xl p-8 md:p-10 relative transition-all duration-500 hover:-translate-y-1 sunken-purple-shadow space-y-4">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 ">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container shadow-lg">
              {/* Big left sparkle */}
              <svg
                className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-on-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l2 5.5L20 9l-6 2.5L12 17l-2-5.5L4 9l6-1.5L12 2z" />
              </svg>

              {/* Top small */}
              <svg
                className="absolute right-2 top-2 w-2.5 h-2.5 text-on-primary opacity-80"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l1 3L16 6l-3 1-1 3-1-3-3-1 3-1 1-3z" />
              </svg>

              {/* Bottom small */}
              <svg
                className="absolute right-2 bottom-2 w-2.5 h-2.5 text-on-primary opacity-80"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l1 3L16 6l-3 1-1 3-1-3-3-1 3-1 1-3z" />
              </svg>
            </div>

            <span className="text-xl font-bold tracking-tighter text-primary">
              SkySocial
            </span>
          </div>

          {/* Heading */}
          <div className="leading-7  text-center">
            <h1 className="text-2xl font-extrabold tracking-tighter text-on-surface ">
              Create Account
            </h1>
            <p className="text-sm text-on-surface-variant">
              Join the ether. Start your celestial journey today.
            </p>
          </div>

          {/* Form */}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              error={errors.name}
            />

            <FormField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="janedoe"
              error={errors.username}
            />

            <FormField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              error={errors.email}
            />

            <FormField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
            />

            {/* Terms */}
            <div className="flex items-start gap-2 px-1">
              <input type="checkbox" className="mt-1 accent-primary" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                I agree to the{" "}
                <span className="text-primary cursor-pointer">Terms</span> and{" "}
                <span className="text-primary cursor-pointer">
                  Privacy Policy
                </span>
              </p>
            </div>

            {apiError && <p className="text-sm text-red-500">{apiError}</p>}

            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full text-on-primary font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br from-primary to-primary-container shadow-md"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Footer text */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-xs text-on-surface-variant">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full absolute bottom-0 left-0 z-50">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 w-full gap-3">
          <div className="text-xs font-medium text-on-surface-variant">
            © 2024 SkySocial Celestial Ether
          </div>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service", "Contact Support"].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs font-medium text-on-surface-variant hover:text-primary transition-colors"
                >
                  {link}
                </a>
              ),
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
