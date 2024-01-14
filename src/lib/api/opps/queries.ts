import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type OppId, oppIdSchema, opps } from "@/lib/db/schema/opps";

export const getOpps = async () => {
  const { session } = await getUserAuth();
  const o = await db
    .select()
    .from(opps)
    .where(eq(opps.orgId, session?.user.activeOrgId!));
  return { opps: o };
};

export const getOppById = async (id: OppId) => {
  const { session } = await getUserAuth();
  const { id: oppId } = oppIdSchema.parse({ id });
  const [o] = await db
    .select()
    .from(opps)
    .where(and(eq(opps.id, oppId), eq(opps.orgId, session?.user.activeOrgId!)));
  return { opp: o };
};
