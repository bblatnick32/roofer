import { db } from "@/lib/db/client";
import { and, eq } from "drizzle-orm";
import {
  PropertyId,
  NewPropertyParams,
  UpdatePropertyParams,
  updatePropertySchema,
  insertPropertySchema,
  properties,
  propertyIdSchema,
} from "@/lib/db/schema/properties";
import { getUserAuth } from "@/lib/auth/utils";

export const createProperty = async (property: NewPropertyParams) => {
  const { session } = await getUserAuth();
  const newProperty = insertPropertySchema.parse({
    ...property,
    orgId: session?.user.activeOrgId!,
  });
  try {
    const insertResult = await db.insert(properties).values(newProperty);
    return { success: true, id: insertResult.insertId };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateProperty = async (
  id: PropertyId,
  property: UpdatePropertyParams
) => {
  const { session } = await getUserAuth();
  const { id: propertyId } = propertyIdSchema.parse({ id });
  const newProperty = updatePropertySchema.parse({
    ...property,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db
      .update(properties)
      .set(newProperty)
      .where(
        and(
          eq(properties.id, propertyId!),
          eq(properties.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteProperty = async (id: PropertyId) => {
  const { session } = await getUserAuth();
  const { id: propertyId } = propertyIdSchema.parse({ id });
  try {
    await db
      .delete(properties)
      .where(
        and(
          eq(properties.id, propertyId!),
          eq(properties.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};
