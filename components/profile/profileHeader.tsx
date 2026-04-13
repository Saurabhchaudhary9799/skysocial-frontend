"use client";

import Link from "next/link";

type Props = {
  name: string;
  username: string;
  bio: string;
  profileImage?: string | null;
  coverImage?: string | null;
  followers: number;
  following: number;
  posts: number;
};

export default function ProfileHeader({
  name,
  username,
  bio,
  profileImage,
  coverImage,
  followers,
  following,
  posts,
}: Props) {
  return (
    <div className=" rounded-3xl bg-surface-card overflow-hidden sunken-purple-shadow">
      {/* Cover */}
      <div className="h-52 w-full overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt="cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-container" />
        )}
      </div>
      <div className="flex justify-between items-start px-5 py-5">
        <div className="flex items-center gap-4 ">
          <div className=" ">
            <div className="w-48 h-48 rounded-full border-4 border-background bg-surface-container flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-primary/30">
              {profileImage ? (
                <img
                  src={profileImage}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-on-surface-variant text-sm">
                  No Image
                </span>
              )}
            </div>
          </div>
          <div className=" px-4 flex flex-col items-start space-y-3">
            {/* Name + Username */}
            <div className=" space-y-1">
              <h1 className="text-xl font-bold text-on-surface">{name}</h1>
              <p className="text-sm text-primary">@{username}</p>
            </div>

            {/* Bio */}
            <p className="text-sm text-on-surface-variant  max-w-md">
              {bio}
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-10 text-center">
              <div>
                <p className="font-bold text-on-surface">{followers}</p>
                <p className="text-xs text-on-surface-variant">Followers</p>
              </div>

              <div>
                <p className="font-bold text-on-surface">{following}</p>
                <p className="text-xs text-on-surface-variant">Following</p>
              </div>

              <div>
                <p className="font-bold text-on-surface">{posts}</p>
                <p className="text-xs text-on-surface-variant">Posts</p>
              </div>
            </div>

            {/* Actions */}
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Link
            href={`/profile/edit`}
            className="px-6 py-2 rounded-full text-on-primary bg-gradient-to-br from-primary to-primary-container shadow-md cursor-pointer transition hover:translate-y-[-1px]"
          >
            Edit Profile
            {/* <button className="px-6 py-2 rounded-full text-on-primary bg-gradient-to-br from-primary to-primary-container shadow-md cursor-pointer transition hover:translate-y-[-1px]">
              Edit Profile
            </button> */}
          </Link>

          {/* <button className="px-6 py-2 rounded-full border border-outline text-on-surface">
            Message
          </button> */}
        </div>
      </div>

      {/* Profile Image */}

      {/* Content Wrapper */}
    </div>
  );
}
