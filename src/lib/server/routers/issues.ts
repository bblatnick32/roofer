import {
  getIssueById,
  getIssues,
  getIssuesByOpportunityId,
} from "@/lib/api/issues/queries";
import { privateProcedure, router } from "../trpc";
import {
  issueIdSchema,
  insertIssueParams,
  updateIssueParams,
  issueOpportunityIdSchema,
} from "@/lib/db/schema/issues";
import {
  createIssue,
  deleteIssue,
  updateIssue,
} from "@/lib/api/issues/mutations";

export const issuesRouter = router({
  getIssues: privateProcedure.query(async () => {
    return getIssues();
  }),
  getIssueById: privateProcedure
    .input(issueIdSchema)
    .query(async ({ input }) => {
      return getIssueById(input.id);
    }),
  getIssuesByOpportunityId: privateProcedure
    .input(issueOpportunityIdSchema)
    .query(async ({ input }) => {
      return getIssuesByOpportunityId(input.oppId);
    }),
  createIssue: privateProcedure
    .input(insertIssueParams)
    .mutation(async ({ input }) => {
      return createIssue(input);
    }),
  updateIssue: privateProcedure
    .input(updateIssueParams)
    .mutation(async ({ input }) => {
      return updateIssue(input.id, input);
    }),
  deleteIssue: privateProcedure
    .input(issueIdSchema)
    .mutation(async ({ input }) => {
      return deleteIssue(input.id);
    }),
});
