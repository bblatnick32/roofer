import { db } from "@/lib/db/client";
import { and, eq } from "drizzle-orm";
import {
  CompanyId,
  NewCompanyParams,
  UpdateCompanyParams,
  updateCompanySchema,
  insertCompanySchema,
  companies,
  companyIdSchema,
} from "@/lib/db/schema/companies";
import { getUserAuth } from "@/lib/auth/utils";

export const createCompany = async (company: NewCompanyParams) => {
  const { session } = await getUserAuth();
  const newCompany = insertCompanySchema.parse({
    ...company,
    orgId: session?.user.activeOrgId!,
  });
  try {
    const insertResult = await db.insert(companies).values(newCompany);
    return { success: true, id: insertResult.insertId };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateCompany = async (
  id: CompanyId,
  company: UpdateCompanyParams
) => {
  const { session } = await getUserAuth();
  const { id: companyId } = companyIdSchema.parse({ id });
  const newCompany = updateCompanySchema.parse({
    ...company,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db
      .update(companies)
      .set(newCompany)
      .where(
        and(
          eq(companies.id, companyId!),
          eq(companies.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteCompany = async (id: CompanyId) => {
  const { session } = await getUserAuth();
  const { id: companyId } = companyIdSchema.parse({ id });
  try {
    await db
      .delete(companies)
      .where(
        and(
          eq(companies.id, companyId!),
          eq(companies.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};
