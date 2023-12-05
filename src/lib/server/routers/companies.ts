import { getCompanyById, getCompanies } from "@/lib/api/companies/queries";
import { router, privateProcedure } from "@/lib/server/trpc";
import {
  companyIdSchema,
  insertCompanyParams,
  updateCompanyParams,
} from "@/lib/db/schema/companies";
import {
  createCompany,
  deleteCompany,
  updateCompany,
} from "@/lib/api/companies/mutations";

export const companiesRouter = router({
  getCompanies: privateProcedure.query(async () => {
    return getCompanies();
  }),
  getCompanyById: privateProcedure
    .input(companyIdSchema)
    .query(async ({ input }) => {
      return getCompanyById(input.id);
    }),
  createCompany: privateProcedure
    .input(insertCompanyParams)
    .mutation(async ({ input }) => {
      return createCompany(input);
    }),
  updateCompany: privateProcedure
    .input(updateCompanyParams)
    .mutation(async ({ input }) => {
      return updateCompany(input.id, input);
    }),
  deleteCompany: privateProcedure
    .input(companyIdSchema)
    .mutation(async ({ input }) => {
      return deleteCompany(input.id);
    }),
});
