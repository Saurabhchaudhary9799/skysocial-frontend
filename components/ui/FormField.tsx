"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type FormFieldProps = {
  label: string;
  name: string;
  value:string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error:string | undefined;
  type?: string;
  placeholder?: string;

  rightLabel?: React.ReactNode;
};

export default function FormField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  rightLabel,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-2 w-full ">
      {/* 🏷 LABEL */}

      <div className="flex justify-between">
        <label className="text-sm font-manrope text-neutral mb-2 block">
          {label}
        </label>
        {rightLabel && <div>{rightLabel}</div>}
      </div>
      {/* ✏️ INPUT WRAPPER */}
      <div className="relative">
        <input
          name={name}
          type={isPassword && !showPassword ? "password" : "text"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            w-full
            px-4 py-3
            rounded-xl
            bg-surface-active
            text-sm
            font-body
            outline-none
            transition
            focus:bg-surface-card
            focus:ring-1 focus:ring-primary
            ghost-border
          "
        />

        {/* 👁 PASSWORD TOGGLE */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
