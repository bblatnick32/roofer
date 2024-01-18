import { db } from "@/lib/db/client";
import { and, eq } from "drizzle-orm";
import {
  OppId,
  NewOppParams,
  UpdateOppParams,
  updateOppSchema,
  insertOppSchema,
  opps,
  oppIdSchema,
  OppStages,
} from "@/lib/db/schema/opps";
import { getUserAuth } from "@/lib/auth/utils";

export const createOpp = async (opp: NewOppParams) => {
  const { session } = await getUserAuth();
  const newOpp = insertOppSchema.parse({
    ...opp,
    orgId: session?.user.activeOrgId!,
  });
  try {
    const insertResult = await db.insert(opps).values(newOpp);
    return { success: true, id: insertResult.insertId };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateOpp = async (id: OppId, opp: UpdateOppParams) => {
  const { session } = await getUserAuth();
  const { id: oppId } = oppIdSchema.parse({ id });

  opp.stage = getStageForOpp(opp);

  const newOpp = updateOppSchema.parse({
    ...opp,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db
      .update(opps)
      .set(newOpp)
      .where(
        and(eq(opps.id, oppId!), eq(opps.orgId, session?.user.activeOrgId!))
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteOpp = async (id: OppId) => {
  const { session } = await getUserAuth();
  const { id: oppId } = oppIdSchema.parse({ id });
  try {
    await db
      .delete(opps)
      .where(
        and(eq(opps.id, oppId!), eq(opps.orgId, session?.user.activeOrgId!))
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

const getStageForOpp = (opp: UpdateOppParams) => {
  // if stage is lead and companyId, propertyId, contactId, and description all not null, set stage to inspection
  if (
    opp.stage === OppStages.LEAD &&
    opp.companyId &&
    opp.propertyId &&
    opp.contactId &&
    opp.description
  ) {
    return OppStages.INSPECTION;
  }

  return OppStages.LEAD;
};
