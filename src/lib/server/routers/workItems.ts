import {
  getWorkItemById,
  getWorkItems,
  getWorkItemsByOpportunityId,
} from "@/lib/api/workItems/queries";
import { privateProcedure, router } from "../trpc";
import {
  workItemIdSchema,
  insertWorkItemParams,
  updateWorkItemParams,
  workItemOpportunityIdSchema,
} from "@/lib/db/schema/workItems";
import {
  createWorkItem,
  deleteWorkItem,
  updateWorkItem,
} from "@/lib/api/workItems/mutations";

export const workItemsRouter = router({
  getWorkItems: privateProcedure.query(async () => {
    return getWorkItems();
  }),
  getWorkItemById: privateProcedure
    .input(workItemIdSchema)
    .query(async ({ input }) => {
      return getWorkItemById(input.id);
    }),
  getWorkItemsByOpportunityId: privateProcedure
    .input(workItemOpportunityIdSchema)
    .query(async ({ input }) => {
      return getWorkItemsByOpportunityId(input.oppId);
    }),
  createWorkItem: privateProcedure
    .input(insertWorkItemParams)
    .mutation(async ({ input }) => {
      return createWorkItem(input);
    }),
  updateWorkItem: privateProcedure
    .input(updateWorkItemParams)
    .mutation(async ({ input }) => {
      return updateWorkItem(input.id, input);
    }),
  deleteWorkItem: privateProcedure
    .input(workItemIdSchema)
    .mutation(async ({ input }) => {
      return deleteWorkItem(input.id);
    }),
});
