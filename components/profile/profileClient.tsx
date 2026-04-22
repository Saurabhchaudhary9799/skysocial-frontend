"use client";

import { User, useUserStore } from "@/store/useUserStore";
import ProfileHeader from "./profileHeader";
type Props = { user: User };
export default function ProfileClient({ user }: Props) {
  const storeUser = useUserStore((s) => s.user);

  const finalUser = storeUser && storeUser._id === user._id ? storeUser : user;

  return (
    <ProfileHeader
      name={finalUser.name}
      username={finalUser.username}
      bio={finalUser.bio ?? "" }
      profileImage={finalUser.profile_image ?? null}
      coverImage={finalUser.cover_image ?? null}
      followers={finalUser.followers ?? 0}
      following={finalUser.followings ?? 0}
      posts={finalUser.posts ?? 0}
    />
  );
}
