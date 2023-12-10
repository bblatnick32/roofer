import { getOpportunityProperties } from "@/lib/api/opportunityProperties/queries";
import { privateProcedure, router } from "@/lib/server/trpc";
import { insertOpportunityPropertyParams } from "@/lib/db/schema/opportunityProperties";
import { createOpportunityProperty } from "@/lib/api/opportunityProperties/mutations";

export const opportunityPropertiesRouter = router({
  getOpportunityProperties: privateProcedure.query(async () => {
    return getOpportunityProperties();
  }),
  // getOpportunityPropertyById: privateProcedure.input(opportunityPropertyIdSchema).query(async ({ input }) => {
  //   return getOpportunityPropertyById(input.id);
  // }),
  createOpportunityProperty: privateProcedure
    .input(insertOpportunityPropertyParams)
    .mutation(async ({ input }) => {
      return createOpportunityProperty(input);
    }),
  // updateOpportunityProperty: privateProcedure
  //   .input(updateOpportunityPropertyParams)
  //   .mutation(async ({ input }) => {
  //     return updateOpportunityProperty(input.id, input);
  //   }),
  // deleteOpportunityProperty: privateProcedure
  //   .input(opportunityPropertyIdSchema)
  //   .mutation(async ({ input }) => {
  //     return deleteOpportunityProperty(input.id);
  //   }),
});
