import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type OpportunityId,
  opportunityIdSchema,
  opportunities,
} from "@/lib/db/schema/opportunities";

export const getOpportunities = async () => {
  const { session } = await getUserAuth();
  const o = await db
    .select()
    .from(opportunities)
    .where(eq(opportunities.orgId, session?.user.activeOrgId!));
  return { opportunities: o };
};

export const getOpportunityById = async (id: OpportunityId) => {
  const { session } = await getUserAuth();
  const { id: opportunityId } = opportunityIdSchema.parse({ id });
  const [o] = await db
    .select()
    .from(opportunities)
    .where(
      and(
        eq(opportunities.id, opportunityId),
        eq(opportunities.orgId, session?.user.activeOrgId!)
      )
    );
  return { opportunity: o };
};
