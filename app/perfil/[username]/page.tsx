import { redirect } from "next/navigation";
import { ProfileView } from "./ProfileView";
import { getProfile } from "@/app/actions/profile";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  let profileData = null;
  try {
    profileData = await getProfile(username);
  } catch {
    // Fallback gracioso
  }

  if (!profileData && username === "me") {
    redirect("/login");
  }

  return (
    <ProfileView
      username={profileData?.profile?.username || username}
      initialProfile={
        profileData?.profile
          ? {
              display_name: profileData.profile.display_name,
              bio: profileData.profile.bio,
              avatar_url: profileData.profile.avatar_url,
              favorite_genres: profileData.profile.favorite_genres,
            }
          : undefined
      }
      initialStats={profileData?.stats}
      initialBooks={profileData?.books || []}
      isCurrentUser={profileData?.isCurrentUser ?? (username === "me")}
    />
  );
}
