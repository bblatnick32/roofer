import { varchar, serial, mysqlTable } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getContacts } from "@/lib/api/contacts/queries";

export const contacts = mysqlTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  company: varchar("company", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }),
  phone: varchar("phone", { length: 256 }),
  address: varchar("address", { length: 256 }),
  userId: varchar("user_id", { length: 256 }).notNull(),
});

// Schema for contacts - used to validate API requests
export const insertContactSchema = createInsertSchema(contacts);

export const insertContactParams = createSelectSchema(contacts, {}).omit({
  id: true,
  userId: true,
});

export const updateContactSchema = createSelectSchema(contacts);

export const updateContactParams = createSelectSchema(contacts, {}).omit({
  userId: true,
});

export const contactIdSchema = updateContactSchema.pick({ id: true });

// Types for contacts - used to type API request params and within Components
export type Contact = z.infer<typeof updateContactSchema>;
export type NewContact = z.infer<typeof insertContactSchema>;
export type NewContactParams = z.infer<typeof insertContactParams>;
export type UpdateContactParams = z.infer<typeof updateContactParams>;
export type ContactId = z.infer<typeof contactIdSchema>["id"];

// this type infers the return from getContacts() - meaning it will include any joins
export type CompleteContact = Awaited<
  ReturnType<typeof getContacts>
>["contacts"][number];
