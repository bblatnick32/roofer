import { db } from "@/lib/db/client";
import { and, eq } from "drizzle-orm";
import {
  ContactId,
  NewContactParams,
  UpdateContactParams,
  updateContactSchema,
  insertContactSchema,
  contacts,
  contactIdSchema,
  NewContactFromLead,
} from "@/lib/db/schema/contacts";
import { getUserAuth } from "@/lib/auth/utils";
import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import * as schema from "@/lib/db";

export const createContact = async (contact: NewContactParams) => {
  const { session } = await getUserAuth();
  const newContact = insertContactSchema.parse({
    ...contact,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db.insert(contacts).values(newContact);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateContact = async (
  id: ContactId,
  contact: UpdateContactParams
) => {
  const { session } = await getUserAuth();
  const { id: contactId } = contactIdSchema.parse({ id });
  const newContact = updateContactSchema.parse({
    ...contact,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db
      .update(contacts)
      .set(newContact)
      .where(
        and(
          eq(contacts.id, contactId!),
          eq(contacts.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteContact = async (id: ContactId) => {
  const { session } = await getUserAuth();
  const { id: contactId } = contactIdSchema.parse({ id });
  try {
    await db
      .delete(contacts)
      .where(
        and(
          eq(contacts.id, contactId!),
          eq(contacts.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const insertContactFromLeadRawQuery = async ({
  newContact,
  db,
}: {
  db: PlanetScaleDatabase<typeof schema>;
  newContact: NewContactFromLead;
}) => {
  const resultSetHeader = await db.insert(contacts).values(newContact);
  return Number(resultSetHeader.insertId);
};
