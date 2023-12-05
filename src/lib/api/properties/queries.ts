import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type PropertyId,
  propertyIdSchema,
  properties,
} from "@/lib/db/schema/properties";

export const getProperties = async () => {
  const { session } = await getUserAuth();
  const p = await db
    .select()
    .from(properties)
    .where(eq(properties.orgId, session?.user.activeOrgId!));
  return { properties: p };
};

export const getPropertyById = async (id: PropertyId) => {
  const { session } = await getUserAuth();
  const { id: propertyId } = propertyIdSchema.parse({ id });
  const [p] = await db
    .select()
    .from(properties)
    .where(
      and(
        eq(properties.id, propertyId),
        eq(properties.orgId, session?.user.activeOrgId!)
      )
    );
  return { property: p };
};
