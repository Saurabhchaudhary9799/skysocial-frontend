"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import PostListSkeleton from "@/components/skeleton/postListSkeleton";

const PostList = dynamic(() => import("@/components/home/postList"));
const RightRail = dynamic(() => import("@/components/home/RightRail"));

const trends = [
  {
    label: "Trending in Ether",
    topic: "#NebulaDesignSystem",
    count: "12.4k posts",
  },
  {
    label: "Technology",
    topic: "Quantum Glass UI",
    count: "8.2k posts",
  },
  {
    label: "Lifestyle",
    topic: "#CloudWalking",
    count: "5.1k posts",
  },
];

const suggestions = [
  {
    name: "Maya Starlight",
    handle: "@maya.skye",
    tone: "from-[#1f1f1f] to-[#808080]",
  },
  {
    name: "Orion Blue",
    handle: "@orion_sky",
    tone: "from-[#4e5466] to-[#cbd3ff]",
  },
];

export default function Home() {
  return (
    <div className="grid gap-y-2 gap-x-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:max-w-[1440px] mx-auto  py-2">
      {/* Feed */}
      <section className="space-y-5 min-h-[60vh]">
        <Suspense fallback={<PostListSkeleton />}>
          <PostList />
        </Suspense>
      </section>

      {/* Right Rail */}
      <aside className="hidden lg:block sticky top-18 self-start">
        <RightRail trends={trends} suggestions={suggestions} />
      </aside>
    </div>
  );
}
