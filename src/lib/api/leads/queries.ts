import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type LeadId, leadIdSchema, leads } from "@/lib/db/schema/leads";

export const getLeads = async () => {
  const { session } = await getUserAuth();
  const l = await db
    .select()
    .from(leads)
    .where(eq(leads.orgId, session?.user.activeOrgId!));
  return { leads: l };
};

export const getLeadById = async (id: LeadId) => {
  const { session } = await getUserAuth();
  const { id: leadId } = leadIdSchema.parse({ id });
  const [l] = await db
    .select()
    .from(leads)
    .where(
      and(eq(leads.id, leadId), eq(leads.orgId, session?.user.activeOrgId!))
    );
  return { lead: l };
};
