"use client";

import { Bell, Image as ImageIcon, Search, Smile, X } from "lucide-react";
import { useState } from "react";

export default function FeedComposer() {
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // ✅ Extract hashtags
  const extractTags = (text: string) => {
    const matches = text.match(/#\w+/g);
    return matches ? matches.map((tag) => tag.slice(1)) : [];
  };

  // ✅ Highlight hashtags
  const formatText = (text: string) => {
    return text.split(/(\#\w+)/g).map((part, i) =>
      part.startsWith("#") ? (
        <span key={i} className="text-primary font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // ✅ Handle image
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  // ✅ Submit
  const handlePost = () => {
    const tags = extractTags(bio);

   

    // 👉 send to backend
  };

  return (
    <section className="space-y-4">
      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-full bg-surface-active px-4 py-3 text-sm">
          <Search className="h-4 w-4 text-primary" />
          <input
            type="text"
            placeholder="Explore skysocial"
            className="w-full bg-transparent outline-none"
          />
        </div>

        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-active text-primary">
          <Bell className="h-4 w-4" />
        </button>
      </div>

      {/* Composer */}
      <div className="bg-white rounded-4xl px-5 py-5">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0d464e] via-[#16757d] to-[#4ec5cf] flex items-center justify-center text-white font-bold">
            A
          </div>

          <div className="flex-1 space-y-3">
            {/* TEXTAREA WITH OVERLAY */}
            <div className="relative">
              {/* Highlight Layer */}
              <div className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words text-lg font-semibold text-on-surface">
                {formatText(bio)}
              </div>

              {/* Actual Input */}
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share something ethereal... #tag"
                className="relative w-full resize-none bg-transparent text-lg font-semibold text-transparent caret-black outline-none min-h-[80px]"
              />
            </div>

            {/* IMAGE PREVIEW */}
            {preview && (
              <div className="relative w-full max-w-[500px] aspect-square rounded-xl overflow-hidden border">
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-between items-center border-t pt-3">
              <div className="flex gap-2">
                {/* Image Upload */}
                <label className="cursor-pointer p-2 rounded-full hover:bg-surface-low">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImage}
                  />
                </label>

                <button className="p-2 rounded-full hover:bg-surface-low">
                  <Smile className="h-5 w-5 text-primary" />
                </button>
              </div>

              <button
                onClick={handlePost}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-semibold"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}