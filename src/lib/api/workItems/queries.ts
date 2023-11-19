import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type WorkItemId,
  workItemIdSchema,
  workItems,
  workItemOpportunityIdSchema,
} from "@/lib/db/schema/workItems";
import { OpportunityId } from "@/lib/db/schema/opportunities";

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
  const w = await db.query.workItems.findMany({
    where: and(
      eq(workItems.oppId, opportunityId),
      eq(workItems.orgId, session?.user.activeOrgId!)
    ),
    with: {
      issueTemplate: {
        columns: {
          name: true,
        },
      },
      photo: true,
    },
  });

  return { workItems: w };
};
