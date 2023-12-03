import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type IssueTemplateId,
  issueTemplateIdSchema,
  issueTemplates,
} from "@/lib/db/schema/issueTemplates";

export const getIssueTemplates = async () => {
  const { session } = await getUserAuth();
  const i = await db
    .select()
    .from(issueTemplates)
    .where(eq(issueTemplates.orgId, session?.user.activeOrgId!));
  return { issueTemplates: i };
};

export const getIssueTemplateById = async (id: IssueTemplateId) => {
  const { session } = await getUserAuth();
  const { id: issueTemplateId } = issueTemplateIdSchema.parse({ id });
  const [i] = await db
    .select()
    .from(issueTemplates)
    .where(
      and(
        eq(issueTemplates.id, issueTemplateId),
        eq(issueTemplates.orgId, session?.user.activeOrgId!)
      )
    );
  return { issueTemplate: i };
};
