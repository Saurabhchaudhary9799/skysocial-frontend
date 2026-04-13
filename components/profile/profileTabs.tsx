"use client";

import { useState } from "react";

export default function ProfileTabs() {
  const [active, setActive] = useState("posts");

  const tabs = ["posts", "collections", "about"];

  return (
    <div className="mt-6">
      <div className="flex justify-center gap-6 border-b border-outline-variant">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-2 text-sm capitalize ${
              active === tab
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 text-center text-on-surface-variant">
        {active === "posts" && <p>Posts content</p>}
        {active === "collections" && <p>Collections content</p>}
        {active === "about" && <p>About content</p>}
      </div>
    </div>
  );
}