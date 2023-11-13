import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import {
  RepairTemplateId,
  NewRepairTemplateParams,
  UpdateRepairTemplateParams,
  updateRepairTemplateSchema,
  insertRepairTemplateSchema,
  repairTemplates,
  repairTemplateIdSchema,
} from "@/lib/db/schema/repairTemplates";
import { getUserAuth } from "@/lib/auth/utils";

export const createRepairTemplate = async (
  repairTemplate: NewRepairTemplateParams
) => {
  const { session } = await getUserAuth();
  const newRepairTemplate = insertRepairTemplateSchema.parse({
    ...repairTemplate,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db.insert(repairTemplates).values(newRepairTemplate);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateRepairTemplate = async (
  id: RepairTemplateId,
  repairTemplate: UpdateRepairTemplateParams
) => {
  const { session } = await getUserAuth();
  const { id: repairTemplateId } = repairTemplateIdSchema.parse({ id });
  const newRepairTemplate = updateRepairTemplateSchema.parse({
    ...repairTemplate,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db
      .update(repairTemplates)
      .set(newRepairTemplate)
      .where(
        and(
          eq(repairTemplates.id, repairTemplateId!),
          eq(repairTemplates.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteRepairTemplate = async (id: RepairTemplateId) => {
  const { session } = await getUserAuth();
  const { id: repairTemplateId } = repairTemplateIdSchema.parse({ id });
  try {
    await db
      .delete(repairTemplates)
      .where(
        and(
          eq(repairTemplates.id, repairTemplateId!),
          eq(repairTemplates.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};
