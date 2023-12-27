import { db } from "@/lib/db/client";
import { and, eq } from "drizzle-orm";
import {
  LeadId,
  NewLeadParams,
  UpdateLeadParams,
  updateLeadSchema,
  insertLeadSchema,
  leads,
  leadIdSchema,
} from "@/lib/db/schema/leads";
import { getUserAuth } from "@/lib/auth/utils";
import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import * as schema from "@/lib/db";
import { OrgId } from "@/lib/db/schema/orgs";

export const createLead = async (lead: NewLeadParams) => {
  const { session } = await getUserAuth();
  const newLead = insertLeadSchema.parse({
    ...lead,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db.insert(leads).values(newLead);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateLead = async (id: LeadId, lead: UpdateLeadParams) => {
  const { session } = await getUserAuth();
  const { id: leadId } = leadIdSchema.parse({ id });
  const newLead = updateLeadSchema.parse({
    ...lead,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db
      .update(leads)
      .set(newLead)
      .where(
        and(eq(leads.id, leadId!), eq(leads.orgId, session?.user.activeOrgId!))
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

const updateLeadRawQuery = async ({
  newLead,
  leadId,
  orgId,
  db,
}: {
  newLead: UpdateLeadParams;
  leadId: LeadId;
  orgId: OrgId;
  db: PlanetScaleDatabase<typeof schema>;
}) => {
  const resultSetHeader = await db
    .update(leads)
    .set(newLead)
    .where(and(eq(leads.id, leadId), eq(leads.orgId, orgId)));
  return Number(resultSetHeader.insertId);
};

export const deleteLead = async (id: LeadId) => {
  const { session } = await getUserAuth();
  const { id: leadId } = leadIdSchema.parse({ id });
  try {
    await db
      .delete(leads)
      .where(
        and(eq(leads.id, leadId!), eq(leads.orgId, session?.user.activeOrgId!))
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};
