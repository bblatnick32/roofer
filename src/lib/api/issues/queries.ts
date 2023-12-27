import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type IssueId, issueIdSchema, issues } from "@/lib/db/schema/issues";

export const getIssues = async () => {
  const { session } = await getUserAuth();
  const w = await db
    .select()
    .from(issues)
    .where(eq(issues.orgId, session?.user.activeOrgId!));
  return { issues: w };
};

export const getIssueById = async (id: IssueId) => {
  const { session } = await getUserAuth();
  const { id: issueId } = issueIdSchema.parse({ id });
  const [w] = await db
    .select()
    .from(issues)
    .where(
      and(eq(issues.id, issueId), eq(issues.orgId, session?.user.activeOrgId!))
    );
  return { issue: w };
};

// export const getIssuesByOpportunityId = async (oppId: OpportunityId) => {
//   const { session } = await getUserAuth();
//   const { oppId: opportunityId } = issueOpportunityIdSchema.parse({ oppId });
//   const w = await db.query.issues.findMany({
//     where: and(
//       eq(issues.oppId, opportunityId),
//       eq(issues.orgId, session?.user.activeOrgId!)
//     ),
//     with: {
//       issueTemplate: {
//         columns: {
//           name: true,
//         },
//       },
//       photo: true,
//     },
//   });

//   return { issues: w };
// };
