import {
  varchar,
  serial,
  mysqlTable,
  mysqlEnum,
  timestamp,
  bigint,
  json,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getLeads } from "@/lib/api/leads/queries";
import { relations } from "drizzle-orm";
import { orgs } from "./orgs";
import { contacts } from "./contacts";

export const LEAD_NEW = "New";
export const LEAD_CONTACTED = "Contacted";
export const LEAD_CLOSED = "Closed - Not Converted";
export const LEAD_CONVERTED = "Converted";

export const LeadStatuses = [
  LEAD_NEW,
  LEAD_CONTACTED,
  LEAD_CLOSED,
  LEAD_CONVERTED,
] as const;

type Property = {
  name: string;
};

export type Properties = Property[];

export const leads = mysqlTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  company: varchar("company", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }),
  phone: varchar("phone", { length: 256 }),
  address: varchar("address", { length: 256 }),
  properties: json("properties").$type<Properties>(),
  status: mysqlEnum("status", LeadStatuses).notNull().default(LEAD_NEW),
  orgId: varchar("org_id", { length: 256 }).notNull(),
  convertedContactId: bigint("converted_contact_id", {
    mode: "number",
    unsigned: true,
  }),
});

// relations
export const leadsRelations = relations(leads, ({ one }) => ({
  org: one(orgs, {
    fields: [leads.orgId],
    references: [orgs.id],
  }),
  contact: one(contacts, {
    fields: [leads.convertedContactId],
    references: [contacts.id],
  }),
}));

// Schema for leads - used to validate API requests
export const insertLeadSchema = createInsertSchema(leads, {
  properties: z.array(
    z.object({
      name: z.string().min(1, "Please enter a valid name."),
    })
  ),
});

export const insertLeadParams = createSelectSchema(leads, {
  name: z.string().min(1, "Name cannot be empty."),
  company: z.string().min(1, "Company cannot be empty."),
  properties: z.array(
    z.object({
      name: z.string().min(1, "Please enter a valid name."),
    })
  ),
}).omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
  convertedContactId: true,
});

export const updateLeadSchema = createSelectSchema(leads, {
  properties: z.array(
    z.object({
      name: z.string().min(1, "Please enter a valid name."),
    })
  ),
}).omit({
  createdAt: true,
  updatedAt: true,
  convertedContactId: true,
});

export const updateLeadParams = createSelectSchema(leads, {
  name: z.string().min(1, "Name cannot be empty."),
  company: z.string().min(1, "Company cannot be empty."),
  properties: z.array(
    z.object({
      name: z.string().min(1, "Please enter a valid name."),
    })
  ),
}).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
  convertedContactId: true,
});

export const leadIdSchema = updateLeadSchema.pick({ id: true });
export const leadPropertiesSchema = updateLeadSchema.pick({ properties: true });

// Types for leads - used to type API request params and within Components
export type Lead = z.infer<typeof updateLeadSchema>;
export type NewLead = z.infer<typeof insertLeadSchema>;
export type NewLeadParams = z.infer<typeof insertLeadParams>;
export type UpdateLeadParams = z.infer<typeof updateLeadParams>;
export type LeadId = z.infer<typeof leadIdSchema>["id"];
export type LeadProperties = z.infer<typeof leadPropertiesSchema>["properties"];

// this type infers the return from getLeads() - meaning it will include any joins
export type CompleteLead = Awaited<
  ReturnType<typeof getLeads>
>["leads"][number];
