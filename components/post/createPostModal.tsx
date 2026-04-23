"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";
import { usePostStore } from "@/store/usePostStore";
import Image from "next/image";
import API from "@/lib/axios";
import { uploadToCloudinary } from "@/lib/cloudinary";

/* =========================
   ✅ ZOD SCHEMA
========================= */
const postSchema = z.object({
  bio: z
    .string()
    .refine(
      (val) => val.trim().split(/\s+/).length <= 1000,
      "Bio must be under 1000 words",
    ),
  tags: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        val.split(",").every((tag) => /^[a-zA-Z0-9_]+$/.test(tag.trim())),
      "Tags must be comma-separated (no spaces inside)",
    ),
});

export default function CreatePostModal({ onClose }:  { onClose: () => void }) {
  const { user, setUser } = useUserStore();
  const addPost = usePostStore((state) => state.addPost);

  const [mounted, setMounted] = useState(false);

  const [bio, setBio] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // 🔥 NEW

  useEffect(() => {
    setMounted(true);
  }, []);

   useEffect(() => {
    if (!mounted) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mounted]);

  /* =========================
     ✅ IMAGE HANDLING
  ========================= */
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

  /* =========================
     ✅ SUBMIT
  ========================= */
  const handlePost = async () => {
    const result = postSchema.safeParse({ bio, tags });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);

   

    let imageUrl = "";

    if (image) {
      imageUrl = await uploadToCloudinary(image); // 🔥 upload first
    }

    const res = await API.post("/posts", {
      bio,
      tags,
      image: imageUrl,
    });


      toast.success("Post created successfully 🚀");
      console.log(res);
      addPost(res.data.post);

      if (user) {
        setUser({
          ...user,
          posts: (user.posts || 0) + 1,
        });
      }

      // reset state
      setBio("");
      setTags("");
      setImage(null);
      setPreview(null);

      onClose();
    } catch (error) {
      console.error(error);
      toast.error( "Failed to create post ❌");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-surface-card p-5 shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-on-surface">New Post</h2>
          <button onClick={onClose} className="bg-surface-low rounded-full p-2">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Bio */}
          <div>
            <p className="text-xs text-on-surface-variant mb-1">Caption</p>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full rounded-xl bg-surface-active p-3 text-sm outline-none resize-none min-h-[100px] max-h-[200px] overflow-y-auto"
            />
          </div>

          {/* Tags */}
          <div>
            <p className="text-xs text-on-surface-variant mb-1">Tags</p>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="enjoy,nature,party"
              className="w-full rounded-xl bg-surface-active p-3 text-sm outline-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <p className="text-xs text-on-surface-variant mb-1">Visuals</p>

            {!preview ? (
              <label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-outline p-6 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  +
                </div>
                <p className="text-xs text-on-surface-variant">
                  Add Photo or Video
                </p>
                <input type="file" hidden onChange={handleImage} />
              </label>
            ) : (
              <div className="relative h-64 rounded-xl overflow-hidden">
                <Image src={preview} alt="preview"  width={400} height={400} className="w-full h-full object-cover" />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4">
          <label className="cursor-pointer p-2 hover:bg-surface-low rounded-full">
            <ImageIcon size={18} className="text-primary" />
            <input type="file" hidden onChange={handleImage} />
          </label>

          <button
            onClick={handlePost}
            disabled={loading}
            className={`px-6 py-2 rounded-full text-white text-sm flex items-center gap-2
              ${
                loading
                  ? "bg-gradient-to-r from-primary to-primary-container text-on-surface-variant cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-primary-container cursor-pointer hover:translate-y-[-1px] transition"
              }`}
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
