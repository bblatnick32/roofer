import { db } from "@/lib/db/client";
import {
  NewOpportunityContactParams,
  insertOpportunityContactSchema,
  opportunityContacts,
} from "@/lib/db/schema/opportunityContacts";
import { getUserAuth } from "@/lib/auth/utils";

export const createOpportunityContact = async (
  opportunityContact: NewOpportunityContactParams
) => {
  const { session } = await getUserAuth();
  const newOpportunityContact = insertOpportunityContactSchema.parse({
    ...opportunityContact,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db.insert(opportunityContacts).values(newOpportunityContact);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

// export const updateOpportunityContact = async (id: OpportunityContactId, opportunityContact: UpdateOpportunityContactParams) => {
//   const { session } = await getUserAuth();
//   const { id: opportunityContactId } = opportunityContactIdSchema.parse({ id });
//   const newOpportunityContact = updateOpportunityContactSchema.parse({ ...opportunityContact, orgId: session?.user.activeOrgId! });
//   try {
//     await db
//      .update(opportunityContacts)
//      .set(newOpportunityContact)
//      .where(and(eq(opportunityContacts.id, opportunityContactId!), eq(opportunityContacts.orgId, session?.user.activeOrgId!)))
//     return {success: true}
//   } catch (err) {
//     const message = (err as Error).message ?? "Error, please try again";
//     console.error(message);
//     return { error: message };
//   }
// };

// export const deleteOpportunityContact = async (id: OpportunityContactId) => {
//   const { session } = await getUserAuth();
//   const { id: opportunityContactId } = opportunityContactIdSchema.parse({ id });
//   try {
//     await db.delete(opportunityContacts).where(and(eq(opportunityContacts.id, opportunityContactId!), eq(opportunityContacts.orgId, session?.user.activeOrgId!)))
//     return {success: true}
//   } catch (err) {
//     const message = (err as Error).message ?? "Error, please try again";
//     console.error(message);
//     return { error: message };
//   }
// };
