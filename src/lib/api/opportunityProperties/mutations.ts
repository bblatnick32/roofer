import { db } from "@/lib/db/client";
import {
  NewOpportunityPropertyParams,
  insertOpportunityPropertySchema,
  opportunityProperties,
} from "@/lib/db/schema/opportunityProperties";
import { getUserAuth } from "@/lib/auth/utils";

export const createOpportunityProperty = async (
  opportunityProperty: NewOpportunityPropertyParams
) => {
  const { session } = await getUserAuth();
  const newOpportunityProperty = insertOpportunityPropertySchema.parse({
    ...opportunityProperty,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db.insert(opportunityProperties).values(newOpportunityProperty);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

// export const updateOpportunityProperty = async (id: OpportunityPropertyId, opportunityProperty: UpdateOpportunityPropertyParams) => {
//   const { session } = await getUserAuth();
//   const { id: opportunityPropertyId } = opportunityPropertyIdSchema.parse({ id });
//   const newOpportunityProperty = updateOpportunityPropertySchema.parse({ ...opportunityProperty, orgId: session?.user.activeOrgId! });
//   try {
//     await db
//      .update(opportunityProperties)
//      .set(newOpportunityProperty)
//      .where(and(eq(opportunityProperties.id, opportunityPropertyId!), eq(opportunityProperties.orgId, session?.user.activeOrgId!)))
//     return {success: true}
//   } catch (err) {
//     const message = (err as Error).message ?? "Error, please try again";
//     console.error(message);
//     return { error: message };
//   }
// };

// export const deleteOpportunityProperty = async (id: OpportunityPropertyId) => {
//   const { session } = await getUserAuth();
//   const { id: opportunityPropertyId } = opportunityPropertyIdSchema.parse({ id });
//   try {
//     await db.delete(opportunityProperties).where(and(eq(opportunityProperties.id, opportunityPropertyId!), eq(opportunityProperties.orgId, session?.user.activeOrgId!)))
//     return {success: true}
//   } catch (err) {
//     const message = (err as Error).message ?? "Error, please try again";
//     console.error(message);
//     return { error: message };
//   }
// };
