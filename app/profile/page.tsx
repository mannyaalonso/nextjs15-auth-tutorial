import ProfileClient from "@/components/profile-client";
import { redirect } from "next/navigation";
import { getUser } from "@/queries/user";

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <ProfileClient userId={user.id} userEmail={user.email || ''} />;
}