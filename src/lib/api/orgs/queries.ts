import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { type OrgId, orgIdSchema, orgs } from "@/lib/db/schema/orgs";
import { users } from "@/lib/db/schema/users";

export const getOrgs = async () => {
  const o = await db.select({ org: orgs, user: users }).from(orgs);
  return { orgs: o };
};

export const getOrgById = async (id: OrgId) => {
  const { id: orgId } = orgIdSchema.parse({ id });
  const [o] = await db.select().from(orgs).where(eq(orgs.id, orgId));
  return { org: o };
};
