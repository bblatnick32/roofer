import { getLeadById, getLeads } from "@/lib/api/leads/queries";
import { privateProcedure, router } from "../trpc";
import {
  leadIdSchema,
  insertLeadParams,
  updateLeadParams,
} from "@/lib/db/schema/leads";
import {
  convertLead,
  createLead,
  deleteLead,
  updateLead,
} from "@/lib/api/leads/mutations";

export const leadsRouter = router({
  getLeads: privateProcedure.query(async () => {
    return getLeads();
  }),
  getLeadById: privateProcedure.input(leadIdSchema).query(async ({ input }) => {
    return getLeadById(input.id);
  }),
  createLead: privateProcedure
    .input(insertLeadParams)
    .mutation(async ({ input }) => {
      return createLead(input);
    }),
  updateLead: privateProcedure
    .input(updateLeadParams)
    .mutation(async ({ input }) => {
      return updateLead(input.id, input);
    }),
  convertLead: privateProcedure
    .input(updateLeadParams)
    .mutation(async ({ input }) => {
      return convertLead(input.id, input);
    }),
  deleteLead: privateProcedure
    .input(leadIdSchema)
    .mutation(async ({ input }) => {
      return deleteLead(input.id);
    }),
});
