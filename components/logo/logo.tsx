import React from "react";

export default function Logo() {
  return (
    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container shadow-lg">
      {/* Big sparkle */}
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
  );
}
