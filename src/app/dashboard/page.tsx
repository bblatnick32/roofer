import { getUserById } from "@/lib/api/users/queries";
import { currentUser } from "@clerk/nextjs";
import { type User } from "@clerk/nextjs/api";
import { redirect } from "next/navigation";

export default async function Page() {
  const user: User | null = await currentUser();
  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  const { user: dbUser } = await getUserById(user.id);
  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  return <div />;
}
