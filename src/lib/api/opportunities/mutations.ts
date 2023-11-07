import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { 
  OpportunitieId, 
  NewOpportunitieParams,
  UpdateOpportunitieParams, 
  updateOpportunitieSchema,
  insertOpportunitieSchema, 
  opportunities,
  opportunitieIdSchema 
} from "@/lib/db/schema/opportunities";
import { getUserAuth } from "@/lib/auth/utils";

export const createOpportunitie = async (opportunitie: NewOpportunitieParams) => {
  const { session } = await getUserAuth();
  const newOpportunitie = insertOpportunitieSchema.parse({ ...opportunitie, userId: session?.user.id! });
  try {
    await db.insert(opportunities).values(newOpportunitie)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateOpportunitie = async (id: OpportunitieId, opportunitie: UpdateOpportunitieParams) => {
  const { session } = await getUserAuth();
  const { id: opportunitieId } = opportunitieIdSchema.parse({ id });
  const newOpportunitie = updateOpportunitieSchema.parse({ ...opportunitie, userId: session?.user.id! });
  try {
    await db
     .update(opportunities)
     .set(newOpportunitie)
     .where(and(eq(opportunities.id, opportunitieId!), eq(opportunities.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteOpportunitie = async (id: OpportunitieId) => {
  const { session } = await getUserAuth();
  const { id: opportunitieId } = opportunitieIdSchema.parse({ id });
  try {
    await db.delete(opportunities).where(and(eq(opportunities.id, opportunitieId!), eq(opportunities.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

