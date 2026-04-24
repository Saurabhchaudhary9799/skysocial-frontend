"use client";

import Image from "next/image";
import Link from "next/link";
import { optimizeImage } from "./profileTabs";

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
    <div className="rounded-xl bg-surface-card overflow-hidden sunken-purple-shadow p-3">
      <div className="h-40 sm:h-48 md:h-52 w-full rounded-xl relative">
        <Image
          src={optimizeImage(coverImage || "/images/default-cover.jpg", 400)}
          alt={`cover image of ${name}`}
          width={400}
          height={400}
          className="w-full h-full rounded-xl object-cover"
        />

        <div className="absolute left-4 sm:left-6 bottom-[-40px] sm:bottom-[-48px]">
          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full border-4 border-background bg-surface-container overflow-hidden shadow-lg ring-2 ring-primary/30">
            <Image
              src={optimizeImage(
                profileImage || "/images/default-cover.jpg",
                400,
              )}
              alt={` profile Image of ${name}`}
              width={100}
              height={100}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-12 sm:pt-16 pb-5">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="space-y-2">
            <div className="">
              <h1 className="text-lg sm:text-xl font-bold">{name}</h1>
              <p className="text-sm text-primary">@{username}</p>
            </div>

            <p className="text-sm text-on-surface-variant max-w-md">{bio}</p>

            <div className="flex gap-6 sm:gap-10">
              <div className=" border-r-1 border-gray-300 flex flex-col items-center pr-6">
                <p className="font-bold">{followers}</p>
                <p className="text-xs text-on-surface-variant">Followers</p>
              </div>

              <div className=" border-r-1 border-gray-300  flex flex-col items-center pr-6">
                <p className="font-bold">{following}</p>
                <p className="text-xs text-on-surface-variant">Following</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="font-bold">{posts}</p>
                <p className="text-xs text-on-surface-variant">Posts</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <Link
              href={`/profile/edit`}
              className="block text-center md:inline-block px-5 py-2 rounded-xl text-on-primary bg-gradient-to-br from-primary to-primary-container shadow-md transition hover:translate-y-[-1px]"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
