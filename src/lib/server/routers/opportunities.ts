import { getOpportunitieById, getOpportunities } from "@/lib/api/opportunities/queries";
import { publicProcedure, router } from "../trpc";
import {
  opportunitieIdSchema,
  insertOpportunitieParams,
  updateOpportunitieParams,
} from "@/lib/db/schema/opportunities";
import { createOpportunitie, deleteOpportunitie, updateOpportunitie } from "@/lib/api/opportunities/mutations";

export const opportunitiesRouter = router({
  getOpportunities: publicProcedure.query(async () => {
    return getOpportunities();
  }),
  getOpportunitieById: publicProcedure.input(opportunitieIdSchema).query(async ({ input }) => {
    return getOpportunitieById(input.id);
  }),
  createOpportunitie: publicProcedure
    .input(insertOpportunitieParams)
    .mutation(async ({ input }) => {
      return createOpportunitie(input);
    }),
  updateOpportunitie: publicProcedure
    .input(updateOpportunitieParams)
    .mutation(async ({ input }) => {
      return updateOpportunitie(input.id, input);
    }),
  deleteOpportunitie: publicProcedure
    .input(opportunitieIdSchema)
    .mutation(async ({ input }) => {
      return deleteOpportunitie(input.id);
    }),
});
