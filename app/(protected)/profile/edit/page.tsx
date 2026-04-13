import EditProfilePage from "@/components/edit-profile/editProfilePage";
import { requireCurrentUser } from "@/lib/auth";

export default async function Page() {
  const user = await requireCurrentUser();

  if (!user) return null;

  return <EditProfilePage user={user} />;
}