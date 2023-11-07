import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type OpportunitieId, opportunitieIdSchema, opportunities } from "@/lib/db/schema/opportunities";

export const getOpportunities = async () => {
  const { session } = await getUserAuth();
  const o = await db.select().from(opportunities).where(eq(opportunities.userId, session?.user.id!));
  return { opportunities: o };
};

export const getOpportunitieById = async (id: OpportunitieId) => {
  const { session } = await getUserAuth();
  const { id: opportunitieId } = opportunitieIdSchema.parse({ id });
  const [o] = await db.select().from(opportunities).where(and(eq(opportunities.id, opportunitieId), eq(opportunities.userId, session?.user.id!)));
  return { opportunitie: o };
};

