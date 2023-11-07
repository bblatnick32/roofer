import {
  getOpportunities,
  getOpportunityById,
} from "@/lib/api/opportunities/queries";
import { privateProcedure, router } from "../trpc";
import {
  insertOpportunityParams,
  opportunityIdSchema,
  updateOpportunityParams,
} from "@/lib/db/schema/opportunities";
import {
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from "@/lib/api/opportunities/mutations";

export const opportunitiesRouter = router({
  getOpportunities: privateProcedure.query(async () => {
    return getOpportunities();
  }),
  getOpportunityById: privateProcedure
    .input(opportunityIdSchema)
    .query(async ({ input }) => {
      return getOpportunityById(input.id);
    }),
  createOpportunity: privateProcedure
    .input(insertOpportunityParams)
    .mutation(async ({ input }) => {
      return createOpportunity(input);
    }),
  updateOpportunity: privateProcedure
    .input(updateOpportunityParams)
    .mutation(async ({ input }) => {
      return updateOpportunity(input.id, input);
    }),
  deleteOpportunity: privateProcedure
    .input(opportunityIdSchema)
    .mutation(async ({ input }) => {
      return deleteOpportunity(input.id);
    }),
});
