import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type AuthSession = {
  session: {
    user: {
      id: string;
      email?: string;
      orgs?: {
        [key: string]: string;
      };
      activeOrgId?: string;
    };
  } | null;
};

export const getUserAuth = async () => {
  // find out more about setting up 'sessionClaims' (custom sessions) here: https://clerk.com/docs/backend-requests/making/custom-session-token
  const { userId, sessionClaims } = auth();
  if (userId) {
    return {
      session: {
        user: {
          id: userId,
          email: sessionClaims?.primaryEmail,
          orgs: sessionClaims?.userOrgs,
          activeOrgId: sessionClaims?.activeOrgId,
        },
      },
    } as AuthSession;
  } else {
    return { session: null };
  }
};

export const checkAuth = async (origin?: string) => {
  const { session } = await getUserAuth();
  const { user } = session ?? {};

  if (user && user.activeOrgId && user.id) return user;

  if (origin) return redirect(`/auth-callback?origin=${origin}`);

  throw new Error("Unauthorized");
};
