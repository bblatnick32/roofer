import { checkAuth } from "@/lib/auth/utils";

export default async function Page() {
  await checkAuth("dashboard");

  return <div />;
}
