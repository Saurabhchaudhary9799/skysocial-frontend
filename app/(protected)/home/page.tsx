
import FeedComposer from "@/components/home/FeedComposer";
import PostCard from "@/components/home/PostCard";
import RightRail from "@/components/home/RightRail";
import axios from "axios";
import { cookies } from "next/headers";
async function getHomeFeed() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000/api/v1";
  if (!jwt || !apiBaseUrl) {
    return [];
  }
  try {
    const res = await axios.get(`${apiBaseUrl}/posts/home-feed`, {
      headers: {
        Accept: "application/json",
        Cookie: cookieStore.toString(),
      },
      withCredentials: true,
    });
    
    return res.data?.result?.posts ?? [];
  } catch {
    return [];
  }
}
function formatTimeAgo(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diffInHours = Math.floor(
    (now.getTime() - past.getTime()) / (1000 * 60 * 60),
  );
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
}
function formatCount(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}



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

export default async function Home() {
  const posts = await getHomeFeed();
//  console.log(feed);
//   const posts = feed.map((post: any) => ({
//     author: post.user?.name || post.user?.username || "Unknown",
//     handle: `@${post.user?.username || "unknown"}`,
//     time: formatTimeAgo(post.createdAt),
//     text: post.bio || "",
//     likes: formatCount(post.likes?.length || 0),
//     comments: formatCount(post.comments?.length || 0),
//     shares: "0",
//   }));
  // console.log("posts",posts);
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
      <section className="space-y-5 lg:py-4">
        {/* <FeedComposer /> */}
        <div className="space-y-5">
          {posts.map((post: any, index: number) => (
            <PostCard key={index} {...post} />
          ))}
        </div>
      </section>
      <div className="lg:p-4">
        <RightRail trends={trends} suggestions={suggestions} />
      </div>
    </div>
  );
}
