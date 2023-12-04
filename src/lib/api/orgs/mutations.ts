import { db } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import {
  OrgId,
  UpdateOrgParams,
  updateOrgSchema,
  orgs,
  orgIdSchema,
  NewOrg,
} from "@/lib/db/schema/orgs";

export const createOrg = async (org: NewOrg) => {
  try {
    await db.insert(orgs).values(org);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateOrg = async (id: OrgId, org: UpdateOrgParams) => {
  const { id: orgId } = orgIdSchema.parse({ id });
  const newOrg = updateOrgSchema.parse(org);
  try {
    await db.update(orgs).set(newOrg).where(eq(orgs.id, orgId!));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteOrg = async (id: OrgId) => {
  const { id: orgId } = orgIdSchema.parse({ id });
  try {
    await db.delete(orgs).where(eq(orgs.id, orgId!));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};
