import { db } from "@/lib/db/client";
import { and, eq } from "drizzle-orm";
import {
  OpportunityId,
  NewOpportunityParams,
  UpdateOpportunityParams,
  updateOpportunitySchema,
  insertOpportunitySchema,
  opportunities,
  opportunityIdSchema,
} from "@/lib/db/schema/opportunities";
import { getUserAuth } from "@/lib/auth/utils";
import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import * as schema from "@/lib/db";
import { NewOpportunityFromLead } from "@/lib/db/schema/opportunities";

export const createOpportunity = async (opportunity: NewOpportunityParams) => {
  const { session } = await getUserAuth();
  const newOpportunity = insertOpportunitySchema.parse({
    ...opportunity,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db.insert(opportunities).values(newOpportunity);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateOpportunity = async (
  id: OpportunityId,
  opportunity: UpdateOpportunityParams
) => {
  const { session } = await getUserAuth();
  const { id: opportunityId } = opportunityIdSchema.parse({ id });
  const newOpportunity = updateOpportunitySchema.parse({
    ...opportunity,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db
      .update(opportunities)
      .set(newOpportunity)
      .where(
        and(
          and(
            eq(opportunities.id, opportunityId!),
            eq(opportunities.orgId, session?.user.activeOrgId!)
          )
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteOpportunity = async (id: OpportunityId) => {
  const { session } = await getUserAuth();
  const { id: opportunityId } = opportunityIdSchema.parse({ id });
  try {
    await db
      .delete(opportunities)
      .where(
        and(
          eq(opportunities.id, opportunityId!),
          eq(opportunities.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const insertOpportunityFromLeadRawQuery = async ({
  newOpportunity,
  db,
}: {
  newOpportunity: NewOpportunityFromLead;
  db: PlanetScaleDatabase<typeof schema>;
}) => {
  const resultSetHeader = await db.insert(opportunities).values(newOpportunity);
  return Number(resultSetHeader.insertId);
};
