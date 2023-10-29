import { getLeadById, getLeads } from "@/lib/api/leads/queries";
import { publicProcedure, router } from "../trpc";
import {
  leadIdSchema,
  insertLeadParams,
  updateLeadParams,
} from "@/lib/db/schema/leads";
import { createLead, deleteLead, updateLead } from "@/lib/api/leads/mutations";

export const leadsRouter = router({
  getLeads: publicProcedure.query(async () => {
    return getLeads();
  }),
  getLeadById: publicProcedure.input(leadIdSchema).query(async ({ input }) => {
    return getLeadById(input.id);
  }),
  createLead: publicProcedure
    .input(insertLeadParams)
    .mutation(async ({ input }) => {
      return createLead(input);
    }),
  updateLead: publicProcedure
    .input(updateLeadParams)
    .mutation(async ({ input }) => {
      return updateLead(input.id, input);
    }),
  deleteLead: publicProcedure
    .input(leadIdSchema)
    .mutation(async ({ input }) => {
      return deleteLead(input.id);
    }),
});
