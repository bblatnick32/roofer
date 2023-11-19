import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type RepairTemplateId,
  repairTemplateIdSchema,
  repairTemplates,
} from "@/lib/db/schema/repairTemplates";

export const getRepairTemplates = async () => {
  const { session } = await getUserAuth();
  const r = await db
    .select()
    .from(repairTemplates)
    .where(eq(repairTemplates.orgId, session?.user.activeOrgId!));
  return { repairTemplates: r };
};

export const getRepairTemplateById = async (id: RepairTemplateId) => {
  const { session } = await getUserAuth();
  const { id: repairTemplateId } = repairTemplateIdSchema.parse({ id });
  const [r] = await db
    .select()
    .from(repairTemplates)
    .where(
      and(
        eq(repairTemplates.id, repairTemplateId),
        eq(repairTemplates.orgId, session?.user.activeOrgId!)
      )
    );
  return { repairTemplate: r };
};
