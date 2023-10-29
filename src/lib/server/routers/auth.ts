import { createOrg } from "@/lib/api/orgs/mutations";
import { getOrgById } from "@/lib/api/orgs/queries";
import { createUser } from "@/lib/api/users/mutations";
import { getUserById } from "@/lib/api/users/queries";
import { getUserAuth } from "@/lib/auth/utils";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { session } = await getUserAuth();
    const user = session?.user;

    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    const { id: userId, email, orgs, activeOrgId } = user;

    // the first key on the orgs object is the orgId
    const orgId = Object.keys(orgs || {})[0];

    if (!orgId || !userId || !email)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    // check if the user is in the database
    const { user: dbUser } = await getUserById(userId);

    if (!dbUser) {
      // create user in db
      await createUser({
        id: userId,
        email: email,
        orgId,
      });

      // check if the org is in the database
      const { org: dbOrg } = await getOrgById(orgId);

      if (!dbOrg) {
        // create org in db
        await createOrg({
          id: orgId,
        });
      }
    }

    return { success: true, activeOrgId, orgId };
  }),
});
