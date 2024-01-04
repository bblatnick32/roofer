import { getOppById, getOpps } from "@/lib/api/opps/queries";
import { privateProcedure, router } from "@/lib/server/trpc";
import {
  oppIdSchema,
  insertOppParams,
  updateOppParams,
} from "@/lib/db/schema/opps";
import { createOpp, deleteOpp, updateOpp } from "@/lib/api/opps/mutations";

export const oppsRouter = router({
  getOpps: privateProcedure.query(async () => {
    return getOpps();
  }),
  getOppById: privateProcedure.input(oppIdSchema).query(async ({ input }) => {
    return getOppById(input.id);
  }),
  createOpp: privateProcedure
    .input(insertOppParams)
    .mutation(async ({ input }) => {
      return createOpp(input);
    }),
  updateOpp: privateProcedure
    .input(updateOppParams)
    .mutation(async ({ input }) => {
      return updateOpp(input.id, input);
    }),
  deleteOpp: privateProcedure.input(oppIdSchema).mutation(async ({ input }) => {
    return deleteOpp(input.id);
  }),
});
