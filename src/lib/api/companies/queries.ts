import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type CompanyId,
  companyIdSchema,
  companies,
} from "@/lib/db/schema/companies";

export const getCompanies = async () => {
  const { session } = await getUserAuth();
  const c = await db
    .select()
    .from(companies)
    .where(eq(companies.orgId, session?.user.activeOrgId!));
  return { companies: c };
};

export const getCompanyById = async (id: CompanyId) => {
  const { session } = await getUserAuth();
  const { id: companyId } = companyIdSchema.parse({ id });
  const [c] = await db
    .select()
    .from(companies)
    .where(
      and(
        eq(companies.id, companyId),
        eq(companies.orgId, session?.user.activeOrgId!)
      )
    );
  return { company: c };
};
