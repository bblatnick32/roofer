import {
  varchar,
  mysqlTable,
  bigint,
  primaryKey,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getOpportunityContacts } from "@/lib/api/opportunityContacts/queries";
import { opportunities } from "./opportunities";
import { contacts } from "./contacts";
import { orgs } from "./orgs";
import { relations } from "drizzle-orm";

export const opportunityContacts = mysqlTable(
  "opportunity_contacts",
  {
    opportunityId: bigint("opportunity_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => opportunities.id, { onDelete: "cascade" }),
    contactId: bigint("contact_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => contacts.id, { onDelete: "cascade" }),
    orgId: varchar("org_id", { length: 256 }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.contactId, table.opportunityId] }),
    };
  }
);

export const opportunityContactsRelations = relations(
  opportunityContacts,
  ({ one }) => ({
    org: one(orgs, {
      fields: [opportunityContacts.orgId],
      references: [orgs.id],
    }),
    opportunity: one(opportunities, {
      fields: [opportunityContacts.opportunityId],
      references: [opportunities.id],
    }),
    contact: one(contacts, {
      fields: [opportunityContacts.contactId],
      references: [contacts.id],
    }),
  })
);

// Schema for opportunityContacts - used to validate API requests
export const insertOpportunityContactSchema =
  createInsertSchema(opportunityContacts);

export const insertOpportunityContactParams = createSelectSchema(
  opportunityContacts,
  {
    opportunityId: z.coerce.number(),
    contactId: z.coerce.number(),
  }
).omit({
  id: true,
  orgId: true,
});

export const updateOpportunityContactSchema =
  createSelectSchema(opportunityContacts);

export const updateOpportunityContactParams = createSelectSchema(
  opportunityContacts,
  {
    opportunityId: z.coerce.number(),
    contactId: z.coerce.number(),
  }
).omit({
  orgId: true,
});

export const opportunityContactIdSchema = updateOpportunityContactSchema;

// Types for opportunityContacts - used to type API request params and within Components
export type OpportunityContact = z.infer<typeof updateOpportunityContactSchema>;
export type NewOpportunityContact = z.infer<
  typeof insertOpportunityContactSchema
>;
export type NewOpportunityContactParams = z.infer<
  typeof insertOpportunityContactParams
>;
export type UpdateOpportunityContactParams = z.infer<
  typeof updateOpportunityContactParams
>;

// this type infers the return from getOpportunityContacts() - meaning it will include any joins
export type CompleteOpportunityContact = Awaited<
  ReturnType<typeof getOpportunityContacts>
>["opportunityContacts"][number];
