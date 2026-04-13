import FeedComposer from "@/components/home/FeedComposer";
import PostCard from "@/components/home/PostCard";
import RightRail from "@/components/home/RightRail";

const posts = [
  {
    author: "Lumina Vance",
    handle: "@lumina.v",
    time: "Digital Realm",
    text: "Just watched the sunrise over the digital horizon. There is a certain peace in the pixels before the world wakes up. #EtherLife #MorningMist",
    likes: "1.2k",
    comments: "84",
    shares: "230",
    imageVariant: "leaf" as const,
  },
  {
    author: "Soren K.",
    handle: "@soren.wave",
    time: "5 hours ago",
    text: "Finally finished the branding for the new celestial marketplace. The color palette is inspired by night nebulae and morning frost. What do you think?",
    likes: "856",
    comments: "12",
    shares: "0",
    imageVariant: "palette" as const,
  },
];

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
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
      <section className="space-y-5 lg:py-4">
          <FeedComposer />

          <div className="space-y-5">
            {posts.map((post) => (
              <PostCard key={`${post.author}-${post.time}`} {...post} />
            ))}
          </div>
      </section>

      <div className="lg:p-4">
        <RightRail trends={trends} suggestions={suggestions} />
      </div>
    </div>
  );
}
