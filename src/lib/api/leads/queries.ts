import { db } from "@/lib/db/client";
import { eq, and, ne } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type LeadId,
  leadIdSchema,
  leads,
  LEAD_CONVERTED,
} from "@/lib/db/schema/leads";

export const getLeads = async () => {
  const { session } = await getUserAuth();
  const l = await db
    .select()
    .from(leads)
    .where(
      and(
        ne(leads.status, LEAD_CONVERTED),
        eq(leads.orgId, session?.user.activeOrgId!)
      )
    );
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
