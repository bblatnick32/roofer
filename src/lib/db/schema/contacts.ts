import {
  varchar,
  serial,
  mysqlTable,
  bigint,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getContacts } from "@/lib/api/contacts/queries";
import { relations } from "drizzle-orm";
import { orgs } from "./orgs";
import { leads } from "./leads";
import { companies } from "./companies";
import { opportunityContacts } from "./opportunityContacts";

export const contacts = mysqlTable(
  "contacts",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    email: varchar("email", { length: 256 }),
    phone: varchar("phone", { length: 256 }),
    address: varchar("address", { length: 256 }),
    orgId: varchar("org_id", { length: 256 })
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),
    leadId: bigint("lead_id", { mode: "number", unsigned: true }),
    companyId: bigint("company_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      idIdx: uniqueIndex("id_idx").on(table.id),
    };
  }
);

// relations
export const contactsRelations = relations(contacts, ({ many, one }) => ({
  org: one(orgs, {
    fields: [contacts.orgId],
    references: [orgs.id],
  }),
  lead: one(leads, {
    fields: [contacts.leadId],
    references: [leads.id],
  }),
  company: one(companies, {
    fields: [contacts.companyId],
    references: [companies.id],
  }),
  opportunityContacts: many(opportunityContacts),
}));

// Schema for contacts - used to validate API requests
export const insertContactSchema = createInsertSchema(contacts);

export const insertContactFromLeadSchema = createInsertSchema(contacts)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .required({
    leadId: true,
  });

export const insertContactParams = createSelectSchema(contacts, {
  name: z.string().min(1, "Name cannot be empty."),
}).omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
  leadId: true,
});

export const updateContactSchema = createSelectSchema(contacts, {}).omit({
  createdAt: true,
  updatedAt: true,
  leadId: true,
});

export const updateContactParams = createSelectSchema(contacts, {
  name: z.string().min(1, "Name cannot be empty."),
}).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
  leadId: true,
});

export const contactIdSchema = updateContactSchema.pick({ id: true });

// Types for contacts - used to type API request params and within Components
export type Contact = z.infer<typeof updateContactSchema>;
export type NewContact = z.infer<typeof insertContactSchema>;
export type NewContactFromLead = z.infer<typeof insertContactFromLeadSchema>;
export type NewContactParams = z.infer<typeof insertContactParams>;
export type UpdateContactParams = z.infer<typeof updateContactParams>;
export type ContactId = z.infer<typeof contactIdSchema>["id"];

// this type infers the return from getContacts() - meaning it will include any joins
export type CompleteContact = Awaited<
  ReturnType<typeof getContacts>
>["contacts"][number];
