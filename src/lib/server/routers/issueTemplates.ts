import {
  getIssueTemplateById,
  getIssueTemplates,
} from "@/lib/api/issueTemplates/queries";
import { privateProcedure, router } from "../trpc";
import {
  issueTemplateIdSchema,
  insertIssueTemplateParams,
  updateIssueTemplateParams,
} from "@/lib/db/schema/issueTemplates";
import {
  createIssueTemplate,
  deleteIssueTemplate,
  updateIssueTemplate,
} from "@/lib/api/issueTemplates/mutations";

export const issueTemplatesRouter = router({
  getIssueTemplates: privateProcedure.query(async () => {
    return getIssueTemplates();
  }),
  getIssueTemplateById: privateProcedure
    .input(issueTemplateIdSchema)
    .query(async ({ input }) => {
      return getIssueTemplateById(input.id);
    }),
  createIssueTemplate: privateProcedure
    .input(insertIssueTemplateParams)
    .mutation(async ({ input }) => {
      return createIssueTemplate(input);
    }),
  updateIssueTemplate: privateProcedure
    .input(updateIssueTemplateParams)
    .mutation(async ({ input }) => {
      return updateIssueTemplate(input.id, input);
    }),
  deleteIssueTemplate: privateProcedure
    .input(issueTemplateIdSchema)
    .mutation(async ({ input }) => {
      return deleteIssueTemplate(input.id);
    }),
});
