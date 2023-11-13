import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import {
  WorkItemId,
  NewWorkItemParams,
  UpdateWorkItemParams,
  updateWorkItemSchema,
  insertWorkItemSchema,
  workItems,
  workItemIdSchema,
} from "@/lib/db/schema/workItems";
import { getUserAuth } from "@/lib/auth/utils";

export const createWorkItem = async (workItem: NewWorkItemParams) => {
  const { session } = await getUserAuth();
  const newWorkItem = insertWorkItemSchema.parse({
    ...workItem,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db.insert(workItems).values(newWorkItem);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateWorkItem = async (
  id: WorkItemId,
  workItem: UpdateWorkItemParams
) => {
  const { session } = await getUserAuth();
  const { id: workItemId } = workItemIdSchema.parse({ id });
  const newWorkItem = updateWorkItemSchema.parse({
    ...workItem,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db
      .update(workItems)
      .set(newWorkItem)
      .where(
        and(
          eq(workItems.id, workItemId!),
          eq(workItems.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteWorkItem = async (id: WorkItemId) => {
  const { session } = await getUserAuth();
  const { id: workItemId } = workItemIdSchema.parse({ id });
  try {
    await db
      .delete(workItems)
      .where(
        and(
          eq(workItems.id, workItemId!),
          eq(workItems.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};
