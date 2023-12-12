import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type CompanyId,
  companyIdSchema,
  companies,
  CompanyName,
} from "@/lib/db/schema/companies";
import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import * as schema from "@/lib/db";
import { OrgId } from "@/lib/db/schema/orgs";

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

export const getCompanyByNameRawQuery = async ({
  name,
  orgId,
  db,
}: {
  name: CompanyName;
  orgId: OrgId;
  db: PlanetScaleDatabase<typeof schema>;
}) => {
  const [c] = await db
    .select()
    .from(companies)
    .where(and(eq(companies.name, name), eq(companies.orgId, orgId)));
  return { company: c };
};
