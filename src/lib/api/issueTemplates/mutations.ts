import { db } from "@/lib/db/client";
import { and, eq } from "drizzle-orm";
import {
  IssueTemplateId,
  NewIssueTemplateParams,
  UpdateIssueTemplateParams,
  updateIssueTemplateSchema,
  insertIssueTemplateSchema,
  issueTemplates,
  issueTemplateIdSchema,
} from "@/lib/db/schema/issueTemplates";
import { getUserAuth } from "@/lib/auth/utils";

export const createIssueTemplate = async (
  issueTemplate: NewIssueTemplateParams
) => {
  const { session } = await getUserAuth();
  const newIssueTemplate = insertIssueTemplateSchema.parse({
    ...issueTemplate,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db.insert(issueTemplates).values(newIssueTemplate);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateIssueTemplate = async (
  id: IssueTemplateId,
  issueTemplate: UpdateIssueTemplateParams
) => {
  const { session } = await getUserAuth();
  const { id: issueTemplateId } = issueTemplateIdSchema.parse({ id });
  const newIssueTemplate = updateIssueTemplateSchema.parse({
    ...issueTemplate,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db
      .update(issueTemplates)
      .set(newIssueTemplate)
      .where(
        and(
          eq(issueTemplates.id, issueTemplateId!),
          eq(issueTemplates.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteIssueTemplate = async (id: IssueTemplateId) => {
  const { session } = await getUserAuth();
  const { id: issueTemplateId } = issueTemplateIdSchema.parse({ id });
  try {
    await db
      .delete(issueTemplates)
      .where(
        and(
          eq(issueTemplates.id, issueTemplateId!),
          eq(issueTemplates.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};
