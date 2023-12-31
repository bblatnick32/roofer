import { getJobById, getJobs, getLeads } from "@/lib/api/jobs/queries";
import { privateProcedure, router } from "@/lib/server/trpc";
import {
  jobIdSchema,
  insertJobParams,
  updateJobParams,
  insertLeadParams,
  updateLeadParams,
} from "@/lib/db/schema/jobs";
import {
  createJob,
  createLead,
  deleteJob,
  deleteLead,
  updateJob,
  updateLead,
} from "@/lib/api/jobs/mutations";

export const jobsRouter = router({
  getJobs: privateProcedure.query(async () => {
    return getJobs();
  }),
  getJobById: privateProcedure.input(jobIdSchema).query(async ({ input }) => {
    return getJobById(input.id);
  }),
  createJob: privateProcedure
    .input(insertJobParams)
    .mutation(async ({ input }) => {
      return createJob(input);
    }),
  updateJob: privateProcedure
    .input(updateJobParams)
    .mutation(async ({ input }) => {
      return updateJob(input.id, input);
    }),
  deleteJob: privateProcedure.input(jobIdSchema).mutation(async ({ input }) => {
    return deleteJob(input.id);
  }),
  getLeads: privateProcedure.query(async () => {
    return getLeads();
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
  deleteLead: privateProcedure
    .input(jobIdSchema)
    .mutation(async ({ input }) => {
      return deleteLead(input.id);
    }),
});
