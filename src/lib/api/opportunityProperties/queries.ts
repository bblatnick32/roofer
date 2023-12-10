import { db } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { opportunityProperties } from "@/lib/db/schema/opportunityProperties";

export const getOpportunityProperties = async () => {
  const { session } = await getUserAuth();
  const o = await db
    .select()
    .from(opportunityProperties)
    .where(eq(opportunityProperties.orgId, session?.user.activeOrgId!));
  return { opportunityProperties: o };
};

// export const getOpportunityPropertyById = async (id: OpportunityPropertyId) => {
//   const { session } = await getUserAuth();
//   const { id: opportunityPropertyId } = opportunityPropertyIdSchema.parse({ id });
//   const [o] = await db.select().from(opportunityProperties).where(and(eq(opportunityProperties.id, opportunityPropertyId), eq(opportunityProperties.orgId, session?.user.activeOrgId!)));
//   return { opportunityProperty: o };
// };
