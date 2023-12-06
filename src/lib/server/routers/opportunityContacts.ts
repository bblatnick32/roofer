import { getOpportunityContactById, getOpportunityContacts } from "@/lib/api/opportunityContacts/queries";
import { privateProcedure, router } from "@/lib/server/trpc";
import {
  opportunityContactIdSchema,
  insertOpportunityContactParams,
  updateOpportunityContactParams,
} from "@/lib/db/schema/opportunityContacts";
import { createOpportunityContact, deleteOpportunityContact, updateOpportunityContact } from "@/lib/api/opportunityContacts/mutations";

export const opportunityContactsRouter = router({
  getOpportunityContacts: privateProcedure.query(async () => {
    return getOpportunityContacts();
  }),
  getOpportunityContactById: privateProcedure.input(opportunityContactIdSchema).query(async ({ input }) => {
    return getOpportunityContactById(input.id);
  }),
  createOpportunityContact: privateProcedure
    .input(insertOpportunityContactParams)
    .mutation(async ({ input }) => {
      return createOpportunityContact(input);
    }),
  updateOpportunityContact: privateProcedure
    .input(updateOpportunityContactParams)
    .mutation(async ({ input }) => {
      return updateOpportunityContact(input.id, input);
    }),
  deleteOpportunityContact: privateProcedure
    .input(opportunityContactIdSchema)
    .mutation(async ({ input }) => {
      return deleteOpportunityContact(input.id);
    }),
});
