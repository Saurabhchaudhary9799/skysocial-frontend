import { Bookmark, Ellipsis, Heart, MessageCircle, Share } from "lucide-react";

type PostCardProps = {
  author: string;
  handle: string;
  time: string;
  text: string;
  likes: string;
  comments: string;
  shares: string;
  imageVariant?: "leaf" | "palette";
};

function LeafArtwork() {
  return (
    <div className="relative h-60 overflow-hidden rounded-[1.5rem] bg-[#1c1f19]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_40%)]" />
      <div className="absolute left-1/2 top-8 h-36 w-24 -translate-x-[95%] rounded-t-full rounded-b-[2rem] bg-[#7ab78c]" />
      <div className="absolute left-1/2 top-8 h-36 w-24 -translate-x-[5%] rounded-t-full rounded-b-[2rem] bg-[#a6deb4]" />
      <div className="absolute left-1/2 top-16 h-32 w-20 -translate-x-[80%] rotate-[34deg] rounded-t-full rounded-b-[2rem] bg-[#436c4d]" />
      <div className="absolute left-1/2 top-16 h-32 w-20 -translate-x-[20%] -rotate-[34deg] rounded-t-full rounded-b-[2rem] bg-[#5d9066]" />
      <div className="absolute left-1/2 top-6 h-44 w-[2px] -translate-x-1/2 bg-[#6cb97b]" />
      <div className="absolute bottom-0 left-1/2 h-14 w-1 -translate-x-1/2 rounded-full bg-[#6cb97b]" />
    </div>
  );
}

function PaletteArtwork() {
  return (
    <div className="grid h-40 grid-cols-2 gap-4 rounded-[1.5rem] bg-surface-low/70 p-4">
      <div className="rounded-[1.25rem] bg-gradient-to-br from-primary to-primary-container shadow-inner shadow-white/15" />
      <div className="rounded-[1.25rem] bg-gradient-to-br from-[#d7d7ff] to-[#b7bbff] shadow-inner shadow-white/35" />
    </div>
  );
}

export default function PostCard({
  author,
  handle,
  time,
  text,
  likes,
  comments,
  shares,
  imageVariant,
}: PostCardProps) {
  return (
    <article className="home-panel bg-white rounded-4xl p-5 lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#171717] to-[#6f6f6f] text-xs font-bold text-white">
            {author
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-on-surface">
              {author}
            </p>
            <p className="text-xs text-neutral">
              {handle} · {time}
            </p>
          </div>
          
        </div>
        <div>
          <Ellipsis className="h-4 w-4 text-on-surface-variant" />
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-on-surface-variant">{text}</p>

      <div className="mt-4">
        {imageVariant === "leaf" ? <LeafArtwork /> : null}
        {imageVariant === "palette" ? <PaletteArtwork /> : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-5 text-xs font-medium text-on-surface-variant">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          <span>{likes}</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          <span>{comments}</span>
        </div>
        <div className="flex items-center gap-2">
          <Share className="h-4 w-4" />
          <span>{shares}</span>
        </div>
        <button className="ml-auto text-on-surface-variant">
          <Bookmark className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
