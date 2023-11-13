import {
  getRepairTemplateById,
  getRepairTemplates,
} from "@/lib/api/repairTemplates/queries";
import { privateProcedure, router } from "../trpc";
import {
  repairTemplateIdSchema,
  insertRepairTemplateParams,
  updateRepairTemplateParams,
} from "@/lib/db/schema/repairTemplates";
import {
  createRepairTemplate,
  deleteRepairTemplate,
  updateRepairTemplate,
} from "@/lib/api/repairTemplates/mutations";

export const repairTemplatesRouter = router({
  getRepairTemplates: privateProcedure.query(async () => {
    return getRepairTemplates();
  }),
  getRepairTemplateById: privateProcedure
    .input(repairTemplateIdSchema)
    .query(async ({ input }) => {
      return getRepairTemplateById(input.id);
    }),
  createRepairTemplate: privateProcedure
    .input(insertRepairTemplateParams)
    .mutation(async ({ input }) => {
      return createRepairTemplate(input);
    }),
  updateRepairTemplate: privateProcedure
    .input(updateRepairTemplateParams)
    .mutation(async ({ input }) => {
      return updateRepairTemplate(input.id, input);
    }),
  deleteRepairTemplate: privateProcedure
    .input(repairTemplateIdSchema)
    .mutation(async ({ input }) => {
      return deleteRepairTemplate(input.id);
    }),
});
