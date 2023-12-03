import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import {
  IssueId,
  NewIssueParams,
  UpdateIssueParams,
  updateIssueSchema,
  insertIssueSchema,
  issues,
  issueIdSchema,
} from "@/lib/db/schema/issues";
import { getUserAuth } from "@/lib/auth/utils";

export const createIssue = async (issue: NewIssueParams) => {
  const { session } = await getUserAuth();
  const newIssue = insertIssueSchema.parse({
    ...issue,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db.insert(issues).values(newIssue);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateIssue = async (id: IssueId, issue: UpdateIssueParams) => {
  const { session } = await getUserAuth();
  const { id: issueId } = issueIdSchema.parse({ id });
  const newIssue = updateIssueSchema.parse({
    ...issue,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db
      .update(issues)
      .set(newIssue)
      .where(
        and(
          eq(issues.id, issueId!),
          eq(issues.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteIssue = async (id: IssueId) => {
  const { session } = await getUserAuth();
  const { id: issueId } = issueIdSchema.parse({ id });
  try {
    await db
      .delete(issues)
      .where(
        and(
          eq(issues.id, issueId!),
          eq(issues.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};
