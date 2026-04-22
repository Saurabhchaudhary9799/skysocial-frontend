"use client";

import SectionCard from "@/components/edit-profile/sectionCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore"; // 🔥 Zustand

type Props = {
  user: any;
};

/* ✅ Zod Schema */
const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  username: z.string().min(3).max(20),
  bio: z.string().max(150, "Max 150 characters"),
});

type FormType = z.infer<typeof schema>;

export default function EditProfilePage() {
  const router = useRouter();

  // 🔥 Zustand
  const { user, setUser } = useUserStore();

  if (!user) {
    toast.error("User not found. Please log in again.");
    router.push("/login");
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      bio: user.bio || "",
    },
  });

  const bioValue = watch("bio");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [profilePreview, setProfilePreview] = useState(
    user.profile_image || null,
  );
  const [coverPreview, setCoverPreview] = useState(user.cover_image || null);

  /* ✅ Image handler */
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (type === "profile") {
      setProfileImage(file);
      setProfilePreview(preview);
    } else {
      setCoverImage(file);
      setCoverPreview(preview);
    }
  };

  /* ✅ Submit */
  const onSubmit = async (data: FormType) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("username", data.username);
      formData.append("bio", data.bio);

      if (profileImage) formData.append("profile_image", profileImage);
      if (coverImage) formData.append("cover_image", coverImage);

      const res = await axios.patch(
        "http://localhost:8000/api/v1/users/me",
        formData,
        { withCredentials: true },
      );
      // console.log(res.data.data);
      // 🔥 IMPORTANT: update global store
      console.log("Updated user data from API:", res.data.data); // Debug log
      if (user) {
        setUser({
          ...user,
          ...res.data.data, // only overrides updated fields
        });
      }

      toast.success("Profile updated successfully 🚀");

      // 🔥 go back to profile
      // router.back();
    } catch (err) {
      // console.log(err);
      toast.error("Update failed ❌");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" mx-auto px-2 py-4 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-3xl px-4 py-3 shadow-md gap-3">
        {/* Left Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-full cursor-pointer bg-surface-container shrink-0"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-on-surface truncate">
              Edit Profile
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant truncate">
              Customize how you appear
            </p>
          </div>
        </div>

        {/* Right Section (Button) */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
      w-full sm:w-auto
      justify-center
      px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow-md transition
      ${
        isSubmitting
          ? "bg-gradient-to-br from-primary to-primary-container text-on-primary cursor-not-allowed"
          : "bg-gradient-to-br from-primary to-primary-container text-on-primary hover:-translate-y-0.5"
      }
    `}
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      {/* Visual Identity */}
      <SectionCard title="Visual Identity">
        <div className="relative">
          {/* Cover */}
          <div className="h-40 rounded-4xl overflow-hidden relative">
            <img
              src={
                coverPreview ||
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
              }
              className="w-full h-full object-cover"
            />

            <label className="absolute inset-0 flex items-center justify-center cursor-pointer">
              <span className="px-3 py-1 rounded-full bg-primary/80 text-on-primary text-sm">
                Change Cover
              </span>
              <input
                type="file"
                hidden
                onChange={(e) => handleImageChange(e, "cover")}
              />
            </label>
          </div>

          {/* Profile */}
          <div className="absolute -bottom-8 left-6">
            <label className="cursor-pointer">
              <div className="w-20 h-20 rounded-full border-4 border-background overflow-hidden shadow-md">
                <img
                  src={
                    profilePreview ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                  }
                  className="w-full h-full object-cover"
                />
              </div>

              <input
                type="file"
                hidden
                onChange={(e) => handleImageChange(e, "profile")}
              />
            </label>
          </div>
        </div>

        <div className="h-10" />
      </SectionCard>

      {/* Basic Info */}
      <SectionCard title="Basic Information">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm text-neutral">Full Name</label>
          <input
            {...register("name")}
            className="w-full px-4 py-3 rounded-xl bg-surface-active text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Username */}
        <div className="space-y-1">
          <label className="text-sm text-neutral">Username</label>
          <input
            {...register("username")}
            className="w-full px-4 py-3 rounded-xl bg-surface-active text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.username && (
            <p className="text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <label className="text-sm text-neutral">Bio</label>
          <textarea
            {...register("bio")}
            rows={4}
            maxLength={150}
            className="w-full px-4 py-3 rounded-xl bg-surface-active text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
          />

          <p className="text-xs text-on-surface-variant text-right">
            {bioValue?.length || 0}/150
          </p>

          {errors.bio && (
            <p className="text-xs text-red-500">{errors.bio.message}</p>
          )}
        </div>
      </SectionCard>
    </form>
  );
}
