import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type ContactId,
  contactIdSchema,
  contacts,
} from "@/lib/db/schema/contacts";

export const getContacts = async () => {
  const { session } = await getUserAuth();
  const c = await db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, session?.user.id!));
  return { contacts: c };
};

export const getContactById = async (id: ContactId) => {
  const { session } = await getUserAuth();
  const { id: contactId } = contactIdSchema.parse({ id });
  const [c] = await db
    .select()
    .from(contacts)
    .where(
      and(eq(contacts.id, contactId), eq(contacts.userId, session?.user.id!))
    );
  return { contact: c };
};
