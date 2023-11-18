import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type WorkItemId,
  workItemIdSchema,
  workItems,
  workItemOpportunityIdSchema,
} from "@/lib/db/schema/workItems";
import { OpportunityId } from "@/lib/db/schema/opportunities";
import { issueTemplates } from "@/lib/db/schema/issueTemplates";

export const getWorkItems = async () => {
  const { session } = await getUserAuth();
  const w = await db
    .select()
    .from(workItems)
    .where(eq(workItems.orgId, session?.user.activeOrgId!));
  return { workItems: w };
};

export const getWorkItemById = async (id: WorkItemId) => {
  const { session } = await getUserAuth();
  const { id: workItemId } = workItemIdSchema.parse({ id });
  const [w] = await db
    .select()
    .from(workItems)
    .where(
      and(
        eq(workItems.id, workItemId),
        eq(workItems.orgId, session?.user.activeOrgId!)
      )
    );
  return { workItem: w };
};

export const getWorkItemsByOpportunityId = async (oppId: OpportunityId) => {
  const { session } = await getUserAuth();
  const { oppId: opportunityId } = workItemOpportunityIdSchema.parse({ oppId });
  const p = await db
    .select({
      id: workItems.id,
      name: issueTemplates.name,
      createdAt: workItems.createdAt,
    })
    .from(workItems)
    .leftJoin(issueTemplates, eq(workItems.issueTemplateId, issueTemplates.id))
    .where(
      and(
        eq(workItems.oppId, opportunityId),
        eq(workItems.orgId, session?.user.activeOrgId!)
      )
    );
  return { workItems: p };
};
