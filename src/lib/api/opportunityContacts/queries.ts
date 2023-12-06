import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type OpportunityContactId, opportunityContactIdSchema, opportunityContacts } from "@/lib/db/schema/opportunityContacts";

export const getOpportunityContacts = async () => {
  const { session } = await getUserAuth();
  const o = await db.select().from(opportunityContacts).where(eq(opportunityContacts.orgId, session?.user.activeOrgId!));
  return { opportunityContacts: o };
};

export const getOpportunityContactById = async (id: OpportunityContactId) => {
  const { session } = await getUserAuth();
  const { id: opportunityContactId } = opportunityContactIdSchema.parse({ id });
  const [o] = await db.select().from(opportunityContacts).where(and(eq(opportunityContacts.id, opportunityContactId), eq(opportunityContacts.orgId, session?.user.activeOrgId!)));
  return { opportunityContact: o };
};

